interface Task {
  id?: number;
  superpower: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
  superhero_id: number;
};

export default Task;