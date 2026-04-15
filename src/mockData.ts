/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Room, Teacher, Module, Level, Group, TimeSlot, 
  ScheduledSession, SessionType, CourseSession, Department
} from './types';

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'] as const;

export const TIME_SLOTS: TimeSlot[] = [
  { id: 's1', day: 'Monday', startTime: '08:00', endTime: '09:30', index: 0 },
  { id: 's2', day: 'Monday', startTime: '09:45', endTime: '11:15', index: 1 },
  { id: 's3', day: 'Monday', startTime: '11:30', endTime: '13:00', index: 2 },
  { id: 's4', day: 'Monday', startTime: '14:00', endTime: '15:30', index: 3 },
];

// Helper to generate a full week of slots
export function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const times = [
    { start: '08:00', end: '09:30' },
    { start: '09:45', end: '11:15' },
    { start: '11:30', end: '13:00' },
    { start: '14:00', end: '15:30' },
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
  { id: 'd1', name: 'Computer Science', headEmail: 'mustaphapop567@gmail.com' },
  { id: 'd2', name: 'Mathematics', headEmail: 'math_head@faculty.edu' },
];

export const MOCK_ROOMS: Room[] = [
  { id: 'r1', name: 'Amph-A1', type: 'Amphitheatre', capacity: 200 },
  { id: 'r2', name: 'Amph-A2', type: 'Amphitheatre', capacity: 150 },
  { id: 'r3', name: 'B101', type: 'Classroom', capacity: 40 },
  { id: 'r4', name: 'B102', type: 'Classroom', capacity: 35 },
  { id: 'r5', name: 'B103', type: 'Classroom', capacity: 45 },
  { id: 'r6', name: 'B104', type: 'Classroom', capacity: 50 },
  { id: 'r7', name: 'CS-Lab1', type: 'CS_Lab', capacity: 30 },
  { id: 'r8', name: 'CS-Lab2', type: 'CS_Lab', capacity: 30 },
  { id: 'r9', name: 'Chem-Lab1', type: 'Chemistry_Lab', capacity: 25 },
];

export const MOCK_MODULES: Module[] = [
  { id: 'm1', name: 'Algorithms', isFondamental: true, departmentId: 'd1' },
  { id: 'm2', name: 'Databases', isFondamental: true, departmentId: 'd1' },
  { id: 'm3', name: 'Networks', isFondamental: false, departmentId: 'd1' },
  { id: 'm4', name: 'Mathematics I', isFondamental: true, departmentId: 'd2' },
  { id: 'm5', name: 'Statistics', isFondamental: true, departmentId: 'd2' },
  { id: 'm6', name: 'Software Engineering', isFondamental: false, departmentId: 'd1' },
  { id: 'm7', name: 'AI Basics', isFondamental: true, departmentId: 'd1' },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 't1', name: 'Dr. Ahmed Benaissa', specializations: ['m1', 'm2', 'm6'], maxHoursPerWeek: 12 },
  { id: 't2', name: 'Dr. Sara Meziane', specializations: ['m2', 'm3', 'm7'], maxHoursPerWeek: 12 },
  { id: 't3', name: 'Prof. Karim Hadj', specializations: ['m3', 'm4', 'm5'], maxHoursPerWeek: 12 },
  { id: 't4', name: 'Dr. Lila Cherif', specializations: ['m4', 'm1', 'm7'], maxHoursPerWeek: 12 },
  { id: 't5', name: 'Dr. Omar Fathi', specializations: ['m5', 'm4'], maxHoursPerWeek: 12 },
  { id: 't6', name: 'Dr. Nadia Salem', specializations: ['m6', 'm7', 'm1'], maxHoursPerWeek: 12 },
  // Assistant Teachers (Students) for TD/TP
  { id: 'ta1', name: 'Asst. Yacine K.', specializations: ['m1', 'm2'], maxHoursPerWeek: 12 },
  { id: 'ta2', name: 'Asst. Meriem L.', specializations: ['m3', 'm6'], maxHoursPerWeek: 12 },
  { id: 'ta3', name: 'Asst. Sami R.', specializations: ['m4', 'm5'], maxHoursPerWeek: 12 },
  { id: 'ta4', name: 'Asst. Hana B.', specializations: ['m7', 'm2'], maxHoursPerWeek: 12 },
];

export const MOCK_LEVELS: Level[] = [
  { id: 'l1', name: 'L1', departmentId: 'd1' },
  { id: 'l2', name: 'L2', departmentId: 'd1' },
  { id: 'l3', name: 'L3', departmentId: 'd1' },
  { id: 'l4', name: 'M1', departmentId: 'd1' },
  { id: 'l5', name: 'M2', departmentId: 'd1' },
];

export const MOCK_GROUPS: Group[] = [
  { id: 'g1', name: 'G1', levelId: 'l1', studentCount: 25, section: 'A' },
  { id: 'g2', name: 'G2', levelId: 'l1', studentCount: 25, section: 'A' },
  { id: 'g3', name: 'G1', levelId: 'l2', studentCount: 30, section: 'A' },
  { id: 'g4', name: 'G2', levelId: 'l2', studentCount: 30, section: 'A' },
  { id: 'g5', name: 'G1', levelId: 'l3', studentCount: 40, section: 'A' },
  { id: 'g6', name: 'G1', levelId: 'l4', studentCount: 20, section: 'A' },
];

// Define what sessions each module needs
export const MODULE_SESSIONS: Record<string, CourseSession[]> = {
  'm1': [
    { moduleId: 'm1', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm1', type: 'TD', duration: 1.5, countPerWeek: 2 },
  ],
  'm2': [
    { moduleId: 'm2', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm2', type: 'TD', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm2', type: 'TP', duration: 1.5, countPerWeek: 1 },
  ],
  'm3': [
    { moduleId: 'm3', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm3', type: 'TD', duration: 1.5, countPerWeek: 2 },
  ],
  'm4': [
    { moduleId: 'm4', type: 'Lecture', duration: 1.5, countPerWeek: 2 },
    { moduleId: 'm4', type: 'TD', duration: 1.5, countPerWeek: 2 },
  ],
  'm5': [
    { moduleId: 'm5', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm5', type: 'TD', duration: 1.5, countPerWeek: 1 },
  ],
  'm6': [
    { moduleId: 'm6', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm6', type: 'TD', duration: 1.5, countPerWeek: 1 },
  ],
  'm7': [
    { moduleId: 'm7', type: 'Lecture', duration: 1.5, countPerWeek: 1 },
    { moduleId: 'm7', type: 'TP', duration: 1.5, countPerWeek: 1 },
  ],
};
