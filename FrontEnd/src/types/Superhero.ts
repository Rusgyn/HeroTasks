
export type Task = {
  id: number;
  superpower: string;
  completed: boolean;
};

export type Superhero = {
  id: number;
  superhero_name: string;
  strength: number;
  tasks: Task[];
};
