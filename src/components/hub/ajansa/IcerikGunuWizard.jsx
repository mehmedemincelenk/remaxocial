import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../../utils/supabaseClient';
import GlassCard from '../../ortak/GlassCard';
import { Loader2 } from 'lucide-react';

import Step1_AltinBilgiler from './steps/Step1_AltinBilgiler';
import Step2_MusteriMemnuniyeti from './steps/Step2_MusteriMemnuniyeti';
import Step3_BusinessVibe from './steps/Step3_BusinessVibe';
import Step4_HaberReels from './steps/Step4_HaberReels';
import Step5_SeriFace from './steps/Step5_SeriFace';

export default function IcerikGunuWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initSession();
  }, []);

  const initSession = async () => {
    setIsLoading(true);
    try {
      // 1. Get or create member_id from localStorage
      let mId = localStorage.getItem('member_id');
      if (!mId) {
        mId = 'member_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('member_id', mId);
      }
      setMemberId(mId);

      // 2. Get current month 'YYYY-MM'
      const date = new Date();
      const ay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // 3. Find active session for this month
      const { data: existing, error: fetchErr } = await supabase
        .from('TEST_icerik_gunu_sessions')
        .select('*')
        .eq('member_id', mId)
        .eq('ay', ay)
        .single();

      if (existing) {
        setSessionId(existing.id);
        setCompletedSteps(existing.steps_completed || []);
        // Go to next incomplete step (simplified: just start from 1 and let them navigate, or jump to next)
      } else {
        // Create new session
        const { data: newSession, error: insertErr } = await supabase
          .from('TEST_icerik_gunu_sessions')
          .insert([{ member_id: mId, ay }])
          .select()
          .single();
        
        if (newSession) {
          setSessionId(newSession.id);
        }
      }
    } catch (e) {
      console.error('Session init error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepComplete = async (stepName) => {
    if (!completedSteps.includes(stepName)) {
      const newSteps = [...completedSteps, stepName];
      setCompletedSteps(newSteps);
      
      // Update session
      await supabase
        .from('TEST_icerik_gunu_sessions')
        .update({ steps_completed: newSteps })
        .eq('id', sessionId);
    }
    
    // Go to next step if not final
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert("İçerik günü tamamlandı! Tebrikler.");
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <Loader2 className="animate-spin" color="#fff" />
      </div>
    );
  }

  const stepProps = {
    sessionId,
    memberId,
    onComplete: handleStepComplete,
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <GlassCard padding="1rem" borderRadius="16px" style={{ marginBottom: '1rem', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', color: '#fff', margin: 0 }}>İçerik Günü</h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>
            Adım {currentStep} / 5
          </div>
        </div>
        
        {/* Progress bar */}
        <div style={{ width: '100%', height: '4px', background: '#333', borderRadius: '4px', marginTop: '0.5rem', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%', background: 'var(--color-accent)' }}
          />
        </div>
      </GlassCard>

      <div style={{ position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && <Step1_AltinBilgiler {...stepProps} />}
            {currentStep === 2 && <Step2_MusteriMemnuniyeti {...stepProps} />}
            {currentStep === 3 && <Step3_BusinessVibe {...stepProps} />}
            {currentStep === 4 && <Step4_HaberReels {...stepProps} />}
            {currentStep === 5 && <Step5_SeriFace {...stepProps} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
