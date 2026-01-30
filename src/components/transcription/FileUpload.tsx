import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileAudio, FileVideo, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { generateMockTranscription } from '@/lib/mockTranscription';

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { setStatus, status, updateRawText, createProject, currentProject } = useTranscriptionStore();

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

  const handleProcess = async () => {
    if (!file) return;

    // Ensure project exists before processing
    if (!currentProject) {
      createProject();
    }

    setStatus('processing');

    // Simulate processing time (1.5-3 seconds)
    const processingTime = 1500 + Math.random() * 1500;
    
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Generate mock transcription
    const transcription = generateMockTranscription(file.name);
    
    updateRawText(transcription);
    setStatus('success');
  };

  return (
    <div className="p-4 space-y-4">
      {!file ? (
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
      ) : (
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
            <Button variant="ghost" size="icon" onClick={clearFile} disabled={status === 'processing'}>
              <X />
            </Button>
          </div>

          <Button
            onClick={handleProcess}
            disabled={status === 'processing'}
            className="w-full mt-4 h-12"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Transcribiendo…
              </>
            ) : (
              'Procesar archivo'
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};
