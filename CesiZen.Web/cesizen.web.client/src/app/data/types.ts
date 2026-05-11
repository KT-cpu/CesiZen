export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  pseudo: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  initials: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image?: string;
  publishedAt: string;
  active: boolean;
}

export interface EmotionConfig {
  id: string;
  name: string;
  baseEmotion: string;
  baseEmotionId: number;
  active: boolean;
}

export interface EmotionEntry {
  id: string;
  userId: string;
  date: string;
  baseEmotion: string;
  emotion: string;
  emotion1Id: number;
  emotion2Id: number;
  createdAt: string;
}

export interface EmotionStat {
  name: string;
  value: number;
  percentage: number;
}

export interface EmotionReportSummary {
  start: string;
  end: string;
  totalEntries: number;
  statsByBaseEmotion: EmotionStat[];
  entries: EmotionEntry[];
}

export const BASE_EMOTIONS = ['Joie', 'Colère', 'Peur', 'Tristesse', 'Surprise', 'Dégoût'] as const;
export type BaseEmotion = typeof BASE_EMOTIONS[number];

export const EMOTION_COLORS: Record<string, string> = {
  Joie: '#F9A825',
  Colère: '#E53935',
  Peur: '#7B1FA2',
  Tristesse: '#1976D2',
  Surprise: '#00897B',
  Dégoût: '#6D4C41',
};

export const ARTICLE_CATEGORIES = [
  'Stress',
  'Anxiété',
  'Émotions',
  'Sommeil',
  'Activités de détente',
  'Relations sociales',
  'Développement personnel',
];
