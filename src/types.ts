export type AgeGroup = 'kids' | 'teenagers' | 'adults';
export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  age: number;
  ageGroup: AgeGroup;
  englishLevel: EnglishLevel;
  goals: string[];
  personaPreference: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface SessionFeedback {
  pronunciation: number;
  grammar: number;
  fluency: number;
  vocabulary: number;
  confidence: number;
  notes: string;
  improvements: string[];
  newWords: string[];
}

export interface SpeakingSession {
  id: string;
  userId: string;
  timestamp: string;
  duration: number;
  topic: string;
  persona: string;
  feedback?: SessionFeedback;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}
