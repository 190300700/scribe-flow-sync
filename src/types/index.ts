export type TranscriptionMode = 'live' | 'preloaded';
export type TranscriptionType = 'interview' | 'news';

export type TranscriptionStatus = 
  | 'idle' 
  | 'loading' 
  | 'processing' 
  | 'transcribing' 
  | 'error' 
  | 'success';

export interface Speaker {
  id: string;
  name: string;
  isIdentified: boolean;
  detectedMinutes: number[];
}

export interface TranscriptionSegment {
  id: string;
  text: string;
  speakerId?: string;
  timestamp: number; // seconds
  isPlaceholder: boolean;
  placeholderType?: 'unknown_word' | 'unknown_speaker';
}

export interface NewsNote {
  id: string;
  startTime: number;
  endTime?: number;
  segments: TranscriptionSegment[];
  processedText?: string;
}

export interface Project {
  id: string;
  mode: TranscriptionMode;
  type: TranscriptionType;
  rawText: string;
  processedText: string;
  speakers: Speaker[];
  newsNotes?: NewsNote[];
  createdAt: Date;
  autoDeleteAt: Date;
  fileName?: string;
}

export interface Example {
  id: string;
  contentText: string;
  createdAt: Date;
}

export interface TranscriptionState {
  mode: TranscriptionMode | null;
  type: TranscriptionType | null;
  status: TranscriptionStatus;
  currentProject: Project | null;
  isRecording: boolean;
  currentTime: number; // seconds
}
