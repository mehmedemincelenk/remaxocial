import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { checkWhitelist } from '../utils/auth';
import { useAppContext } from '../context/AppContext';

export default function useIcerikGunu() {
  const { user, memberId, notify } = useAppContext();
  const [state, setState] = useState({
    step: 0, session: null, memberId: null, email: '', completed: [], 
    loading: true, finishing: false, authView: 'login'
  });

  const update = (val) => setState(s => ({ ...s, ...val }));

  useEffect(() => {
    const init = async () => {
      if (!user || !memberId) {
        update({ step: 0, loading: false });
        return;
      }

      update({ loading: true });
      const ay = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      
      const { data: ex } = await supabase.from('test_icerik_gunu_sessions').select('*').eq('member_id', memberId).eq('ay', ay).single();
      if (ex) {
        const completed = ex.steps_completed || [];
        
        // Find the first incomplete/skipped step to resume from
        const ALL_STEPS = [
          'altin_bilgi',
          'story_anket',
          'satildi_kiralandi',
          'musteri_mesaji',
          'musteri_video',
          'business_vibe',
          'seri_face'
        ];

        let resumeStep = 1;
        const firstIncompleteIdx = ALL_STEPS.findIndex(stepKey => {
          return !completed.includes(stepKey) || completed.includes(`${stepKey}_skipped`);
        });

        if (firstIncompleteIdx !== -1) {
          resumeStep = firstIncompleteIdx + 1;
        } else if (completed.length >= 7) {
          resumeStep = 8;
        }

        update({ 
          session: ex.id, 
          completed, 
          step: resumeStep, 
          loading: false, 
          memberId 
        });
      } else {
        const { data: n } = await supabase.from('test_icerik_gunu_sessions').insert([{ member_id: memberId, ay, insta_username: memberId }]).select().single();
        update({ session: n?.id, step: 1, loading: false, memberId });
      }
    };

    init();
  }, [user, memberId]);

  // Developer steps bypass (fully tree-shakable in production builds)
  useEffect(() => {
    const handleStepChange = (e) => {
      const nextStep = e.detail?.step;
      if (typeof nextStep === 'number') {
        update({ step: nextStep });
      }
    };
    window.addEventListener('dev-step-change', handleStepChange);
    return () => window.removeEventListener('dev-step-change', handleStepChange);
  }, []);

  const login = async (email) => {
    update({ loading: true });
    const { allowed } = await checkWhitelist(email);
    if (!allowed) return notify('Kayıt bulunamadı!', 'error'), update({ loading: false });
    const { error } = await supabase.auth.signInWithOtp({ email: email.toLowerCase().trim(), options: { emailRedirectTo: window.location.origin + window.location.pathname }});
    if (!error) {
      update({ authView: 'check_email', loading: false });
      notify('Giriş bağlantısı gönderildi!', 'success');
    }
  };

  const complete = async (stepName) => {
    update({ loading: true });
    
    // Remove any previous versions of this step (completed or skipped)
    const baseName = stepName.replace('_skipped', '');
    let newSteps = state.completed.filter(s => s !== baseName && s !== `${baseName}_skipped`);
    newSteps.push(stepName);

    await supabase.from('test_icerik_gunu_sessions').update({ steps_completed: newSteps }).eq('id', state.session);

    const ALL_STEPS = [
      'altin_bilgi',
      'story_anket',
      'satildi_kiralandi',
      'musteri_mesaji',
      'musteri_video',
      'business_vibe',
      'seri_face'
    ];

    // Find the next incomplete step starting from the current index (state.step)
    let nextIncompleteIdx = ALL_STEPS.findIndex((stepKey, idx) => {
      if (idx < state.step) return false; // only search forward first
      return !newSteps.includes(stepKey) || newSteps.includes(`${stepKey}_skipped`);
    });

    // If no forward incomplete steps, search from the beginning
    if (nextIncompleteIdx === -1) {
      nextIncompleteIdx = ALL_STEPS.findIndex((stepKey) => {
        return !newSteps.includes(stepKey) || newSteps.includes(`${stepKey}_skipped`);
      });
    }

    if (nextIncompleteIdx !== -1) {
      update({ completed: newSteps, loading: false, step: nextIncompleteIdx + 1 });
      if (nextIncompleteIdx + 1 < state.step) {
        notify('Atladığınız adıma geri yönlendiriliyorsunuz.', 'info');
      }
    } else {
      update({ completed: newSteps, loading: false, finishing: true, step: 8 });
    }
  };

  const prevStep = () => {
    if (state.step > 1) {
      update({ step: state.step - 1 });
    }
  };

  return { ...state, update, login, complete, prevStep };
}
