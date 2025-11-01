export interface VoiceCommand {
  command: string;
  action: () => void | Promise<void>;
  description?: string;
}

export interface VoiceActionsConfig {
  commands: VoiceCommand[];
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  onResult?: (transcript: string) => void;
}

export interface UseVoiceCommandsReturn {
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  transcript: string;
  error: Error | null;
}

