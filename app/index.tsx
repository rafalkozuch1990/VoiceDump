import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Audio } from 'expo-av';
import { getNotes, saveNotes } from '../lib/storage';
import { Note } from '../lib/types';

export default function HomeScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Brak dostępu', 'VoiceDump potrzebuje mikrofonu.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const created = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(created.recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert('Błąd', 'Nie udało się rozpocząć nagrania.');
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    const uri = recording.getURI();

    const note: Note = {
      id: Date.now().toString(),
      title: 'Nowe nagranie',
      summary: 'Transkrypcja pojawi się tutaj w kolejnej wersji.',
      tasks: [
        { id: '1', text: 'Odsłuchać nagranie', done: false },
      ],
      createdAt: new Date().toISOString(),
      audioUri: uri || undefined,
    };

    const notes = await getNotes();
    await saveNotes([note, ...notes]);
    setRecording(null);
    Alert.alert('Zapisano', 'Notatka została dodana.');
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.title}>VoiceDump</Text>
      <Text style={styles.subtitle}>
        {isRecording ? 'Nagrywanie...' : 'Nagraj myśl. Zamień w działanie.'}
      </Text>

      <Pressable
        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <View style={[styles.innerCircle, isRecording && styles.innerCircleActive]} />
      </Pressable>

      <Text style={styles.hint}>
        {isRecording ? 'Kliknij, aby zatrzymać' : 'Kliknij, aby nagrać'}
      </Text>

      <Link href="/notes" style={styles.link}>
        Zobacz notatki
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#A1A1AA',
    marginBottom: 60,
    textAlign: 'center',
  },
  recordButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#3F3F46',
  },
  recordButtonActive: {
    borderColor: '#EF4444',
  },
  innerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
  },
  innerCircleActive: {
    borderRadius: 8,
    width: 28,
    height: 28,
  },
  hint: {
    marginTop: 24,
    fontSize: 14,
    color: '#71717A',
  },
  link: {
    marginTop: 40,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
