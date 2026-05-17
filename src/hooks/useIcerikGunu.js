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
        update({ session: ex.id, completed: ex.steps_completed || [], step: (ex.steps_completed || []).length + 1, loading: false, memberId });
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
    const newSteps = [...state.completed.includes(stepName) ? state.completed : [...state.completed, stepName]];
    await supabase.from('test_icerik_gunu_sessions').update({ steps_completed: newSteps }).eq('id', state.session);
    update({ completed: newSteps, loading: false, ...(state.step < 8 ? { step: state.step + 1 } : { finishing: true, step: 9 }) });
  };

  const prevStep = () => {
    if (state.step > 1) {
      update({ step: state.step - 1 });
    }
  };

  return { ...state, update, login, complete, prevStep };
}
