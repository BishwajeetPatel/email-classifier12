'use client';

import { EmailCategory } from '@/app/types';
import { AlertCircle, Tag, Users, TrendingUp, Ban, Inbox } from 'lucide-react';

interface FilterButtonsProps {
  selectedCategory: EmailCategory | 'All';
  onSelectCategory: (category: EmailCategory | 'All') => void;
  categoryCounts: Record<string, number>;
}

/**
 * Filter buttons for email categories
 */
export default function FilterButtons({
  selectedCategory,
  onSelectCategory,
  categoryCounts,
}: FilterButtonsProps) {
  const categories: Array<{
    name: EmailCategory | 'All';
    icon: any;
    color: string;
    bgColor: string;
    borderColor: string;
  }> = [
    {
      name: 'All',
      icon: Inbox,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
    },
    {
      name: 'Important',
      icon: AlertCircle,
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
    },
    {
      name: 'Promotions',
      icon: Tag,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
    },
    {
      name: 'Social',
      icon: Users,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
    },
    {
      name: 'Marketing',
      icon: TrendingUp,
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-300',
    },
    {
      name: 'Spam',
      icon: Ban,
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      borderColor: 'border-orange-300',
    },
    {
      name: 'General',
      icon: Inbox,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-300',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map(({ name, icon: Icon, color, bgColor, borderColor }) => {
          const count = categoryCounts[name] || 0;
          const isSelected = selectedCategory === name;

          return (
            <button
              key={name}
              onClick={() => onSelectCategory(name)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-medium
                ${
                  isSelected
                    ? `${bgColor} ${borderColor} ${color} shadow-md`
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{name}</span>
              <span
                className={`
                  px-2 py-0.5 rounded-full text-xs font-bold
                  ${isSelected ? 'bg-white bg-opacity-70' : 'bg-gray-100'}
                `}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}