// src/data/mockPricingData.ts
import type { PricingPackage } from '@/types/pricing.types';

export const mockPricingPackages: PricingPackage[] = [
  {
    id: '1',
    name: 'BJJ Начинающие - Месяц',
    type: 'single_group',
    paymentType: 'monthly',
    price: 25000,
    groupIds: [1],
    sectionIds: [1],
    clubId: 1,
    active: true
  },
  {
    id: '2',
    name: 'BJJ Все группы - Месяц',
    type: 'full_section',
    paymentType: 'monthly',
    price: 35000,
    sectionIds: [1],
    clubId: 1,
    active: true
  },
  {
    id: '3',
    name: 'MMA Kids - 8 занятий',
    type: 'single_group',
    paymentType: 'session_pack',
    price: 20000,
    sessionCount: 8,
    validityDays: 30,
    groupIds: [4],
    sectionIds: [2],
    clubId: 1,
    active: true
  },
  {
    id: '4',
    name: 'BJJ + MMA - Годовой',
    type: 'multiple_sections',
    paymentType: 'yearly',
    price: 350000,
    sectionIds: [1, 2],
    clubId: 1,
    active: true
  },
  {
    id: '5',
    name: 'Весь клуб - Полугодовой',
    type: 'full_club',
    paymentType: 'semi_annual',
    price: 200000,
    clubId: 1,
    active: true
  }
];

// Mock groups for testing (use with your existing section data)
export const mockGroupsForPricing = [
  { id: 1, name: 'Начинающие', level: 'Beginner', capacity: 20, sectionId: 1 },
  { id: 2, name: 'Средний уровень', level: 'Intermediate', capacity: 15, sectionId: 1 },
  { id: 3, name: 'Продвинутые', level: 'Advanced', capacity: 12, sectionId: 1 },
  { id: 4, name: 'Kids', level: 'Beginner', capacity: 15, sectionId: 2 },
  { id: 5, name: 'Взрослые', level: 'All levels', capacity: 20, sectionId: 2 },
];
