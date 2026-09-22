export type Task = {
  id: string;
  text: string;
  done: boolean;
};

export type Note = {
  id: string;
  title: string;
  summary: string;
  tasks: Task[];
  createdAt: string;
  audioUri?: string;
};
