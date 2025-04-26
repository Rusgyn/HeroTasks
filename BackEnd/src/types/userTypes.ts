interface User {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password_digest: string;
  code: string;
  created_at: Date;
  updated_at: Date;
};

export default User;