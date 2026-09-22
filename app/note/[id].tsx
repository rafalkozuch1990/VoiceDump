import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getNotes, saveNotes } from '../../lib/storage';
import { Note } from '../../lib/types';

export default function NoteDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    getNotes().then((notes) => {
      const found = notes.find((item) => item.id === String(id));
      setNote(found || null);
    });
  }, [id]);

  async function toggleTask(taskId: string) {
    if (!note) return;

    const updated: Note = {
      ...note,
      tasks: note.tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      ),
    };

    setNote(updated);

    const notes = await getNotes();
    const next = notes.map((item) => (item.id === updated.id ? updated : item));
    await saveNotes(next);
  }

  async function deleteNote() {
    if (!note) return;

    const notes = await getNotes();
    const next = notes.filter((item) => item.id !== note.id);
    await saveNotes(next);
    router.replace('/notes');
  }

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Nie znaleziono notatki.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.summary}>{note.summary}</Text>

      <Text style={styles.section}>Zadania</Text>

      {note.tasks.map((task) => (
        <Pressable
          key={task.id}
          style={styles.task}
          onPress={() => toggleTask(task.id)}
        >
          <View style={[styles.box, task.done && styles.boxDone]} />
          <Text style={[styles.taskText, task.done && styles.taskDone]}>
            {task.text}
          </Text>
        </Pressable>
      ))}

      <Pressable
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert('Usunąć notatkę?', 'Tej operacji nie cofniesz.', [
            { text: 'Anuluj', style: 'cancel' },
            { text: 'Usuń', style: 'destructive', onPress: deleteNote },
          ])
        }
      >
        <Text style={styles.deleteText}>Usuń notatkę</Text>
      </Pressable>
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
    marginBottom: 8,
  },
  summary: {
    color: '#A1A1AA',
    fontSize: 16,
    marginBottom: 32,
  },
  section: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#A1A1AA',
    marginRight: 12,
  },
  boxDone: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  taskText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  taskDone: {
    color: '#71717A',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    marginTop: 40,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#3F1D1D',
  },
  deleteText: {
    color: '#FCA5A5',
    textAlign: 'center',
    fontWeight: '600',
  },
  empty: {
    color: '#71717A',
    fontSize: 16,
  },
});
