import React, { useState, useContext } from 'react';
import { Check, Trash2, Edit2, Bell, Clipboard } from 'lucide-react';
import { Todo, PRIORITY_COLORS } from '../../types/todo';
import { Checkbox } from '../ui/checkbox';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { OfficeDecoration } from '../ui/office-decoration';
import { cn } from '../../lib/utils';
import { useTodo } from '../../context/TodoContext';

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onArchive?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  selectionMode?: boolean;
}

export function TodoCard({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onArchive,
  isSelected = false,
  onSelect,
  selectionMode = false
}: TodoCardProps) {
  const { state } = useTodo();

  const priorityColor = PRIORITY_COLORS[todo.priority];
  const category = state.categories.find(c => c.id === todo.category);

  // 根据优先级选择装饰图标
  const getDecorationIcon = () => {
    switch (todo.priority) {
      case 'high': return 'clipboard';
      case 'medium': return 'pencil';
      default: return 'sticky';
    }
  };

  return (
    <Card
      variant="colored-border"
      decorationColor={category?.color || priorityColor}
      className={cn(
        "p-4 transition-all duration-300 group relative overflow-hidden",
        todo.isCompleted ? "bg-gray-50/50" : "bg-white/90",
        isSelected && "ring-2 ring-pink-400",
      )}
    >
      {/* Office decoration icon */}
      <OfficeDecoration
        type={getDecorationIcon() as any}
        position="top-right"
        size="sm"
        color={category?.color || priorityColor}
        opacity={0.4}
      />

      <div className="flex items-start gap-3">
        {/* Selection checkbox in selection mode */}
        {selectionMode ? (
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(todo.id, !isSelected);
            }}
            className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0",
              isSelected
                ? "bg-pink-400 border-pink-400"
                : "border-gray-300"
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        ) : (
          <Checkbox
            checked={todo.isCompleted}
            onCheckedChange={() => onToggle(todo.id)}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="px-2 py-0.5 rounded-full text-xs font-medium text-white flex-shrink-0"
              style={{ backgroundColor: priorityColor }}
            >
              {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs text-white flex-shrink-0"
              style={{ backgroundColor: category?.color || '#ccc' }}
            >
              {category?.name || todo.category}
            </span>
            {todo.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
              >
                #{tag}
              </span>
            ))}
            {todo.reminderTime && (
              <span className="flex items-center gap-1 text-xs text-pink-400">
                <Bell className="w-3 h-3" />
              </span>
            )}
            {todo.repeatType !== 'none' && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-sky-100 text-sky-600 flex-shrink-0">
                {todo.repeatType === 'daily' ? '每日' : todo.repeatType === 'weekly' ? '每周' : '每月'}
              </span>
            )}
          </div>

          <h3
            className={cn(
              "text-base font-medium text-gray-800 mb-1",
              todo.isCompleted && "line-through text-gray-400"
            )}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p className={cn(
              "text-sm text-gray-500 line-clamp-2",
              todo.isCompleted && "line-through"
            )}>
              {todo.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
            {todo.dueDate && (
              <span className={cn(
                todo.dueDate < new Date() && !todo.isCompleted && "text-red-400"
              )}>
                截止：{new Date(todo.dueDate).toLocaleDateString('zh-CN')}
              </span>
            )}
            <span>
              {new Date(todo.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>
        </div>

        {/* Action buttons (only in non-selection mode) */}
        {!selectionMode && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(todo);
              }}
              className="h-8 w-8 hover:bg-blue-50"
            >
              <Edit2 className="w-4 h-4 text-blue-400" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
