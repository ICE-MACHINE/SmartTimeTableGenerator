/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Project: Smart Timetable Generator - CodingMaster 26
 */

import {
  Room,
  Teacher,
  Module,
  Group,
  TimeSlot,
  ScheduledSession,
  SessionType,
  CourseSession,
} from "./types";

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

  // 1. تحضير جميع الحصص المطلوب جدولتها
  const sessionsToSchedule: {
    moduleId: string;
    type: SessionType;
    groupIds: string[];
    studentCount: number;
    isFondamental: boolean;
  }[] = [];

  // تجميع المجموعات حسب القسم (Section) للتعامل مع المحاضرات (Lectures)
  const sectionMap = new Map<string, Group[]>();
  groups.forEach((g) => {
    const key = `${g.levelId}-${g.section}`;
    if (!sectionMap.has(key)) sectionMap.set(key, []);
    sectionMap.get(key)!.push(g);
  });

  sectionMap.forEach((sectionGroups) => {
    const sectionTotalStudents = sectionGroups.reduce((sum, g) => sum + g.studentCount, 0);

    modules.forEach((module) => {
      const configs = moduleSessions[module.id] || [];
      configs.forEach((config) => {
        if (config.type === "Lecture") {
          // المحاضرة تحضرها كل المجموعات في القسم معاً
          for (let i = 0; i < config.countPerWeek; i++) {
            sessionsToSchedule.push({
              moduleId: module.id,
              type: "Lecture",
              groupIds: sectionGroups.map((g) => g.id),
              studentCount: sectionTotalStudents,
              isFondamental: module.isFondamental,
            });
          }
        } else {
          // TD/TP لكل مجموعة على حدة
          sectionGroups.forEach((group) => {
            for (let i = 0; i < config.countPerWeek; i++) {
              sessionsToSchedule.push({
                moduleId: module.id,
                type: config.type,
                groupIds: [group.id],
                studentCount: group.studentCount,
                isFondamental: module.isFondamental,
              });
            }
          });
        }
      });
    });
  });

  // 2. ترتيب الحصص حسب الصعوبة (Heuristic: Most Constrained First)
  // المحاضرات أولاً لأنها تتطلب مدرجات، ثم المجموعات الكبيرة
  const typePriority: Record<SessionType, number> = { Lecture: 0, TP: 1, TD: 2 };
  sessionsToSchedule.sort((a, b) => {
    if (typePriority[a.type] !== typePriority[b.type]) {
      return typePriority[a.type] - typePriority[b.type];
    }
    return b.studentCount - a.studentCount;
  });

  // هيكلية تتبع الموارد (State Tracking)
  const teacherBusy = new Set<string>();
  const roomBusy = new Set<string>();
  const groupBusy = new Set<string>();
  const teacherHours = new Map<string, number>();
  const finalSchedule: ScheduledSession[] = [];

  // دالة للتحقق من عدم تدريس الأستاذ لأكثر من 4 حصص متتالية (قيد الحماية)
  const checkConsecutive = (teacherId: string, slot: TimeSlot) => {
    const daySlots = slots.filter((s) => s.day === slot.day).sort((a, b) => a.index - b.index);
    const idx = slot.index;
    let totalConsecutive = 1;
    for (let i = idx - 1; i >= 0; i--) {
      const s = daySlots.find((ds) => ds.index === i);
      if (s && teacherBusy.has(`${teacherId}-${s.id}`)) totalConsecutive++;
      else break;
    }
    for (let i = idx + 1; i < daySlots.length; i++) {
      const s = daySlots.find((ds) => ds.index === i);
      if (s && teacherBusy.has(`${teacherId}-${s.id}`)) totalConsecutive++;
      else break;
    }
    return totalConsecutive <= 4;
  };

  // 3. خوارزمية التراجع المحسنة (Optimized Backtracking)
  let steps = 0;
  const MAX_STEPS = 20000; // حد الأمان لمنع تجميد المتصفح

  function backtrack(sessionIdx: number): boolean {
    steps++;
    if (steps > MAX_STEPS) return false;
    if (sessionIdx === sessionsToSchedule.length) return true;

    const session = sessionsToSchedule[sessionIdx];

    // فلترة الفترات الزمنية المتاحة (الصباح للمواد الأساسية)
    const availableSlots = slots.filter((slot) => {
      if (session.isFondamental && slot.index >= 3) return false;
      return !session.groupIds.some((gid) => groupBusy.has(`${gid}-${slot.id}`));
    });

    for (const slot of availableSlots) {
      // البحث عن الأساتذة المؤهلين وترتيبهم حسب الأقل انشغالاً (Load Balancing)
      const eligibleTeachers = teachers
        .filter((t) =>
          t.specializations.includes(session.moduleId) &&
          (teacherHours.get(t.id) || 0) + 1.5 <= t.maxHoursPerWeek &&
          !teacherBusy.has(`${t.id}-${slot.id}`) &&
          checkConsecutive(t.id, slot)
        )
        .sort((a, b) => (teacherHours.get(a.id) || 0) - (teacherHours.get(b.id) || 0));

      if (eligibleTeachers.length === 0) continue;

      // البحث عن الغرف المناسبة (أصغر غرفة تكفي للحفاظ على الموارد الكبيرة)
      const eligibleRooms = rooms
        .filter((r) => {
          if (roomBusy.has(`${r.id}-${slot.id}`)) return false;
          if (r.capacity < session.studentCount) return false;

          if (session.type === "Lecture") {
            return r.type === "Amphitheatre" || (session.studentCount <= 40 && r.type === "Classroom");
          }
          if (session.type === "TP") return r.type === "CS_Lab" || r.type === "Chemistry_Lab";
          return r.type === "Classroom";
        })
        .sort((a, b) => a.capacity - b.capacity);

      if (eligibleRooms.length === 0) continue;

      // اختيار أفضل الخيارات (التقليم) لتقليل زمن البحث
      const teacher = eligibleTeachers[0];
      const room = eligibleRooms[0];

      // تنفيذ الحجز مؤقتاً
      const currentSessionBatch: string[] = [];
      session.groupIds.forEach((gid) => {
        const id = `sched-${Math.random().toString(36).substr(2, 9)}`;
        currentSessionBatch.push(id);
        finalSchedule.push({
          id,
          moduleId: session.moduleId,
          teacherId: teacher.id,
          roomId: room.id,
          groupId: gid,
          slotId: slot.id,
          type: session.type,
        });
        groupBusy.add(`${gid}-${slot.id}`);
      });

      teacherBusy.add(`${teacher.id}-${slot.id}`);
      roomBusy.add(`${room.id}-${slot.id}`);
      teacherHours.set(teacher.id, (teacherHours.get(teacher.id) || 0) + 1.5);

      // الانتقال للحصة التالية
      if (backtrack(sessionIdx + 1)) return true;

      // التراجع في حال الفشل (Undo)
      teacherHours.set(teacher.id, (teacherHours.get(teacher.id) || 0) - 1.5);
      roomBusy.delete(`${room.id}-${slot.id}`);
      teacherBusy.delete(`${teacher.id}-${slot.id}`);
      session.groupIds.forEach((gid) => {
        groupBusy.delete(`${gid}-${slot.id}`);
        finalSchedule.pop();
      });

      if (steps > MAX_STEPS) break;
    }
    return false;
  }

  const success = backtrack(0);

  if (!success) {
    console.warn("Could not find a perfect solution within step limits. Returning partial schedule.");
  }

  return finalSchedule;
}