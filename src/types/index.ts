export interface Board {
  id: string;
  name: string;
  description: string;
  chipType: string;
  imageUrl?: string;
  pins: PinMapping[];
  createdAt: string;
}

export interface PinMapping {
  id: string;
  componentLabel: string;
  gpioPin: number;
  type: 'input' | 'output' | 'i2c' | 'spi' | 'uart' | 'power' | 'adc';
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export interface ProjectConfig {
  id: string;
  name: string;
  boardId: string;
  connections: Connection[];
  createdAt: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  label: string;
}

export interface GeneratedCode {
  cpp: string;
  binary?: string;
}
