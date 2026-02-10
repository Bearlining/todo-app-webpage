// 待办事项类型定义
export interface Todo {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tags: string[]; // 标签
  createdAt: Date;
  dueDate: Date | null;
  reminderTime: Date | null;
  completedAt: Date | null;
  isArchived: boolean; // 是否归档
  archivedAt: Date | null; // 归档时间
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly'; // 重复类型
  repeatEndDate: Date | null; // 重复结束日期
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  todayTotal: number;
  todayCompleted: number;
  overdue: number;
  completionRate: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface DailySummary {
  date: string;
  total: number;
  completed: number;
  completionRate: number;
}

// 马卡龙色板
export const MACARON_COLORS = {
  pink: '#FFB7B2',      // 粉红
  mint: '#B5EAD7',      // 薄荷绿
  lavender: '#E2F0CB',  // 淡紫（实际是浅黄绿）
  peach: '#FFDAC1',     // 桃色
  sky: '#C7CEEA',       // 天蓝
  cream: '#FFF5BA',     // 奶油黄
  coral: '#FF9AA2',     // 珊瑚红
  mintBlue: '#B5EAD7',  // 薄荷蓝
} as const;

export const PRIORITY_COLORS = {
  low: '#B5EAD7',      // 薄荷绿 - 低优先级
  medium: '#FFDAC1',   // 桃色 - 中优先级
  high: '#FFB7B2',     // 粉红 - 高优先级
} as const;

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'work', name: '工作', color: '#FFB7B2', icon: 'briefcase' },
  { id: 'life', name: '生活', color: '#B5EAD7', icon: 'home' },
  { id: 'study', name: '学习', color: '#C7CEEA', icon: 'book' },
  { id: 'health', name: '健康', color: '#FFDAC1', icon: 'heart' },
  { id: 'other', name: '其他', color: '#E2F0CB', icon: 'more-horizontal' },
];
