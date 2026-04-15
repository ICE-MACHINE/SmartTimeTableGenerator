/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RoomType = 'Amphitheatre' | 'Classroom' | 'CS_Lab' | 'Chemistry_Lab';

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  capacity: number;
}

export interface Teacher {
  id: string;
  name: string;
  specializations: string[]; // Module IDs
  maxHoursPerWeek: number;
  unavailableSlots?: string[]; // Array of slot IDs
}

export interface Module {
  id: string;
  name: string;
  isFondamental: boolean;
  departmentId: string;
}

export type SessionType = 'Lecture' | 'TD' | 'TP';

export interface CourseSession {
  moduleId: string;
  type: SessionType;
  duration: number; // in hours, e.g., 1.5
  countPerWeek: number;
}

export interface Level {
  id: string;
  name: 'L1' | 'L2' | 'L3' | 'M1' | 'M2';
  departmentId: string;
}

export interface Group {
  id: string;
  name: string;
  levelId: string;
  studentCount: number;
  section: string;
}

export interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  index: number; // 0 to N
}

export interface ScheduledSession {
  id: string;
  moduleId: string;
  teacherId: string;
  roomId: string;
  groupId: string;
  slotId: string;
  type: SessionType;
}

export interface Department {
  id: string;
  name: string;
  headEmail: string;
}
