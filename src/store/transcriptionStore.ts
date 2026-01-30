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
  createProject: () => void;
  updateRawText: (text: string) => void;
  updateProcessedText: (text: string) => void;
  
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

const createEmptyProject = (mode: TranscriptionMode, type: TranscriptionType): Project => ({
  id: generateId(),
  mode,
  type,
  rawText: '',
  processedText: '',
  speakers: [],
  newsNotes: type === 'news' ? [] : undefined,
  createdAt: new Date(),
  autoDeleteAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
});

export const useTranscriptionStore = create<TranscriptionStore>((set, get) => ({
  mode: null,
  type: null,
  status: 'idle',
  currentProject: null,
  isRecording: false,
  isPaused: false,
  currentTime: 0,
  currentNote: null,
  isNoteActive: false,

  setMode: (mode) => set({ mode }),
  
  setType: (type) => set({ type }),
  
  setStatus: (status) => set({ status }),
  
  startRecording: () => {
    const { mode, type, currentProject } = get();
    if (!mode || !type) return;
    
    if (!currentProject) {
      set({ 
        currentProject: createEmptyProject(mode, type),
        isRecording: true,
        isPaused: false,
        status: 'transcribing'
      });
    } else {
      set({ isRecording: true, isPaused: false, status: 'transcribing' });
    }
  },
  
  pauseRecording: () => set({ isPaused: true }),
  
  resumeRecording: () => set({ isPaused: false }),
  
  stopRecording: () => set({ 
    isRecording: false, 
    isPaused: false,
    status: 'success'
  }),
  
  updateCurrentTime: (time) => set({ currentTime: time }),
  
  createProject: () => {
    const { mode, type } = get();
    if (!mode || !type) return;
    set({ currentProject: createEmptyProject(mode, type) });
  },
  
  updateRawText: (text) => {
    const { currentProject } = get();
    if (!currentProject) return;
    set({ 
      currentProject: { ...currentProject, rawText: text }
    });
  },
  
  updateProcessedText: (text) => {
    const { currentProject } = get();
    if (!currentProject) return;
    set({ 
      currentProject: { ...currentProject, processedText: text }
    });
  },
  
  addSpeaker: (speaker) => {
    const { currentProject } = get();
    if (!currentProject) return;
    set({
      currentProject: {
        ...currentProject,
        speakers: [...currentProject.speakers, speaker]
      }
    });
  },
  
  updateSpeaker: (id, name) => {
    const { currentProject } = get();
    if (!currentProject) return;
    set({
      currentProject: {
        ...currentProject,
        speakers: currentProject.speakers.map(s => 
          s.id === id ? { ...s, name, isIdentified: true } : s
        )
      }
    });
  },
  
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
      isNoteActive: true
    });
  },
  
  endNote: () => {
    const { currentNote, currentTime, currentProject } = get();
    if (!currentNote || !currentProject) return;
    
    const completedNote = {
      ...currentNote,
      endTime: currentTime
    };
    
    set({
      currentProject: {
        ...currentProject,
        newsNotes: [...(currentProject.newsNotes || []), completedNote]
      },
      currentNote: null,
      isNoteActive: false
    });
  },
  
  reset: () => set({
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
  
  resetSelection: () => set({
    mode: null,
    type: null,
  }),
}));
