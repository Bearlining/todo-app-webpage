import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { TodoCard } from './TodoCard';
import { Card } from '../ui/card';

interface CalendarViewProps {
  onEdit: (todo: any) => void;
  onToggle: (id: string) => void;
  onArchive?: (id: string) => void;
}

export function CalendarView({ onEdit, onToggle, onArchive }: CalendarViewProps) {
  const { state } = useTodo();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper function to create consistent date key
  const getDateKey = (date: Date): string => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Get calendar data
  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Get todos for this month (check both createdAt and dueDate)
    const monthTodos = state.todos.filter(todo => {
      const createdDate = new Date(todo.createdAt);
      const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
      return (
        !todo.isArchived &&
        ((createdDate.getFullYear() === year && createdDate.getMonth() === month) ||
         (dueDate && dueDate.getFullYear() === year && dueDate.getMonth() === month))
      );
    });

    // Group by date (use dueDate if available, otherwise createdAt)
    const todosByDate: Record<string, typeof monthTodos> = {};
    monthTodos.forEach(todo => {
      const dateToUse = todo.dueDate || todo.createdAt;
      const dateKey = getDateKey(new Date(dateToUse));
      if (!todosByDate[dateKey]) {
        todosByDate[dateKey] = [];
      }
      todosByDate[dateKey].push(todo);
    });

    // Build calendar grid
    const days: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return { days, todosByDate, monthTodos };
  }, [year, month, state.todos]);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getTodosForDate = (day: number) => {
    const dateKey = getDateKey(new Date(year, month, day));
    return calendarData.todosByDate[dateKey] || [];
  };

  const selectedDateTodos = selectedDate
    ? getTodosForDate(selectedDate.getDate())
    : [];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-pink-50 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {year}年 {month + 1}月
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-pink-50 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Today button */}
        <button
          onClick={goToToday}
          className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-pink-300 to-peach-300 text-white font-medium text-sm mb-4"
        >
          回到今天
        </button>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(day => (
            <div key={day} className="text-center text-xs text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="h-10" />;
            }

            const date = new Date(year, month, day);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const dayTodos = getTodosForDate(day);
            const hasCompleted = dayTodos.some(t => t.isCompleted);
            const hasPending = dayTodos.some(t => !t.isCompleted);

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`h-10 rounded-lg flex flex-col items-center justify-center text-sm transition-all relative ${
                  isToday ? 'ring-2 ring-pink-300' : ''
                } ${
                  isSelected ? 'bg-pink-400 text-white' : ''
                } ${
                  !isSelected && !isToday ? 'hover:bg-pink-50' : ''
                } text-gray-700`}
              >
                <span>{day}</span>
                {dayTodos.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {hasCompleted && <div className="w-1.5 h-1.5 rounded-full bg-mint-400" />}
                    {hasPending && <div className="w-1.5 h-1.5 rounded-full bg-peach-400" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Selected date todos */}
      {selectedDate && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-800">
            {selectedDate.toLocaleDateString('zh-CN', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </h3>

          {selectedDateTodos.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-gray-400">该日期暂无待办事项</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {selectedDateTodos.map(todo => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={() => {}}
                  onEdit={onEdit}
                  onArchive={onArchive}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Month summary */}
      <Card className="p-4">
        <h3 className="font-medium text-gray-800 mb-3">本月统计</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{calendarData.monthTodos.length}</p>
            <p className="text-xs text-gray-400">总数</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-mint-600">
              {calendarData.monthTodos.filter(t => t.isCompleted).length}
            </p>
            <p className="text-xs text-gray-400">已完成</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-peach-600">
              {calendarData.monthTodos.filter(t => !t.isCompleted).length}
            </p>
            <p className="text-xs text-gray-400">待完成</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
