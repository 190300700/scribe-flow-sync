import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileAudio, FileVideo, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { setStatus, status, currentProject, updateRawText } = useTranscriptionStore();

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
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['audio/', 'video/'];
    return validTypes.some(type => file.type.startsWith(type));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setStatus('processing');
    
    // Simulate processing (would be replaced with actual API call)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate transcription result
    updateRawText(`[Transcripción del archivo: ${file.name}]\n\nJuan: Buenas tardes, gracias por recibirnos.\n\nPersonaje 1: ##palabra_desconocida #Minuto 0:15 del audio#\n\nJuan: Entiendo perfectamente lo que dice.\n\n#Definir personaje del minuto 0:45#: Exactamente, eso es lo que necesitamos.\n`);
    
    setStatus('success');
  };

  const clearFile = () => {
    setFile(null);
    setStatus('idle');
  };

  return (
    <div className="p-4 space-y-4">
      {!file ? (
        <motion.div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-border hover:border-muted-foreground'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <input
            type="file"
            accept="audio/*,video/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <motion.div
            animate={{ y: isDragging ? -5 : 0 }}
            className="space-y-4"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-secondary flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            
            <div>
              <p className="text-foreground font-medium mb-1">
                Arrastra tu archivo aquí
              </p>
              <p className="text-sm text-muted-foreground">
                o toca para seleccionar
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileAudio className="w-4 h-4" />
                Audio
              </span>
              <span className="flex items-center gap-1">
                <FileVideo className="w-4 h-4" />
                Video
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-gradient p-4"
        >
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              {file.type.startsWith('audio/') ? (
                <FileAudio className="w-6 h-6 text-primary" />
              ) : (
                <FileVideo className="w-6 h-6 text-primary" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-foreground">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="rounded-full shrink-0"
              disabled={status === 'processing'}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={handleProcess}
            disabled={status === 'processing'}
            className="w-full mt-4 btn-gradient-primary h-12 rounded-xl"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              'Procesar archivo'
            )}
          </Button>
        </motion.div>
      )}

      {/* Processing status */}
      {status === 'processing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-muted" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          </div>
          <p className="text-muted-foreground">Transcribiendo audio...</p>
          <p className="text-xs text-muted-foreground mt-1">Esto puede tomar unos minutos</p>
        </motion.div>
      )}
    </div>
  );
};
