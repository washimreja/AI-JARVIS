export type JarvisState =
  | "idle"
  | "listening"
  | "processing"
  | "thinking"
  | "executing"
  | "speaking"
  | "success"
  | "error";

export type NavTab =
  | "home"
  | "chat"
  | "voice"
  | "automation"
  | "skills"
  | "files"
  | "system"
  | "memory"
  | "settings";

export interface SystemMetrics {
  cpu: number;
  ram: number;
  gpu?: number;
  storage?: number;
  battery?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  iconName: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  status: "success" | "executing" | "info" | "error";
  details?: string;
}

export interface VoiceStateMeta {
  label: string;
  headline: string;
  subline: string;
  accentColor: string;
  ringGlow: string;
}
