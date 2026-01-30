import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { LiveControls } from '@/components/transcription/LiveControls';
import { NewsControls } from '@/components/transcription/NewsControls';
import { TranscriptionEditor } from '@/components/transcription/TranscriptionEditor';
import { FileUpload } from '@/components/transcription/FileUpload';
import { ExportPanel } from '@/components/transcription/ExportPanel';
import { SpeakerIdentification } from '@/components/transcription/SpeakerIdentification';
import { Sidebar, SidebarTrigger } from '@/components/layout/Sidebar';

interface TranscriptionViewProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export const TranscriptionView = ({ onBack, onNavigate }: TranscriptionViewProps) => {
  const { mode, type, status, currentProject, isRecording, currentTime, updateCurrentTime } = useTranscriptionStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [speakersOpen, setSpeakersOpen] = useState(false);

  // Simulate time progression when recording
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        updateCurrentTime(currentTime + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRecording, currentTime, updateCurrentTime]);

  const getTitle = () => {
    if (type === 'interview') return 'Entrevista';
    return 'Noticiero';
  };

  const getSubtitle = () => {
    if (mode === 'live') return 'Transcripción en vivo';
    return 'Archivo precargado';
  };

  const hasUnidentifiedSpeakers = currentProject?.speakers.some(s => !s.isIdentified);

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(view) => {
          setSidebarOpen(false);
          if (view === 'home') {
            onBack();
          } else {
            onNavigate(view);
          }
        }}
      />

      {/* Header */}
      <header className="p-4 flex items-center gap-3 border-b border-border">
        <SidebarTrigger onClick={() => setSidebarOpen(true)} />
        
        <div className="flex-1">
          <h1 className="font-bold text-foreground">{getTitle()}</h1>
          <p className="text-xs text-muted-foreground">{getSubtitle()}</p>
        </div>

        {type === 'interview' && currentProject?.speakers.length > 0 && (
          <Button
            variant={hasUnidentifiedSpeakers ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSpeakersOpen(true)}
            className={hasUnidentifiedSpeakers ? 'btn-gradient-primary' : ''}
          >
            <Users className="w-4 h-4 mr-1" />
            {currentProject.speakers.length}
          </Button>
        )}
      </header>

      {/* Status indicator */}
      {status !== 'idle' && status !== 'success' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`px-4 py-2 text-center text-sm ${
            status === 'error' ? 'bg-destructive/20 text-destructive' :
            status === 'processing' || status === 'transcribing' ? 'bg-primary/20 text-primary' :
            'bg-secondary text-muted-foreground'
          }`}
        >
          {status === 'loading' && 'Cargando...'}
          {status === 'processing' && 'Procesando archivo...'}
          {status === 'transcribing' && '🔴 Transcribiendo en tiempo real...'}
          {status === 'error' && 'Error al procesar. Intenta nuevamente.'}
        </motion.div>
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-auto pb-40">
        {/* SIMPLE RENDER LOGIC: Only check if rawText exists */}
        {currentProject?.rawText && currentProject.rawText.length > 0 ? (
          // Show editor when there's text
          <TranscriptionEditor />
        ) : (
          // Show file upload when no text
          <FileUpload />
        )}
      </main>

      {/* Controls */}
      {mode === 'live' && <LiveControls />}
      {type === 'news' && mode === 'live' && isRecording && <NewsControls />}

      {/* Export button */}
      <ExportPanel />

      {/* Speaker identification modal */}
      <SpeakerIdentification
        isOpen={speakersOpen}
        onClose={() => setSpeakersOpen(false)}
      />
    </div>
  );
};
