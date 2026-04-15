/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import {
  Printer,
  Filter,
  Calendar as CalendarIcon,
  Download,
} from "lucide-react";
import { useAppStore, store } from "../store";
import { DAYS } from "../mockData";
import { ScheduledSession, TimeSlot } from "../types";

export default function TimetableView() {
  const { teachers, modules, rooms, groups, schedule, slots } = useAppStore();
  const [filterType, setFilterType] = useState<"group" | "teacher" | "room">(
    "group",
  );
  const [filterId, setFilterId] = useState<string>(groups[0]?.id || "");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const filteredSchedule = useMemo(() => {
    if (filterType === "group")
      return schedule.filter((s) => s.groupId === filterId);
    if (filterType === "teacher")
      return schedule.filter((s) => s.teacherId === filterId);
    if (filterType === "room")
      return schedule.filter((s) => s.roomId === filterId);
    return [];
  }, [filterType, filterId, schedule]);

  const getSessionAt = (day: string, slotIndex: number) => {
    const slot = slots.find((s) => s.day === day && s.index === slotIndex);
    if (!slot) return null;
    return filteredSchedule.find((s) => s.slotId === slot.id);
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "Lecture":
        return {
          bg: "rgba(56, 189, 248, 0.1)",
          border: "#38BDF8",
          text: "#38BDF8",
        };
      case "TD":
        return {
          bg: "rgba(129, 140, 248, 0.1)",
          border: "#818CF8",
          text: "#818CF8",
        };
      case "TP":
        return {
          bg: "rgba(168, 85, 247, 0.1)",
          border: "#A855F7",
          text: "#A855F7",
        };
      default:
        return {
          bg: "rgba(255, 255, 255, 0.05)",
          border: "#2A2A2A",
          text: "#8E8E8E",
        };
    }
  };

  const handleDrop = (e: React.DragEvent, day: string, slotIndex: number) => {
    e.preventDefault();
    if (!draggedId) return;

    const currentDraggedId = draggedId;
    setDraggedId(null); // Reset after action

    const targetSlot = slots.find((s) => s.day === day && s.index === slotIndex);
    if (!targetSlot) return;

    const newSchedule = [...schedule];
    const draggedIndex = newSchedule.findIndex((s) => s.id === currentDraggedId);
    if (draggedIndex === -1) return;

    const existingSession = getSessionAt(day, slotIndex);

    if (existingSession) {
      if (existingSession.id === currentDraggedId) return;
      const existingIndex = newSchedule.findIndex(
        (s) => s.id === existingSession.id,
      );
      if (existingIndex !== -1) {
        const tempSlotId = newSchedule[draggedIndex].slotId;
        newSchedule[draggedIndex] = {
          ...newSchedule[draggedIndex],
          slotId: existingSession.slotId,
        };
        newSchedule[existingIndex] = {
          ...newSchedule[existingIndex],
          slotId: tempSlotId,
        };
      }
    } else {
      newSchedule[draggedIndex] = {
        ...newSchedule[draggedIndex],
        slotId: targetSlot.id,
      };
    }

    store.setSchedule(newSchedule);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const exportToCSV = () => {
    const rows = [["Time", ...DAYS]];

    [0, 1, 2, 3].forEach((slotIndex) => {
      const time = slots[slotIndex]?.startTime || "";
      const row = [time];
      DAYS.forEach((day) => {
        const session = getSessionAt(day, slotIndex);
        if (session) {
          const moduleName =
            modules.find((m) => m.id === session.moduleId)?.name || "";
          const teacherName =
            teachers.find((t) => t.id === session.teacherId)?.name || "";
          const roomName =
            rooms.find((r) => r.id === session.roomId)?.name || "";
          const groupName =
            groups.find((g) => g.id === session.groupId)?.name || "";
          row.push(
            `"${moduleName} (${session.type}) - ${teacherName} - ${roomName} - ${groupName}"`,
          );
        } else {
          row.push("");
        }
      });
      rows.push(row);
    });

    const csvContent = rows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `timetable_${filterType}_${filterId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // تغيير عنوان الصفحة مؤقتاً ليظهر كاسم للملف عند الحفظ
    const originalTitle = document.title;
    document.title = `Timetable_${filterType}_${filterId}`;

    window.print();

    // إعادة العنوان الأصلي
    document.title = originalTitle;
  };

  return (
    <Box className="animate-fade-in">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Schedule
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            Timetable Viewer
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              bgcolor: "rgba(255,255,255,0.03)",
              p: 0.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Button
              size="small"
              variant={filterType === "group" ? "contained" : "text"}
              onClick={() => {
                setFilterType("group");
                setFilterId(groups[0]?.id || "");
              }}
              sx={{ minWidth: 80, fontSize: "0.7rem" }}
            >
              Group
            </Button>
            <Button
              size="small"
              variant={filterType === "teacher" ? "contained" : "text"}
              onClick={() => {
                setFilterType("teacher");
                setFilterId(teachers[0]?.id || "");
              }}
              sx={{ minWidth: 80, fontSize: "0.7rem" }}
            >
              Teacher
            </Button>
            <Button
              size="small"
              variant={filterType === "room" ? "contained" : "text"}
              onClick={() => {
                setFilterType("room");
                setFilterId(rooms[0]?.id || "");
              }}
              sx={{ minWidth: 80, fontSize: "0.7rem" }}
            >
              Room
            </Button>
          </Box>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
              sx={{ fontSize: "0.85rem", fontWeight: 600 }}
              className="glass"
            >
              {filterType === "group" &&
                groups.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.name} ({g.section})
                  </MenuItem>
                ))}
              {filterType === "teacher" &&
                teachers.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              {filterType === "room" &&
                rooms.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Printer size={16} />}
              onClick={exportToPDF}
              sx={{ height: 40 }}
            >
              PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download size={16} />}
              onClick={exportToCSV}
              sx={{ height: 40 }}
            >
              CSV
            </Button>
          </Box>
        </Box>
      </Box>

      {schedule.length === 0 ? (
        <Paper
          className="glass"
          sx={{
            p: 10,
            textAlign: "center",
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <CalendarIcon size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            No schedule generated yet. Use the engine to synthesize a timetable.
          </Typography>
        </Paper>
      ) : (
        <TableContainer
          id="printable-table"
          component={Paper}
          className="glass"
          sx={{ overflow: "hidden" }}
        >
          <Table
            sx={{ minWidth: 800, borderCollapse: "separate", borderSpacing: 0 }}
          >
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    width: 100,
                    fontWeight: 700,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    fontSize: "0.65rem",
                    letterSpacing: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    textAlign: "center",
                    bgcolor: "rgba(255,255,255,0.02)",
                  }}
                >
                  Time
                </TableCell>
                {DAYS.map((day) => (
                  <TableCell
                    key={day}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      textTransform: "uppercase",
                      fontSize: "0.65rem",
                      letterSpacing: 1,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      bgcolor: "rgba(255,255,255,0.02)",
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[0, 1, 2, 3].map((slotIndex) => (
                <TableRow key={slotIndex}>
                  <TableCell
                    sx={{
                      fontWeight: 700,
                      color: "text.secondary",
                      width: 100,
                      fontSize: "0.75rem",
                      borderRight: "1px solid",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      textAlign: "center",
                      bgcolor: "rgba(255,255,255,0.01)",
                    }}
                  >
                    {slots[slotIndex]?.startTime}
                  </TableCell>
                  {DAYS.map((day) => {
                    const session = getSessionAt(day, slotIndex);
                    if (!session)
                      return (
                        <TableCell
                          key={day}
                          onDragOver={handleDragOver}
                          onDragEnter={handleDragEnter}
                          onDrop={(e) => handleDrop(e, day, slotIndex)}
                          sx={{
                            borderRight: "1px solid",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                          }}
                        />
                      );

                    const module = modules.find(
                      (m) => m.id === session.moduleId,
                    );
                    const teacher = teachers.find(
                      (t) => t.id === session.teacherId,
                    );
                    const room = rooms.find((r) => r.id === session.roomId);
                    const group = groups.find((g) => g.id === session.groupId);
                    const styles = getTypeStyles(session.type);

                    return (
                      <TableCell
                        key={day}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDrop={(e) => handleDrop(e, day, slotIndex)}
                        sx={{
                          p: 1,
                          borderRight: "1px solid",
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          height: 100,
                        }}
                      >
                        <Tooltip title={`${session.type} - ${module?.name}`}>
                          <Box
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = "move";
                              setDraggedId(session.id);
                            }}
                            onDragEnd={() => setDraggedId(null)}
                            onDragOver={(e) => e.stopPropagation()}
                            sx={{
                              p: 1.5,
                              height: "100%",
                              bgcolor: styles.bg,
                              borderLeft: `4px solid ${styles.border}`,
                              borderRadius: 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              transition:
                                "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              cursor: "pointer",
                              "&:hover": {
                                bgcolor: "rgba(255,255,255,0.08)",
                                transform: "translateY(-2px)",
                                boxShadow: `0 4px 20px -5px ${styles.border}40`,
                                zIndex: 1,
                              },
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.8rem",
                                color: "text.primary",
                                mb: 0.5,
                                lineHeight: 1.2,
                              }}
                            >
                              {module?.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.2,
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                }}
                              >
                                {teacher?.name.split(" ").pop()} • {room?.name}
                              </Typography>
                              {filterType !== "group" && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: styles.text,
                                    fontSize: "0.65rem",
                                    fontWeight: 700,
                                  }}
                                >
                                  {group?.name}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Tooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 4, display: "flex", gap: 4, justifyContent: "center" }}>
        {["Lecture", "TD", "TP"].map((type) => {
          const styles = getTypeStyles(type);
          return (
            <Box
              key={type}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: styles.bg,
                  borderLeft: `3px solid ${styles.border}`,
                  borderRadius: "2px",
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  fontSize: "0.65rem",
                }}
              >
                {type}{" "}
                {type === "TP"
                  ? "(Practical)"
                  : type === "TD"
                    ? "(Tutorial)"
                    : ""}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
