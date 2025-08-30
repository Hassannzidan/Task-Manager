export interface Task {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  selected?: boolean;
}
