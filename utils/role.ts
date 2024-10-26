import { BadgeVariant } from '@/components/ui/badge';
import { $Enums } from '@prisma/client';
export const roleMap: Record<$Enums.Role, string> = {
  DIRECTOR: '이사',
  CEO: '대표',
  DEPARTMENT: '국장',
  TEAM_LEADER: '팀장',
  TEACHER: '선생',
  STUDENT: '학생',
  UNKNOWN: '직급',
} as const;

// 필요한 경우 한글에서 영문으로의 매핑도 추가할 수 있습니다
export const reverseRoleMap: Record<string, $Enums.Role> = Object.entries(
  roleMap
).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value]: key,
  }),
  {}
);

export const getRoleBadgeVariant = (role: $Enums.Role): BadgeVariant => {
  const variants: Record<$Enums.Role, BadgeVariant> = {
    DIRECTOR: 'orange',
    CEO: 'yellow',
    DEPARTMENT: 'purple',
    TEAM_LEADER: 'purple',
    TEACHER: 'blue',
    STUDENT: 'green',
    UNKNOWN: 'default',
  };
  return variants[role];
};

export const getRoleDisplayName = (role: $Enums.Role): string => {
  return roleMap[role];
};
