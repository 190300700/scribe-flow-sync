import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { Speaker } from '@/types';

interface SpeakerIdentificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpeakerIdentification = ({ isOpen, onClose }: SpeakerIdentificationProps) => {
  const { currentProject, updateSpeaker } = useTranscriptionStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const unidentifiedSpeakers = currentProject?.speakers.filter(s => !s.isIdentified) || [];

  const handleSave = (speaker: Speaker) => {
    if (newName.trim()) {
      updateSpeaker(speaker.id, newName.trim());
      setEditingId(null);
      setNewName('');
    }
  };

  const formatMinutes = (minutes: number[]) => {
    if (minutes.length === 0) return '';
    if (minutes.length === 1) return `Minuto ${minutes[0]}`;
    return `Minutos ${minutes.slice(0, -1).join(', ')} y ${minutes[minutes.length - 1]}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5 text-primary" />
            Identificar Hablantes
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Asigna nombres a los hablantes detectados para mejorar la transcripción
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4 max-h-[60vh] overflow-auto scrollbar-thin">
          {unidentifiedSpeakers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Check className="w-12 h-12 text-success mx-auto mb-3" />
              <p className="text-foreground font-medium">¡Todos identificados!</p>
              <p className="text-sm text-muted-foreground">
                No hay hablantes pendientes de identificar
              </p>
            </motion.div>
          ) : (
            unidentifiedSpeakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-secondary/50 border border-border"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-medium text-foreground">{speaker.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatMinutes(speaker.detectedMinutes)}
                    </p>
                  </div>
                  <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                </div>

                {editingId === speaker.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nombre del hablante"
                      className="flex-1 bg-background border-border"
                      autoFocus
                    />
                    <Button
                      onClick={() => handleSave(speaker)}
                      size="icon"
                      className="shrink-0 btn-gradient-success"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setEditingId(null);
                        setNewName('');
                      }}
                      size="icon"
                      variant="ghost"
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => {
                      setEditingId(speaker.id);
                      setNewName('');
                    }}
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                  >
                    Asignar nombre
                  </Button>
                )}
              </motion.div>
            ))
          )}
        </div>

        {unidentifiedSpeakers.length > 0 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Los nombres se reemplazarán automáticamente en todo el texto
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
