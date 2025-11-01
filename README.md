# react-native-voice-actions

A React Native library for handling voice commands and actions with ease.

## Installation

```bash
npm install react-native-voice-actions
```

or

```bash
yarn add react-native-voice-actions
```

## Prerequisites

For React Native, you'll need to install a speech recognition library. We recommend using `@react-native-voice/voice`:

```bash
npm install @react-native-voice/voice
```

For iOS, you'll need to add the following to your `Info.plist`:

```xml
<key>NSSpeechRecognitionUsageDescription</key>
<string>We need access to speech recognition to process voice commands.</string>
<key>NSMicrophoneUsageDescription</key>
<string>We need access to your microphone to listen for voice commands.</string>
```

For Android, add these permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.INTERNET" />
```

## Usage

### Basic Example

```tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useVoiceCommands } from 'react-native-voice-actions';

const App = () => {
  const { isListening, startListening, stopListening, transcript, error } =
    useVoiceCommands({
      commands: [
        {
          command: 'hello',
          action: () => {
            console.log('Hello command executed!');
          },
        },
        {
          command: 'open settings',
          action: () => {
            // Open settings logic
          },
        },
      ],
    });

  return (
    <View>
      <Text>Listening: {isListening ? 'Yes' : 'No'}</Text>
      <Text>Transcript: {transcript}</Text>
      {error && <Text>Error: {error.message}</Text>}
      <Button
        title={isListening ? 'Stop' : 'Start'}
        onPress={isListening ? stopListening : startListening}
      />
    </View>
  );
};
```

## API Reference

### `useVoiceCommands(config: VoiceActionsConfig)`

A React hook that provides voice command functionality.

#### Parameters

`config: VoiceActionsConfig`

- `commands: VoiceCommand[]` (required) - Array of voice commands to recognize
- `continuous?: boolean` - Whether to continuously listen for commands (default: `false`)
- `interimResults?: boolean` - Whether to return interim results (default: `false`)
- `lang?: string` - Language code for speech recognition (default: `'en-US'`)
- `onStart?: () => void` - Callback when listening starts
- `onEnd?: () => void` - Callback when listening ends
- `onError?: (error: Error) => void` - Callback when an error occurs
- `onResult?: (transcript: string) => void` - Callback when a result is received

#### Returns

```typescript
{
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  transcript: string;
  error: Error | null;
}
```

### `VoiceCommand`

```typescript
interface VoiceCommand {
  command: string;
  action: () => void | Promise<void>;
  description?: string;
}
```

- `command: string` - The voice command phrase to recognize
- `action: () => void | Promise<void>` - Function to execute when command is recognized
- `description?: string` - Optional description of the command

## Examples

### Multiple Commands

```tsx
const { startListening, stopListening } = useVoiceCommands({
  commands: [
    {
      command: 'turn on light',
      action: () => turnOnLight(),
      description: 'Turns on the light',
    },
    {
      command: 'turn off light',
      action: () => turnOffLight(),
      description: 'Turns off the light',
    },
    {
      command: 'play music',
      action: () => playMusic(),
      description: 'Starts playing music',
    },
  ],
});
```

### With Error Handling

```tsx
const { error, startListening } = useVoiceCommands({
  commands: [
    {
      command: 'save',
      action: async () => {
        await saveData();
      },
    },
  ],
  onError: (err) => {
    console.error('Voice recognition error:', err);
    Alert.alert('Error', err.message);
  },
});
```

### Continuous Listening

```tsx
const { isListening } = useVoiceCommands({
  commands: [
    { command: 'next', action: () => goToNext() },
    { command: 'previous', action: () => goToPrevious() },
  ],
  continuous: true, // Keeps listening after a command
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

