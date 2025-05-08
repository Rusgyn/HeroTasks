export interface Task {
  id?: number;
  superpower: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
  superhero_id: number;
};

export interface NewTaskInput {
  superpower: string;
  superhero_name: string;
};