
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { getNotes, saveNotes } from '../lib/storage';
import { Note } from '../lib/types';

export default function NotesScreen() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    getNotes().then(setNotes);
  }, []);

  async function addTestNote() {
    const note: Note = {
      id: Date.now().toString(),
      title: 'Szybka myśl',
      summary: 'To jest testowa notatka.',
      tasks: [
        { id: '1', text: 'Sprawdzić aplikację', done: false },
      ],
      createdAt: new Date().toISOString(),
    };

    const next = [note, ...notes];
    setNotes(next);
    await saveNotes(next);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notatki</Text>

      <Pressable style={styles.button} onPress={addTestNote}>
        <Text style={styles.buttonText}>Dodaj testową notatkę</Text>
      </Pressable>

      {notes.length === 0 ? (
        <Text style={styles.empty}>Brak notatek. Nagraj pierwszą myśl.</Text>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/note/${item.id}`} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSummary}>{item.summary}</Text>
            </Link>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#27272A',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  empty: {
    color: '#71717A',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#18181B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardSummary: {
    color: '#A1A1AA',
  },
});
