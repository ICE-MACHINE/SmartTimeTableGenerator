/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSyncExternalStore } from 'react';
import { 
  MOCK_ROOMS, MOCK_TEACHERS, MOCK_MODULES, MOCK_GROUPS, 
  generateTimeSlots, MODULE_SESSIONS 
} from './mockData';
import { Room, Teacher, Module, Group, ScheduledSession, TimeSlot } from './types';

class AppStore {
  rooms: Room[] = MOCK_ROOMS;
  teachers: Teacher[] = MOCK_TEACHERS;
  modules: Module[] = MOCK_MODULES;
  groups: Group[] = MOCK_GROUPS;
  slots: TimeSlot[] = generateTimeSlots();
  schedule: ScheduledSession[] = [];
  moduleSessions = MODULE_SESSIONS;

  private listeners: (() => void)[] = [];

  subscribe = (listener: () => void) => {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getSnapshot = () => {
    return this;
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Schedule
  setSchedule(newSchedule: ScheduledSession[]) {
    this.schedule = newSchedule;
    this.notify();
  }

  // Teachers
  addTeacher(teacher: Teacher) {
    this.teachers = [...this.teachers, teacher];
    this.notify();
  }
  updateTeacher(id: string, updates: Partial<Teacher>) {
    this.teachers = this.teachers.map(t => t.id === id ? { ...t, ...updates } : t);
    this.notify();
  }
  deleteTeacher(id: string) {
    this.teachers = this.teachers.filter(t => t.id !== id);
    this.notify();
  }

  // Modules
  addModule(module: Module) {
    this.modules = [...this.modules, module];
    this.notify();
  }
  updateModule(id: string, updates: Partial<Module>) {
    this.modules = this.modules.map(m => m.id === id ? { ...m, ...updates } : m);
    this.notify();
  }
  deleteModule(id: string) {
    this.modules = this.modules.filter(m => m.id !== id);
    this.notify();
  }

  // Rooms
  addRoom(room: Room) {
    this.rooms = [...this.rooms, room];
    this.notify();
  }
  updateRoom(id: string, updates: Partial<Room>) {
    this.rooms = this.rooms.map(r => r.id === id ? { ...r, ...updates } : r);
    this.notify();
  }
  deleteRoom(id: string) {
    this.rooms = this.rooms.filter(r => r.id !== id);
    this.notify();
  }

  // Groups
  addGroup(group: Group) {
    this.groups = [...this.groups, group];
    this.notify();
  }
  updateGroup(id: string, updates: Partial<Group>) {
    this.groups = this.groups.map(g => g.id === id ? { ...g, ...updates } : g);
    this.notify();
  }
  deleteGroup(id: string) {
    this.groups = this.groups.filter(g => g.id !== id);
    this.notify();
  }
}

export const store = new AppStore();

export function useAppStore() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
