import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useVoiceCommands } from '../src/index';

const App = () => {
  const { isListening, startListening, stopListening, transcript, error } =
    useVoiceCommands({
      commands: [
        {
          command: 'hello',
          action: () => {
            console.log('Hello command executed!');
            alert('Hello! How can I help you?');
          },
          description: 'Say hello',
        },
        {
          command: 'open settings',
          action: () => {
            console.log('Opening settings...');
            alert('Settings opened!');
          },
          description: 'Open app settings',
        },
        {
          command: 'close',
          action: () => {
            console.log('Closing...');
            alert('Closed!');
          },
          description: 'Close current view',
        },
      ],
      continuous: false,
      lang: 'en-US',
      onStart: () => {
        console.log('Voice recognition started');
      },
      onEnd: () => {
        console.log('Voice recognition ended');
      },
      onError: (err) => {
        console.error('Voice recognition error:', err);
      },
      onResult: (text) => {
        console.log('Recognized:', text);
      },
    });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>React Native Voice Actions</Text>
        <Text style={styles.subtitle}>Example App</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Status:</Text>
          <Text
            style={[
              styles.statusValue,
              isListening && styles.statusListening,
            ]}
          >
            {isListening ? 'Listening...' : 'Not Listening'}
          </Text>
        </View>

        {transcript ? (
          <View style={styles.transcriptContainer}>
            <Text style={styles.transcriptLabel}>Transcript:</Text>
            <Text style={styles.transcriptText}>{transcript}</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorLabel}>Error:</Text>
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        ) : null}

        <View style={styles.commandsContainer}>
          <Text style={styles.commandsTitle}>Available Commands:</Text>
          <Text style={styles.commandItem}>• "hello"</Text>
          <Text style={styles.commandItem}>• "open settings"</Text>
          <Text style={styles.commandItem}>• "close"</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              isListening ? styles.buttonStop : styles.buttonStart,
            ]}
            onPress={isListening ? stopListening : startListening}
          >
            <Text style={styles.buttonText}>
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  statusValue: {
    fontSize: 16,
    color: '#666',
  },
  statusListening: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  transcriptContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  transcriptLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  transcriptText: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    width: '100%',
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f44336',
  },
  errorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c62828',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#c62828',
  },
  commandsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commandsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  commandItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonStart: {
    backgroundColor: '#2196F3',
  },
  buttonStop: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;

