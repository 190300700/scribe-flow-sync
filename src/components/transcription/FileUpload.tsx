import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileAudio, FileVideo, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { generateMockTranscription } from '@/lib/mockTranscription';

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { setStatus, status, forceSetRawText } = useTranscriptionStore();

  const isValidFile = (file: File) =>
    file.type.startsWith('audio/') || file.type.startsWith('video/');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && isValidFile(droppedFile)) setFile(droppedFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setStatus('idle');
  };

  // FORCED FLOW - No conditions, no guards, always executes
  const handleProcess = async () => {
    // Step 1: Set status to processing immediately
    setStatus('processing');

    // Step 2: Simulate processing (1.5 seconds)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 3: Generate transcription
    const transcription = generateMockTranscription(file?.name || 'archivo');
    
    // Step 4: Force set rawText (creates project internally, no conditions)
    forceSetRawText(transcription);

    // Step 5: Set status to success
    setStatus('success');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Processing indicator - ALWAYS visible when processing */}
      {status === 'processing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 bg-primary/20 rounded-2xl text-center"
        >
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
          <p className="text-2xl font-bold text-primary">PROCESANDO…</p>
          <p className="text-sm text-muted-foreground mt-2">Generando transcripción</p>
        </motion.div>
      )}

      {/* File upload area - only when not processing */}
      {status !== 'processing' && !file && (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border'
          }`}
        >
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-medium">Arrastra tu archivo aquí o toca para seleccionar</p>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileAudio className="w-4 h-4" /> Audio
              </span>
              <span className="flex items-center gap-1">
                <FileVideo className="w-4 h-4" /> Video
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* File selected - show process button */}
      {status !== 'processing' && file && (
        <motion.div className="card-gradient p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              {file.type.startsWith('audio/') ? (
                <FileAudio className="w-6 h-6 text-primary" />
              ) : (
                <FileVideo className="w-6 h-6 text-primary" />
              )}
            </div>
            <div className="flex-1 truncate">
              <p className="font-medium truncate">{file.name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile}>
              <X />
            </Button>
          </div>

          {/* PROCESS BUTTON - No disabled state, always clickable */}
          <Button
            onClick={handleProcess}
            className="w-full mt-4 h-12 btn-gradient-primary"
          >
            Procesar archivo
          </Button>
        </motion.div>
      )}
    </div>
  );
};
