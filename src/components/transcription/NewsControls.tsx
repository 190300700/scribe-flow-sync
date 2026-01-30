import { motion } from 'framer-motion';
import { Play, Circle, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';

export const NewsControls = () => {
  const { 
    isNoteActive, 
    startNote, 
    endNote,
    currentTime
  } = useTranscriptionStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-24 left-4 right-4 flex justify-center gap-4"
    >
      {/* Start Note Button */}
      <Button
        onClick={startNote}
        disabled={isNoteActive}
        className={`btn-gradient-success w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 ${
          isNoteActive ? 'opacity-50' : ''
        }`}
      >
        <Play className="w-8 h-8" />
        <span className="text-xs font-medium">INICIO</span>
      </Button>

      {/* Timer when note is active */}
      {isNoteActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center"
        >
          <div className="relative">
            <Circle className="w-4 h-4 text-success animate-ping absolute" />
            <Circle className="w-4 h-4 text-success" />
          </div>
          <span className="ml-2 font-mono text-success text-lg">
            {formatTime(currentTime)}
          </span>
        </motion.div>
      )}

      {/* End Note Button */}
      <Button
        onClick={endNote}
        disabled={!isNoteActive}
        className={`btn-gradient-danger w-20 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 ${
          !isNoteActive ? 'opacity-50' : ''
        }`}
      >
        <Square className="w-8 h-8" />
        <span className="text-xs font-medium">FIN</span>
      </Button>
    </motion.div>
  );
};
