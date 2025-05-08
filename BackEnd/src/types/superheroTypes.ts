export interface Superhero {
  id?: number;
  superhero_name: string;
  strength: number;
  created_at: Date;
  updated_at: Date;
  user_id: number;
};

export interface NewSuperheroInput {
  superhero_name: string;
};