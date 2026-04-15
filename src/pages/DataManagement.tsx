/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Tabs, Tab, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, IconButton,
  Button, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Chip, FormControl, InputLabel, Select, MenuItem,
  Checkbox, ListItemText, OutlinedInput, Grid
} from '@mui/material';
import { Edit, Trash2, Plus, X } from 'lucide-react';
import { useAppStore, store } from '../store';
import { Teacher, Module, Room, Group, RoomType } from '../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function DataManagement() {
  const [tabValue, setTabValue] = useState(0);
  const { teachers, modules, rooms, groups } = useAppStore();
  
  // Dialog State
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = (type: string, item?: any) => {
    setEditId(item?.id || null);
    if (item) {
      setFormData(item);
    } else {
      // Default values for new items
      if (tabValue === 0) setFormData({ name: '', specializations: [], maxHoursPerWeek: 12 });
      if (tabValue === 1) setFormData({ name: '', isFondamental: false, departmentId: 'd1' });
      if (tabValue === 2) setFormData({ name: '', type: 'Classroom', capacity: 30 });
      if (tabValue === 3) setFormData({ name: '', levelId: 'L1', section: 'A', studentCount: 30 });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({});
    setEditId(null);
  };

  const handleSave = () => {
    if (tabValue === 0) {
      const teacher = { ...formData, id: editId || `t-${Date.now()}` } as Teacher;
      editId ? store.updateTeacher(editId, teacher) : store.addTeacher(teacher);
    } else if (tabValue === 1) {
      const module = { ...formData, id: editId || `m-${Date.now()}` } as Module;
      editId ? store.updateModule(editId, module) : store.addModule(module);
    } else if (tabValue === 2) {
      const room = { ...formData, id: editId || `r-${Date.now()}` } as Room;
      editId ? store.updateRoom(editId, room) : store.addRoom(room);
    } else if (tabValue === 3) {
      const group = { ...formData, id: editId || `g-${Date.now()}` } as Group;
      editId ? store.updateGroup(editId, group) : store.addGroup(group);
    }
    handleClose();
  };

  const handleDelete = (type: string, id: string) => {
    if (type === 'teacher') store.deleteTeacher(id);
    if (type === 'module') store.deleteModule(id);
    if (type === 'room') store.deleteRoom(id);
    if (type === 'group') store.deleteGroup(id);
  };

  return (
    <Box className="animate-fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            Infrastructure
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>Data Management</Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<Plus size={18} />}
          onClick={() => handleOpen(['teacher', 'module', 'room', 'group'][tabValue])}
        >
          Add {['Teacher', 'Module', 'Room', 'Group'][tabValue]}
        </Button>
      </Box>

      <Paper className="glass" sx={{ width: '100%', mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '1px',
              fontWeight: 700,
              minHeight: 64,
            }
          }}
        >
          <Tab label="Teachers" />
          <Tab label="Modules" />
          <Tab label="Rooms" />
          <Tab label="Groups" />
        </Tabs>

        {/* Teachers Panel */}
        <CustomTabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Specializations</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Max Hours</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{teacher.name}</TableCell>
                    <TableCell>
                      {teacher.specializations.map(specId => (
                        <Chip 
                          key={specId} 
                          label={modules.find(m => m.id === specId)?.name || specId} 
                          size="small" 
                          sx={{ mr: 0.5, bgcolor: 'rgba(56, 189, 248, 0.1)', color: 'primary.main', border: '1px solid rgba(56, 189, 248, 0.2)' }} 
                        />
                      ))}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{teacher.maxHoursPerWeek}h</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen('teacher', teacher)}><Edit size={16} /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete('teacher', teacher.id)}><Trash2 size={16} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>

        {/* Modules Panel */}
        <CustomTabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Department</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Type</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{module.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{module.departmentId === 'd1' ? 'Computer Science' : 'Mathematics'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={module.isFondamental ? 'Fondamental' : 'Discovery'} 
                        variant="outlined"
                        size="small"
                        color={module.isFondamental ? 'primary' : 'default'}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen('module', module)}><Edit size={16} /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete('module', module.id)}><Trash2 size={16} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>

        {/* Rooms Panel */}
        <CustomTabPanel value={tabValue} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Room Name</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Type</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Capacity</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{room.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{room.type.replace('_', ' ')}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{room.capacity} students</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen('room', room)}><Edit size={16} /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete('room', room.id)}><Trash2 size={16} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>

        {/* Groups Panel */}
        <CustomTabPanel value={tabValue} index={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Group Name</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Level</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Section</TableCell>
                  <TableCell sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Students</TableCell>
                  <TableCell align="right" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{group.name}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{group.levelId}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{group.section}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{group.studentCount}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpen('group', group)}><Edit size={16} /></IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete('group', group.id)}><Trash2 size={16} /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CustomTabPanel>
      </Paper>

      {/* Unified Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth slotProps={{ paper: { className: 'glass' } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{editId ? 'Edit' : 'Add'} {['Teacher', 'Module', 'Room', 'Group'][tabValue]}</Typography>
          <IconButton onClick={handleClose} size="small"><X size={20} /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: 'divider' }}>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            {/* Common Name Field */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>

            {/* Teacher Specific */}
            {tabValue === 0 && (
              <>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Specializations</InputLabel>
                    <Select
                      multiple
                      value={formData.specializations || []}
                      onChange={(e) => setFormData({ ...formData, specializations: e.target.value })}
                      input={<OutlinedInput label="Specializations" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={modules.find(m => m.id === value)?.name || value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {modules.map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          <Checkbox checked={(formData.specializations || []).indexOf(m.id) > -1} />
                          <ListItemText primary={m.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Hours Per Week"
                    value={formData.maxHoursPerWeek || 12}
                    onChange={(e) => setFormData({ ...formData, maxHoursPerWeek: Number(e.target.value) })}
                  />
                </Grid>
              </>
            )}

            {/* Module Specific */}
            {tabValue === 1 && (
              <>
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={formData.departmentId || 'd1'}
                      label="Department"
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    >
                      <MenuItem value="d1">Computer Science</MenuItem>
                      <MenuItem value="d2">Mathematics</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox 
                    checked={formData.isFondamental || false} 
                    onChange={(e) => setFormData({ ...formData, isFondamental: e.target.checked })}
                  />
                  <Typography>Fundamental Module</Typography>
                </Grid>
              </>
            )}

            {/* Room Specific */}
            {tabValue === 2 && (
              <>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      value={formData.type || 'Classroom'}
                      label="Room Type"
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <MenuItem value="Classroom">Classroom</MenuItem>
                      <MenuItem value="Amphitheatre">Amphitheatre</MenuItem>
                      <MenuItem value="CS_Lab">CS Lab</MenuItem>
                      <MenuItem value="Chemistry_Lab">Chemistry Lab</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Capacity"
                    value={formData.capacity || 30}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                  />
                </Grid>
              </>
            )}

            {/* Group Specific */}
            {tabValue === 3 && (
              <>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    label="Level"
                    value={formData.levelId || 'L1'}
                    onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    label="Section"
                    value={formData.section || 'A'}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Students"
                    value={formData.studentCount || 30}
                    onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
