import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import { VoiceActionsConfig, UseVoiceCommandsReturn } from './types';

// Try to import @react-native-voice/voice if available
let Voice: any = null;
try {
  Voice = require('@react-native-voice/voice');
} catch (e) {
  // Voice library not installed
}

export const useVoiceCommands = (
  config: VoiceActionsConfig
): UseVoiceCommandsReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const recognitionRef = useRef<any>(null);

  const processCommand = useCallback(
    (text: string) => {
      const normalizedText = text.toLowerCase().trim();
      
      for (const cmd of config.commands) {
        const normalizedCommand = cmd.command.toLowerCase().trim();
        
        if (
          normalizedText === normalizedCommand ||
          normalizedText.includes(normalizedCommand) ||
          normalizedCommand.includes(normalizedText)
        ) {
          try {
            const result = cmd.action();
            // Handle async actions
            if (result instanceof Promise) {
              result.catch((err) => {
                const error = err instanceof Error ? err : new Error(String(err));
                if (config.onError) {
                  config.onError(error);
                } else {
                  setError(error);
                }
              });
            }
            if (config.onResult) {
              config.onResult(text);
            }
            return true;
          } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            if (config.onError) {
              config.onError(error);
            } else {
              setError(error);
            }
            return false;
          }
        }
      }
      return false;
    },
    [config]
  );

  const startListening = useCallback(async () => {
    try {
      setError(null);

      // React Native implementation
      if (Platform.OS !== 'web' && Voice) {
        if (!recognitionRef.current) {
          Voice.onSpeechStart = () => {
            setIsListening(true);
            if (config.onStart) {
              config.onStart();
            }
          };

          Voice.onSpeechResults = (e: any) => {
            if (e.value && e.value.length > 0) {
              const transcriptText = e.value[0];
              setTranscript(transcriptText);
              processCommand(transcriptText);
            }
          };

          Voice.onSpeechError = (e: any) => {
            const error = new Error(`Speech recognition error: ${e.error?.message || 'Unknown error'}`);
            setError(error);
            setIsListening(false);
            if (config.onError) {
              config.onError(error);
            }
          };

          Voice.onSpeechEnd = () => {
            setIsListening(false);
            if (config.onEnd) {
              config.onEnd();
            }
            if (!config.continuous) {
              recognitionRef.current = null;
            }
          };

          recognitionRef.current = Voice;
        }

        await Voice.start(config.lang || 'en-US');
      } 
      // Web implementation
      else if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
        const SpeechRecognition =
          (window as any).webkitSpeechRecognition ||
          (window as any).SpeechRecognition;
        
        const recognition = new SpeechRecognition();
        recognition.continuous = config.continuous ?? false;
        recognition.interimResults = config.interimResults ?? false;
        recognition.lang = config.lang || 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          if (config.onStart) {
            config.onStart();
          }
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
          processCommand(transcriptText);
        };

        recognition.onerror = (event: any) => {
          const error = new Error(`Speech recognition error: ${event.error}`);
          setError(error);
          setIsListening(false);
          if (config.onError) {
            config.onError(error);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          if (config.onEnd) {
            config.onEnd();
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        throw new Error(
          'Speech recognition not available. For React Native, please install @react-native-voice/voice'
        );
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (config.onError) {
        config.onError(error);
      }
    }
  }, [config, processCommand]);

  const stopListening = useCallback(async () => {
    try {
      if (recognitionRef.current) {
        if (Platform.OS !== 'web' && Voice) {
          await Voice.stop();
          await Voice.cancel();
        } else if (recognitionRef.current.stop) {
          recognitionRef.current.stop();
        }
        if (!config.continuous) {
          recognitionRef.current = null;
        }
      }
      setIsListening(false);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (config.onError) {
        config.onError(error);
      }
    }
  }, [config]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        if (Platform.OS !== 'web' && Voice) {
          Voice.stop().catch(() => {});
          Voice.cancel().catch(() => {});
        } else if (recognitionRef.current.stop) {
          recognitionRef.current.stop();
        }
      }
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    error,
  };
};

