import { motion } from 'framer-motion';
import { Mic, FileAudio } from 'lucide-react';
import { TranscriptionMode } from '@/types';
import { useTranscriptionStore } from '@/store/transcriptionStore';

interface ModeCardProps {
  mode: TranscriptionMode;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const ModeCard = ({ mode, title, description, icon, isSelected, onClick }: ModeCardProps) => (
  <motion.button
    onClick={onClick}
    className={`selection-card w-full text-left ${isSelected ? 'selected' : ''}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="relative z-10 flex items-start gap-4">
      <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary/30' : 'bg-secondary'} transition-colors`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'} transition-all flex items-center justify-center`}>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 bg-primary-foreground rounded-full"
          />
        )}
      </div>
    </div>
  </motion.button>
);

export const ModeSelector = () => {
  const { mode, setMode } = useTranscriptionStore();

  return (
    <div className="space-y-4">
      <motion.h2 
        className="text-2xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-gradient">¿Cómo trabajarás?</span>
      </motion.h2>
      
      <ModeCard
        mode="live"
        title="En Vivo"
        description="Transcripción en tiempo real mientras capturas audio del sistema"
        icon={<Mic className="w-6 h-6 text-primary" />}
        isSelected={mode === 'live'}
        onClick={() => setMode('live')}
      />
      
      <ModeCard
        mode="preloaded"
        title="Precargado"
        description="Sube un archivo de audio o video para procesarlo"
        icon={<FileAudio className="w-6 h-6 text-accent" />}
        isSelected={mode === 'preloaded'}
        onClick={() => setMode('preloaded')}
      />
    </div>
  );
};
