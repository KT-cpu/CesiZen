import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../services/apiClient';

export interface Information {
  id: number;
  titre: string;
  type: string;
  contenu: string;
  dateCreation: string;
  dateModification: string;
}

export interface Emotion1 {
  id: number;
  nom: string;
  nomCreateur: string;
  dateCreation: string;
  emotions2: Emotion2[];
}

export interface Emotion2 {
  id: number;
  nom: string;
  nomCreateur: string;
  dateCreation: string;
  emotion1Id: number;
  emotion1Nom: string;
}

export interface TrackerEmotion {
  id: number;
  dateSaisie: string;
  emotion2Id: number;
  emotion2Nom: string;
  emotion1Id: number;
  emotion1Nom: string;
}

export interface RapportEmotion {
  debut: string;
  fin: string;
  totalEntrees: number;
  statistiquesParEmotion1: { emotion1Nom: string; nombreOccurrences: number; pourcentage: number }[];
  entrees: TrackerEmotion[];
}

interface AppDataContextType {
  // Informations
  getInformations: () => Promise<Information[]>;
  getInformationById: (id: number) => Promise<Information>;
  createInformation: (data: Omit<Information, 'id' | 'dateCreation' | 'dateModification'>) => Promise<Information>;
  updateInformation: (id: number, data: Partial<Information>) => Promise<Information>;
  deleteInformation: (id: number) => Promise<void>;

  // Émotions
  getEmotions: () => Promise<Emotion1[]>;
  createEmotion1: (nom: string) => Promise<Emotion1>;
  createEmotion2: (nom: string, emotion1Id: number) => Promise<Emotion2>;
  deleteEmotion1: (id: number) => Promise<void>;
  deleteEmotion2: (id: number) => Promise<void>;

  // Tracker
  getJournal: () => Promise<TrackerEmotion[]>;
  addTrackerEntry: (emotion2Id: number, dateSaisie?: string) => Promise<TrackerEmotion>;
  updateTrackerEntry: (id: number, emotion2Id: number, dateSaisie?: string) => Promise<TrackerEmotion>;
  deleteTrackerEntry: (id: number) => Promise<void>;
  getRapport: (debut: string, fin: string) => Promise<RapportEmotion>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const value: AppDataContextType = {
    // Informations
    getInformations: () =>
      apiClient.get<Information[]>('/information'),
    getInformationById: (id) =>
      apiClient.get<Information>(`/information/${id}`),
    createInformation: (data) =>
      apiClient.post<Information>('/information', data),
    updateInformation: (id, data) =>
      apiClient.put<Information>(`/information/${id}`, data),
    deleteInformation: (id) =>
      apiClient.delete(`/information/${id}`),

    // Émotions
    getEmotions: () =>
      apiClient.get<Emotion1[]>('/emotion'),
    createEmotion1: (nom) =>
      apiClient.post<Emotion1>('/emotion', { nom }),
    createEmotion2: (nom, emotion1Id) =>
      apiClient.post<Emotion2>('/emotion/sous-emotion', { nom, emotion1Id }),
    deleteEmotion1: (id) =>
      apiClient.delete(`/emotion/${id}`),
    deleteEmotion2: (id) =>
      apiClient.delete(`/emotion/sous-emotion/${id}`),

    // Tracker
    getJournal: () =>
      apiClient.get<TrackerEmotion[]>('/trackeremotion'),
    addTrackerEntry: (emotion2Id, dateSaisie) =>
      apiClient.post<TrackerEmotion>('/trackeremotion', { emotion2Id, dateSaisie }),
    updateTrackerEntry: (id, emotion2Id, dateSaisie) =>
      apiClient.put<TrackerEmotion>(`/trackeremotion/${id}`, { emotion2Id, dateSaisie }),
    deleteTrackerEntry: (id) =>
      apiClient.delete(`/trackeremotion/${id}`),
    getRapport: (debut, fin) =>
      apiClient.get<RapportEmotion>(`/trackeremotion/rapport?debut=${debut}&fin=${fin}`),
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used within AppDataProvider');
  return context;
}