import { Role } from './user';

export interface Post {
  id: number;
  name: string;
  role: Role;
  content: string;
  date: string;
  avatarUrl: string;
}
