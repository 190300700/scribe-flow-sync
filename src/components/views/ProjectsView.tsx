import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, FileText, Users, Radio, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';

interface ProjectsViewProps {
  onBack: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectsView = ({ onBack, onSelectProject }: ProjectsViewProps) => {
  // Mock data - would come from storage/API
  const [projects] = useState<Project[]>([
    {
      id: '1',
      mode: 'live',
      type: 'interview',
      rawText: 'Juan: Buenas tardes...',
      processedText: '',
      speakers: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      autoDeleteAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 13),
    },
    {
      id: '2',
      mode: 'preloaded',
      type: 'news',
      rawText: 'Nota sobre economía...',
      processedText: '',
      speakers: [],
      newsNotes: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      autoDeleteAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9),
      fileName: 'noticiero_tarde.mp4',
    },
  ]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString();
  };

  const getDaysRemaining = (deleteAt: Date) => {
    const diff = deleteAt.getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full"
        >
          ← Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Proyectos Pasados</h1>
          <p className="text-xs text-muted-foreground">
            Se eliminan automáticamente después de 2 semanas
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto scrollbar-thin">
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">Sin proyectos recientes</p>
            <p className="text-sm text-muted-foreground">
              Los proyectos que crees aparecerán aquí
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.button
                  key={project.id}
                  onClick={() => onSelectProject(project)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full card-gradient p-4 text-left"
                >
                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${project.type === 'interview' ? 'bg-primary/20' : 'bg-accent/20'}`}>
                        {project.type === 'interview' ? (
                          <Users className="w-5 h-5 text-primary" />
                        ) : (
                          <Radio className="w-5 h-5 text-accent" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {project.type === 'interview' ? 'Entrevista' : 'Noticiero'}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {project.mode === 'live' ? 'En vivo' : 'Precargado'}
                          </span>
                        </div>
                        
                        {project.fileName && (
                          <p className="font-medium text-foreground truncate">
                            {project.fileName}
                          </p>
                        )}
                        
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {project.rawText.substring(0, 50)}...
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(project.createdAt)}
                          </span>
                          <span className={`text-xs ${getDaysRemaining(project.autoDeleteAt) <= 3 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {getDaysRemaining(project.autoDeleteAt)} días restantes
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};
