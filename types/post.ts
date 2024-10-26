import { Role } from './user';

export interface Post {
  id: number;
  name: string;
  role: Role;
  content: string;
  createdAt: Date; // 정렬을 위한 Date 객체 추가
  avatarUrl: string;
}
