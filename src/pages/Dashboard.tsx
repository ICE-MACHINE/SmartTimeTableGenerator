/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Grid, Paper, Typography, Box, Card, CardContent, 
  Divider, List, ListItem, ListItemText, ListItemIcon 
} from '@mui/material';
import { 
  Users, BookOpen, DoorOpen, Layers, 
  CheckCircle2, AlertCircle, Clock, Zap
} from 'lucide-react';
import { useAppStore } from '../store';

export default function Dashboard() {
  const { rooms, teachers, modules, groups, schedule } = useAppStore();
  const isGenerated = schedule.length > 0;

  const stats = [
    { label: 'Total Rooms', value: rooms.length, icon: <DoorOpen size={20} />, color: '#38BDF8' },
    { label: 'Total Teachers', value: teachers.length, icon: <Users size={20} />, color: '#38BDF8' },
    { label: 'Total Modules', value: modules.length, icon: <BookOpen size={20} />, color: '#38BDF8' },
    { label: 'Total Groups', value: groups.length, icon: <Layers size={20} />, color: '#38BDF8' },
  ];

  return (
    <Box className="animate-fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
          Overview
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>
          Department Analytics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card className="glass" sx={{ 
              height: '100%', 
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                borderColor: 'primary.main',
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 30px -10px rgba(56, 189, 248, 0.2)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {stat.label}
                  </Typography>
                  <Box sx={{ color: 'primary.main', opacity: 0.8 }}>
                    {stat.icon}
                  </Box>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 600, color: 'text.primary', letterSpacing: -1 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper className="glass" sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Zap size={20} className="text-sky-400" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                System Integrity Status
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, opacity: 0.1 }} />
            <List sx={{ mt: 2 }}>
              <ListItem sx={{ px: 0, mb: 2 }}>
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: isGenerated ? 'rgba(76, 175, 80, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                    display: 'grid',
                    placeItems: 'center'
                  }}>
                    {isGenerated ? <CheckCircle2 size={18} color="#4CAF50" /> : <AlertCircle size={18} color="#38BDF8" />}
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>Timetable Generation</Typography>}
                  secondary={<Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{isGenerated ? 'Schedule is generated and active' : 'Schedule not yet generated for this semester'}</Typography>} 
                />
              </ListItem>
              <ListItem sx={{ px: 0, mb: 2 }}>
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(56, 189, 248, 0.1)',
                    display: 'grid',
                    placeItems: 'center'
                  }}>
                    <CheckCircle2 size={18} color="#38BDF8" />
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>Constraint Enforcement</Typography>}
                  secondary={<Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>Fundamental modules restricted to morning slots (before 13:00)</Typography>} 
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 48 }}>
                  <Box sx={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    bgcolor: 'rgba(56, 189, 248, 0.1)',
                    display: 'grid',
                    placeItems: 'center'
                  }}>
                    <Clock size={18} color="#38BDF8" />
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={<Typography sx={{ fontSize: '0.95rem', fontWeight: 600 }}>Last Synchronization</Typography>}
                  secondary={<Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>{new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</Typography>} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="glass" sx={{ 
            p: 4, 
            height: '100%', 
            bgcolor: 'rgba(56, 189, 248, 0.02)', 
            borderColor: 'rgba(56, 189, 248, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ 
                width: 10, 
                height: 10, 
                borderRadius: '50%', 
                bgcolor: '#4CAF50', 
                boxShadow: '0 0 15px #4CAF50',
                animation: 'pulse 2s infinite'
              }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', fontSize: '1.1rem' }}>
                Solver Engine Active
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
              The recursive backtracking engine is monitoring all data entries for potential conflicts in real-time.
            </Typography>
            <Divider sx={{ my: 2, opacity: 0.1 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Algorithm</Typography>
                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700 }}>Backtracking CSP</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Optimization</Typography>
                <Typography variant="caption" sx={{ color: 'text.primary', fontWeight: 700 }}>MRV Heuristic</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
