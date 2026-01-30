import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeSelector } from './ModeSelector';
import { TypeSelector } from './TypeSelector';
import { useTranscriptionStore } from '@/store/transcriptionStore';

interface SelectionFlowProps {
  onComplete: () => void;
}

export const SelectionFlow = ({ onComplete }: SelectionFlowProps) => {
  const [step, setStep] = useState<'mode' | 'type'>('mode');
  const { mode, type, createProject } = useTranscriptionStore();

  const handleNext = () => {
    if (step === 'mode' && mode) {
      setStep('type');
    } else if (step === 'type' && type) {
      createProject();
      onComplete();
    }
  };

  const handleBack = () => {
    if (step === 'type') {
      setStep('mode');
    }
  };

  const canProceed = step === 'mode' ? !!mode : !!type;

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <AnimatePresence>
          {step === 'type' && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {/* Progress indicator */}
        <div className="flex-1 flex items-center justify-center gap-2">
          <div className={`w-2 h-2 rounded-full transition-colors ${step === 'mode' ? 'bg-primary' : 'bg-muted-foreground'}`} />
          <div className={`w-8 h-0.5 ${step === 'type' ? 'bg-primary' : 'bg-muted'} transition-colors`} />
          <div className={`w-2 h-2 rounded-full transition-colors ${step === 'type' ? 'bg-primary' : 'bg-muted'}`} />
        </div>
        
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Content */}
      <main className="flex-1 px-4 pb-24 overflow-auto">
        <AnimatePresence mode="wait">
          {step === 'mode' ? (
            <motion.div
              key="mode"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ModeSelector />
            </motion.div>
          ) : (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TypeSelector />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom action */}
      <AnimatePresence>
        {canProceed && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 p-4 glass safe-area-bottom"
          >
            <Button
              onClick={handleNext}
              className="w-full btn-gradient-primary h-14 text-lg rounded-xl"
            >
              {step === 'type' ? 'Comenzar' : 'Continuar'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
