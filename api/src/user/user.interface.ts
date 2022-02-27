export interface User {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  roles?: UserRole;
}
export enum UserRole {
  ADMIN = 'admin',
  CHEIF = 'cheifeditor',
  EDITOR = 'editor',
  USER = 'user',
}
