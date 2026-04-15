/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mock Data for Smart Timetable Generator
 */

import { 
  Room, Teacher, Module, Level, Group, TimeSlot, 
  Department, CourseSession 
} from './types';

export const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const;

// توليد الفترات الزمنية للأسبوع بالكامل
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const times = [
    { start: '08:00', end: '09:30' },
    { start: '09:45', end: '11:15' },
    { start: '11:30', end: '13:00' },
    { start: '14:00', end: '15:30' },
    { start: '15:45', end: '17:15' },
  ];

  let idCounter = 1;
  DAYS.forEach(day => {
    times.forEach((time, index) => {
      slots.push({
        id: `slot-${idCounter++}`,
        day: day as any,
        startTime: time.start,
        endTime: time.end,
        index: index
      });
    });
  });
  return slots;
}

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 'd1', name: 'Computer Science', headEmail: 'cs_head@univ.dz' },
  { id: 'd2', name: 'Mathematics', headEmail: 'math_head@univ.dz' },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'r1', name: 'Amph-A', type: 'Amphitheatre', capacity: 200 },
  { id: 'r2', name: 'Amph-B', type: 'Amphitheatre', capacity: 150 },
  { id: 'r3', name: 'Room-101', type: 'Classroom', capacity: 50 },
  { id: 'r4', name: 'Room-102', type: 'Classroom', capacity: 50 },
  { id: 'r5', name: 'Lab-01', type: 'CS_Lab', capacity: 30 },
  { id: 'r6', name: 'Lab-02', type: 'CS_Lab', capacity: 30 },
];

export const MOCK_MODULES: Module[] = [
  { id: 'm1', name: 'Algorithms', isFondamental: true, departmentId: 'd1' },
  { id: 'm2', name: 'Databases', isFondamental: true, departmentId: 'd1' },
  { id: 'm3', name: 'Web Dev', isFondamental: false, departmentId: 'd1' },
  { id: 'm4', name: 'Algebra', isFondamental: true, departmentId: 'd2' },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Ahmed', specializations: ['m1', 'm2'], maxHoursPerWeek: 9 },
  { id: 't2', name: 'Dr. Sarah', specializations: ['m2', 'm3'], maxHoursPerWeek: 12 },
  { id: 't3', name: 'Prof. Omar', specializations: ['m4', 'm1'], maxHoursPerWeek: 10.5 },
  { id: 'ta1', name: 'Asst. Yacine', specializations: ['m1', 'm3'], maxHoursPerWeek: 12 },
];

export const MOCK_LEVELS: Level[] = [
  { id: 'l1', name: 'L1', departmentId: 'd1' },
  { id: 'l2', name: 'L2', departmentId: 'd1' },
];

export const MOCK_GROUPS: Group[] = [
  // ملاحظة: levelId يجب أن يطابق id المستوى تماماً (l1 و l2)
  { id: 'g1-l1', name: 'Group 1', levelId: 'l1', studentCount: 25, section: 'A' },
  { id: 'g2-l1', name: 'Group 2', levelId: 'l1', studentCount: 25, section: 'A' },
  { id: 'g1-l2', name: 'Group 1', levelId: 'l2', studentCount: 30, section: 'A' },
];

// تحديد احتياجات كل مادة من الحصص
export const MODULE_SESSIONS: Record<string, CourseSession[]> = {
  'm1': [
    { moduleId: 'm1', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm1', type: 'TD', duration: 1.5, countPerWeek: 1 },
  ],
  'm2': [
    { moduleId: 'm2', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm2', type: 'TP', duration: 1.5, countPerWeek: 1 },
  ],
  'm3': [
    { moduleId: 'm3', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm3', type: 'TP', duration: 1.5, countPerWeek: 1 },
  ],
  'm4': [
    { moduleId: 'm4', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm4', type: 'TD', duration: 1.5, countPerWeek: 1 },
  ],
};