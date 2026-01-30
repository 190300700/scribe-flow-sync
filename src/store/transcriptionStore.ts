import { create } from 'zustand';
import { 
  TranscriptionMode, 
  TranscriptionType, 
  TranscriptionStatus, 
  Project, 
  Speaker,
  NewsNote
} from '@/types';

interface TranscriptionStore {
  // Selection state
  mode: TranscriptionMode | null;
  type: TranscriptionType | null;
  
  // Transcription state
  status: TranscriptionStatus;
  currentProject: Project | null;
  isRecording: boolean;
  isPaused: boolean;
  currentTime: number;
  
  // News mode state
  currentNote: NewsNote | null;
  isNoteActive: boolean;
  
  // Actions
  setMode: (mode: TranscriptionMode) => void;
  setType: (type: TranscriptionType) => void;
  setStatus: (status: TranscriptionStatus) => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  updateCurrentTime: (time: number) => void;
  
  // Project actions
  createProject: () => Project | null;
  updateRawText: (text: string) => void;
  updateProcessedText: (text: string) => void;
  forceSetRawText: (text: string) => void; // New: forced update without conditions
  
  // Speaker actions
  addSpeaker: (speaker: Speaker) => void;
  updateSpeaker: (id: string, name: string) => void;
  
  // News note actions
  startNote: () => void;
  endNote: () => void;
  
  // Reset
  reset: () => void;
  resetSelection: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const createEmptyProject = (
  mode: TranscriptionMode,
  type: TranscriptionType
): Project => ({
  id: generateId(),
  mode,
  type,
  rawText: '',
  processedText: '',
  speakers: [],
  newsNotes: type === 'news' ? [] : undefined,
  createdAt: new Date(),
  autoDeleteAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
});

export const useTranscriptionStore = create<TranscriptionStore>((set, get) => ({
  // Initial state
  mode: null,
  type: null,
  status: 'idle',
  currentProject: null,
  isRecording: false,
  isPaused: false,
  currentTime: 0,
  currentNote: null,
  isNoteActive: false,

  // Selection
  setMode: (mode) => set({ mode }),
  setType: (type) => set({ type }),
  setStatus: (status) => set({ status }),

  // Recording
  startRecording: () => {
    const { mode, type, currentProject } = get();
    if (!mode || !type) return;

    if (!currentProject) {
      const project = createEmptyProject(mode, type);
      set({
        currentProject: project,
        isRecording: true,
        isPaused: false,
        status: 'transcribing',
      });
    } else {
      set({
        isRecording: true,
        isPaused: false,
        status: 'transcribing',
      });
    }
  },

  pauseRecording: () => set({ isPaused: true }),
  resumeRecording: () => set({ isPaused: false }),

  stopRecording: () =>
    set({
      isRecording: false,
      isPaused: false,
      status: 'success',
    }),

  updateCurrentTime: (time) => set({ currentTime: time }),

  // Projects
  createProject: () => {
    const { mode, type } = get();
    if (!mode || !type) return null;

    const project = createEmptyProject(mode, type);
    set({ currentProject: project });
    return project;
  },

  updateRawText: (text) => {
    let { currentProject, mode, type } = get();

    // If no project exists, create one first
    if (!currentProject) {
      if (!mode || !type) {
        console.warn('Cannot update raw text: mode or type not set');
        return;
      }
      currentProject = createEmptyProject(mode, type);
    }

    // Update the project with the new text
    set({
      currentProject: {
        ...currentProject,
        rawText: text,
      },
    });
  },

  // FORCED update - always works, creates project if needed, no conditions
  forceSetRawText: (text) => {
    const { mode, type } = get();
    
    // Create a new project with the text, using defaults if mode/type not set
    const project = createEmptyProject(
      mode || 'preloaded',
      type || 'interview'
    );
    project.rawText = text;
    
    set({ currentProject: project });
  },

  updateProcessedText: (text) => {
    const { currentProject } = get();
    if (!currentProject) return;

    set({
      currentProject: {
        ...currentProject,
        processedText: text,
      },
    });
  },

  // Speakers
  addSpeaker: (speaker) => {
    const { currentProject } = get();
    if (!currentProject) return;

    set({
      currentProject: {
        ...currentProject,
        speakers: [...currentProject.speakers, speaker],
      },
    });
  },

  updateSpeaker: (id, name) => {
    const { currentProject } = get();
    if (!currentProject) return;

    set({
      currentProject: {
        ...currentProject,
        speakers: currentProject.speakers.map((s) =>
          s.id === id ? { ...s, name, isIdentified: true } : s
        ),
      },
    });
  },

  // News notes
  startNote: () => {
    const { currentTime, currentProject } = get();
    if (!currentProject) return;

    const newNote: NewsNote = {
      id: generateId(),
      startTime: currentTime,
      segments: [],
    };

    set({
      currentNote: newNote,
      isNoteActive: true,
    });
  },

  endNote: () => {
    const { currentNote, currentTime, currentProject } = get();
    if (!currentNote || !currentProject) return;

    const completedNote = {
      ...currentNote,
      endTime: currentTime,
    };

    set({
      currentProject: {
        ...currentProject,
        newsNotes: [...(currentProject.newsNotes || []), completedNote],
      },
      currentNote: null,
      isNoteActive: false,
    });
  },

  // Reset
  reset: () =>
    set({
      mode: null,
      type: null,
      status: 'idle',
      currentProject: null,
      isRecording: false,
      isPaused: false,
      currentTime: 0,
      currentNote: null,
      isNoteActive: false,
    }),

  resetSelection: () =>
    set({
      mode: null,
      type: null,
    }),
}));

