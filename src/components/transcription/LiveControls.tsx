import { motion } from 'framer-motion';
import { Mic, Pause, Square, Play, Copy, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';

export const LiveControls = () => {
  const { 
    isRecording, 
    isPaused, 
    currentTime,
    startRecording, 
    pauseRecording, 
    resumeRecording, 
    stopRecording,
    currentProject
  } = useTranscriptionStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    if (currentProject?.rawText) {
      navigator.clipboard.writeText(currentProject.rawText);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="floating-controls"
    >
      {/* Timer */}
      <div className="px-3 py-1.5 bg-secondary rounded-lg font-mono text-sm text-foreground min-w-[70px] text-center">
        {formatTime(currentTime)}
      </div>

      {/* Main controls */}
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="btn-gradient-primary w-14 h-14 rounded-full p-0"
          >
            <Mic className="w-6 h-6" />
          </Button>
        ) : (
          <>
            <Button
              onClick={isPaused ? resumeRecording : pauseRecording}
              variant="secondary"
              className="w-12 h-12 rounded-full p-0"
            >
              {isPaused ? (
                <Play className="w-5 h-5" />
              ) : (
                <Pause className="w-5 h-5" />
              )}
            </Button>

            <Button
              onClick={stopRecording}
              className="btn-gradient-danger w-14 h-14 rounded-full p-0 relative"
            >
              {!isPaused && (
                <span className="absolute inset-0 rounded-full bg-destructive animate-pulse-glow" />
              )}
              <Square className="w-5 h-5 relative z-10" />
            </Button>
          </>
        )}
      </div>

      {/* Quick actions */}
      <Button
        onClick={handleCopy}
        variant="ghost"
        size="icon"
        className="rounded-full"
        disabled={!currentProject?.rawText}
      >
        <Copy className="w-5 h-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        <MoreVertical className="w-5 h-5" />
      </Button>
    </motion.div>
  );
};
