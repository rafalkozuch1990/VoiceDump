import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from './types';

const KEY = 'voicedump_notes';

export async function getNotes(): Promise<Note[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveNotes(notes: Note[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(notes));
}
