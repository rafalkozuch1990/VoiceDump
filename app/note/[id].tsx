import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function NoteDetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notatka</Text>
      <Text style={styles.meta}>ID: {String(id)}</Text>
      <Text style={styles.empty}>Szczegóły notatki pojawią się tutaj.</Text>
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
  meta: {
    color: '#71717A',
    marginBottom: 24,
  },
  empty: {
    color: '#A1A1AA',
    fontSize: 16,
  },
});
