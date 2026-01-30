import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SelectionFlow } from '@/components/selection/SelectionFlow';
import { TranscriptionView } from '@/components/views/TranscriptionView';
import { ExamplesView } from '@/components/views/ExamplesView';
import { ProjectsView } from '@/components/views/ProjectsView';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { Project } from '@/types';

type ViewState = 'selection' | 'transcription' | 'examples' | 'projects';

const Index = () => {
  const [view, setView] = useState<ViewState>('selection');
  const { reset, resetSelection } = useTranscriptionStore();

  const handleSelectionComplete = () => {
    setView('transcription');
  };

  const handleNavigate = (newView: string) => {
    if (newView === 'home') {
      reset();
      setView('selection');
    } else if (newView === 'examples') {
      setView('examples');
    } else if (newView === 'projects') {
      setView('projects');
    }
  };

  const handleBack = () => {
    if (view === 'examples' || view === 'projects') {
      setView('transcription');
    } else {
      resetSelection();
      setView('selection');
    }
  };

  const handleSelectProject = (project: Project) => {
    // Would load the project into state
    setView('transcription');
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === 'selection' && (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SelectionFlow onComplete={handleSelectionComplete} />
          </motion.div>
        )}

        {view === 'transcription' && (
          <motion.div
            key="transcription"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <TranscriptionView
              onBack={handleBack}
              onNavigate={handleNavigate}
            />
          </motion.div>
        )}

        {view === 'examples' && (
          <motion.div
            key="examples"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <ExamplesView onBack={handleBack} />
          </motion.div>
        )}

        {view === 'projects' && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <ProjectsView
              onBack={handleBack}
              onSelectProject={handleSelectProject}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
