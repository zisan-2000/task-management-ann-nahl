export interface Task {
  id: number;
  link: string;
  username: string;
  email: string;
  password: string;
  status: "pending" | "completed" | "not-completed";
  timeAllotted: number;
  timeRemaining: number | null;
  timerActive: boolean;
  timerExpired: boolean;
  extraTimeSpent: number;
  totalTimeSpent: number;
}

export interface TabData {
  id: string;
  title: string;
  links: {
    id: number;
    link: string;
    username: string;
    email: string;
    password: string;
  }[];
}
