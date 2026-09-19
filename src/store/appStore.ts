import { Board, User, ProjectConfig, Connection } from '../types';

// Simulated database
const initialBoards: Board[] = [
  {
    id: 'board-1',
    name: 'MekaMind ESP32 Pro',
    description: 'Advanced ESP32 board with 4 relay outputs, 4 digital inputs, I2C display support, and temperature sensor.',
    chipType: 'ESP32-WROOM-32',
    pins: [
      { id: 'p1', componentLabel: 'IN1', gpioPin: 34, type: 'input' },
      { id: 'p2', componentLabel: 'IN2', gpioPin: 35, type: 'input' },
      { id: 'p3', componentLabel: 'IN3', gpioPin: 32, type: 'input' },
      { id: 'p4', componentLabel: 'IN4', gpioPin: 33, type: 'input' },
      { id: 'p5', componentLabel: 'RLY1', gpioPin: 25, type: 'output' },
      { id: 'p6', componentLabel: 'RLY2', gpioPin: 26, type: 'output' },
      { id: 'p7', componentLabel: 'RLY3', gpioPin: 27, type: 'output' },
      { id: 'p8', componentLabel: 'RLY4', gpioPin: 14, type: 'output' },
      { id: 'p9', componentLabel: 'SDA', gpioPin: 21, type: 'i2c' },
      { id: 'p10', componentLabel: 'SCL', gpioPin: 22, type: 'i2c' },
      { id: 'p11', componentLabel: 'TEMP', gpioPin: 36, type: 'adc' },
      { id: 'p12', componentLabel: 'LED', gpioPin: 2, type: 'output' },
    ],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'board-2',
    name: 'MekaMind ESP32 Lite',
    description: 'Compact ESP32 board with 2 relay outputs, 2 digital inputs, and LED indicator.',
    chipType: 'ESP32-WROOM-32',
    pins: [
      { id: 'p1', componentLabel: 'IN1', gpioPin: 34, type: 'input' },
      { id: 'p2', componentLabel: 'IN2', gpioPin: 35, type: 'input' },
      { id: 'p3', componentLabel: 'RLY1', gpioPin: 25, type: 'output' },
      { id: 'p4', componentLabel: 'RLY2', gpioPin: 26, type: 'output' },
      { id: 'p5', componentLabel: 'LED', gpioPin: 2, type: 'output' },
    ],
    createdAt: '2024-02-20T10:00:00Z',
  },
  {
    id: 'board-3',
    name: 'MekaMind ESP32 Industrial',
    description: 'Industrial-grade ESP32 board with 8 relay outputs, 8 inputs, RS485 communication, and 4-20mA support.',
    chipType: 'ESP32-WROVER',
    pins: [
      { id: 'p1', componentLabel: 'IN1', gpioPin: 34, type: 'input' },
      { id: 'p2', componentLabel: 'IN2', gpioPin: 35, type: 'input' },
      { id: 'p3', componentLabel: 'IN3', gpioPin: 32, type: 'input' },
      { id: 'p4', componentLabel: 'IN4', gpioPin: 33, type: 'input' },
      { id: 'p5', componentLabel: 'IN5', gpioPin: 36, type: 'input' },
      { id: 'p6', componentLabel: 'IN6', gpioPin: 39, type: 'input' },
      { id: 'p7', componentLabel: 'IN7', gpioPin: 12, type: 'input' },
      { id: 'p8', componentLabel: 'IN8', gpioPin: 13, type: 'input' },
      { id: 'p9', componentLabel: 'RLY1', gpioPin: 25, type: 'output' },
      { id: 'p10', componentLabel: 'RLY2', gpioPin: 26, type: 'output' },
      { id: 'p11', componentLabel: 'RLY3', gpioPin: 27, type: 'output' },
      { id: 'p12', componentLabel: 'RLY4', gpioPin: 14, type: 'output' },
      { id: 'p13', componentLabel: 'RLY5', gpioPin: 4, type: 'output' },
      { id: 'p14', componentLabel: 'RLY6', gpioPin: 16, type: 'output' },
      { id: 'p15', componentLabel: 'RLY7', gpioPin: 17, type: 'output' },
      { id: 'p16', componentLabel: 'RLY8', gpioPin: 18, type: 'output' },
      { id: 'p17', componentLabel: 'SDA', gpioPin: 21, type: 'i2c' },
      { id: 'p18', componentLabel: 'SCL', gpioPin: 22, type: 'i2c' },
      { id: 'p19', componentLabel: 'RS485_TX', gpioPin: 1, type: 'uart' },
      { id: 'p20', componentLabel: 'RS485_RX', gpioPin: 3, type: 'uart' },
      { id: 'p21', componentLabel: 'LED', gpioPin: 2, type: 'output' },
    ],
    createdAt: '2024-03-10T10:00:00Z',
  },
];

// State management
type Listener = () => void;

class AppStore {
  private boards: Board[] = initialBoards;
  private currentUser: User | null = null;
  private projects: ProjectConfig[] = [];
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  getBoards(): Board[] {
    return this.boards;
  }

  getBoard(id: string): Board | undefined {
    return this.boards.find(b => b.id === id);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getProjects(): ProjectConfig[] {
    return this.projects;
  }

  login(email: string, password: string): boolean {
    // Simulated authentication
    if (email === 'admin@mekamind.com' && password === 'admin123') {
      this.currentUser = {
        id: 'admin-1',
        email: 'admin@mekamind.com',
        role: 'admin',
        name: 'Admin',
      };
      this.notify();
      return true;
    }
    if (email === 'user@mekamind.com' && password === 'user123') {
      this.currentUser = {
        id: 'user-1',
        email: 'user@mekamind.com',
        role: 'user',
        name: 'User',
      };
      this.notify();
      return true;
    }
    return false;
  }

  logout() {
    this.currentUser = null;
    this.notify();
  }

  addBoard(board: Omit<Board, 'id' | 'createdAt'>) {
    const newBoard: Board = {
      ...board,
      id: `board-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.boards.push(newBoard);
    this.notify();
    return newBoard;
  }

  updateBoard(id: string, updates: Partial<Board>) {
    const index = this.boards.findIndex(b => b.id === id);
    if (index !== -1) {
      this.boards[index] = { ...this.boards[index], ...updates };
      this.notify();
    }
  }

  deleteBoard(id: string) {
    this.boards = this.boards.filter(b => b.id !== id);
    this.notify();
  }

  addProject(project: Omit<ProjectConfig, 'id' | 'createdAt'>) {
    const newProject: ProjectConfig = {
      ...project,
      id: `project-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.projects.push(newProject);
    this.notify();
    return newProject;
  }

  updateProject(id: string, updates: Partial<ProjectConfig>) {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates };
      this.notify();
    }
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter(p => p.id !== id);
    this.notify();
  }
}

export const appStore = new AppStore();
