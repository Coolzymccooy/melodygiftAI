
export type Genre = 'Afrobeats' | 'Amapiano' | 'Gospel' | 'Pop' | 'R&B' | 'Country' | 'Lullaby' | 'UK Drill';
export type Mood = 'Joyful' | 'Sentimental' | 'Energetic' | 'Soulful' | 'Funny';

export interface SurveyData {
  recipientName: string;
  occasion: string;
  genre: Genre;
  mood: Mood;
  memories: string;
  mustInclude: string;
  language: string;
}

export interface GeneratedSong {
  id: string;
  lyrics: string;
  title: string;
  coverImageUrl: string;
  status: 'draft' | 'generating' | 'ready';
  surveyData: SurveyData;
  audioData?: string; // Base64 PCM data
}

export interface ExampleSong {
  title: string;
  recipient: string;
  genre: Genre;
  coverUrl: string;
}

export enum AppStep {
  Landing = 'landing',
  Survey = 'survey',
  Preview = 'preview',
  Generating = 'generating',
  Dashboard = 'dashboard',
  Examples = 'examples'
}
