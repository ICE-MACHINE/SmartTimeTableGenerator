/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Room, Teacher, Module, Group, TimeSlot, 
  ScheduledSession, SessionType, CourseSession 
} from './types';

interface SolverInput {
  rooms: Room[];
  teachers: Teacher[];
  modules: Module[];
  groups: Group[];
  slots: TimeSlot[];
  moduleSessions: Record<string, CourseSession[]>;
}

export function solveTimetable(input: SolverInput): ScheduledSession[] {
  const { rooms, teachers, modules, groups, slots, moduleSessions } = input;
  
  // 1. Prepare all sessions to be scheduled
  const sessionsToSchedule: { 
    moduleId: string; 
    type: SessionType; 
    groupIds: string[]; 
    studentCount: number;
    isFondamental: boolean;
  }[] = [];

  const sectionMap = new Map<string, Group[]>();
  groups.forEach(g => {
    const key = `${g.levelId}-${g.section}`;
    if (!sectionMap.has(key)) sectionMap.set(key, []);
    sectionMap.get(key)!.push(g);
  });

  sectionMap.forEach((sectionGroups) => {
    const sectionTotalStudents = sectionGroups.reduce((sum, g) => sum + g.studentCount, 0);
    
    modules.forEach(module => {
      const configs = moduleSessions[module.id] || [];
      configs.forEach(config => {
        if (config.type === 'Lecture') {
          for (let i = 0; i < config.countPerWeek; i++) {
            sessionsToSchedule.push({
              moduleId: module.id,
              type: 'Lecture',
              groupIds: sectionGroups.map(g => g.id),
              studentCount: sectionTotalStudents,
              isFondamental: module.isFondamental
            });
          }
        } else {
          sectionGroups.forEach(group => {
            for (let i = 0; i < config.countPerWeek; i++) {
              sessionsToSchedule.push({
                moduleId: module.id,
                type: config.type,
                groupIds: [group.id],
                studentCount: group.studentCount,
                isFondamental: module.isFondamental
              });
            }
          });
        }
      });
    });
  });

  // Sort sessions: Lectures first (hardest to place), then TP, then TD
  const typePriority: Record<SessionType, number> = { 'Lecture': 0, 'TP': 1, 'TD': 2 };
  sessionsToSchedule.sort((a, b) => {
    if (typePriority[a.type] !== typePriority[b.type]) {
      return typePriority[a.type] - typePriority[b.type];
    }
    return b.studentCount - a.studentCount; // Larger sections first
  });

  // Tracking structures for backtracking
  const teacherBusy = new Set<string>(); // "teacherId-slotId"
  const roomBusy = new Set<string>();    // "roomId-slotId"
  const groupBusy = new Set<string>();   // "groupId-slotId"
  const teacherHours = new Map<string, number>(); // "teacherId" -> hours
  const finalSchedule: ScheduledSession[] = [];

  // Helper to check consecutive lessons
  const checkConsecutive = (teacherId: string, slot: TimeSlot) => {
    const daySlots = slots.filter(s => s.day === slot.day).sort((a, b) => a.index - b.index);
    const idx = slot.index;
    
    let totalConsecutive = 1;
    // Look back
    for (let i = idx - 1; i >= 0; i--) {
      const s = daySlots.find(ds => ds.index === i);
      if (s && teacherBusy.has(`${teacherId}-${s.id}`)) totalConsecutive++;
      else break;
    }
    // Look forward
    for (let i = idx + 1; i < daySlots.length; i++) {
      const s = daySlots.find(ds => ds.index === i);
      if (s && teacherBusy.has(`${teacherId}-${s.id}`)) totalConsecutive++;
      else break;
    }
    
    return totalConsecutive < 4;
  };

  // Backtracking function
  function backtrack(sessionIdx: number): boolean {
    if (sessionIdx === sessionsToSchedule.length) return true;

    const session = sessionsToSchedule[sessionIdx];
    
    // Heuristic: Shuffle slots to avoid patterns, but keep morning slots first for fundamental
    const availableSlots = slots.filter(slot => {
      if (session.isFondamental && slot.index >= 3) return false;
      if (session.groupIds.some(gid => groupBusy.has(`${gid}-${slot.id}`))) return false;
      return true;
    }).sort(() => Math.random() - 0.5);

    for (const slot of availableSlots) {
      // Find eligible teachers
      const eligibleTeachers = teachers.filter(t => 
        t.specializations.includes(session.moduleId) &&
        (teacherHours.get(t.id) || 0) + 1.5 <= t.maxHoursPerWeek &&
        !teacherBusy.has(`${t.id}-${slot.id}`) &&
        checkConsecutive(t.id, slot)
      );

      if (eligibleTeachers.length === 0) continue;

      // Find eligible rooms
      const eligibleRooms = rooms.filter(r => {
        if (roomBusy.has(`${r.id}-${slot.id}`)) return false;
        if (r.capacity < session.studentCount) return false;
        
        if (session.type === 'Lecture') {
          return session.studentCount < 90 ? (r.type === 'Amphitheatre' || r.type === 'Classroom') : r.type === 'Amphitheatre';
        }
        if (session.type === 'TP') return r.type === 'CS_Lab' || r.type === 'Chemistry_Lab';
        if (session.type === 'TD') return r.type === 'Classroom';
        return false;
      });

      if (eligibleRooms.length === 0) continue;

      // Try each teacher/room combination (simplified: pick best and backtrack if fails)
      // Sort teachers by current load to balance
      eligibleTeachers.sort((a, b) => (teacherHours.get(a.id) || 0) - (teacherHours.get(b.id) || 0));

      for (const teacher of eligibleTeachers) {
        for (const room of eligibleRooms) {
          // Place
          const sessionIds: string[] = [];
          session.groupIds.forEach(gid => {
            const id = `sched-${Math.random().toString(36).substr(2, 9)}`;
            sessionIds.push(id);
            finalSchedule.push({
              id,
              moduleId: session.moduleId,
              teacherId: teacher.id,
              roomId: room.id,
              groupId: gid,
              slotId: slot.id,
              type: session.type
            });
            groupBusy.add(`${gid}-${slot.id}`);
          });

          teacherBusy.add(`${teacher.id}-${slot.id}`);
          roomBusy.add(`${room.id}-${slot.id}`);
          teacherHours.set(teacher.id, (teacherHours.get(teacher.id) || 0) + 1.5);

          // Recurse
          if (backtrack(sessionIdx + 1)) return true;

          // Backtrack
          teacherHours.set(teacher.id, (teacherHours.get(teacher.id) || 0) - 1.5);
          roomBusy.delete(`${room.id}-${slot.id}`);
          teacherBusy.delete(`${teacher.id}-${slot.id}`);
          session.groupIds.forEach(gid => {
            groupBusy.delete(`${gid}-${slot.id}`);
            finalSchedule.pop();
          });
        }
      }
    }

    return false;
  }

  const success = backtrack(0);
  if (!success) {
    console.error("Failed to find a complete valid schedule.");
  }

  return finalSchedule;
}
