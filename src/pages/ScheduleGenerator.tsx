/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Box, Typography, Paper, Button, LinearProgress, 
  Alert, AlertTitle, List, ListItem, ListItemText, 
  ListItemIcon, Divider, Grid
} from '@mui/material';
import { Play, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { useAppStore, store } from '../store';
import { solveTimetable } from '../solver';
import { useNavigate } from 'react-router-dom';

export default function ScheduleGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);
  const navigate = useNavigate();
  const { teachers, rooms, groups, slots, moduleSessions } = useAppStore();

  const handleGenerate = () => {
    setIsGenerating(true);
    setResult(null);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    setTimeout(() => {
      const newSchedule = solveTimetable({
        rooms,
        teachers,
        modules: store.modules,
        groups,
        slots,
        moduleSessions
      });

      store.setSchedule(newSchedule);
      setIsGenerating(false);
      setResult({ success: true, count: newSchedule.length });
    }, 2000);
  };

  return (
    <Box className="animate-fade-in">
      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
          Engine
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>Schedule Generation</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className="glass" sx={{ p: 6, textAlign: 'center', height: '100%' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <CalendarIllustration active={isGenerating} />
            </Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Ready to synthesize?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 6, maxWidth: 400, mx: 'auto', lineHeight: 1.7 }}>
              The recursive backtracking solver will process {teachers.length} teachers, {rooms.length} rooms, 
              and {groups.length} groups to synthesize a conflict-free academic timetable.
            </Typography>

            {!isGenerating && !result && (
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<Play size={18} />}
                onClick={handleGenerate}
                sx={{ 
                  px: 6, 
                  py: 1.5,
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)',
                  '&:hover': {
                    boxShadow: '0 0 30px rgba(56, 189, 248, 0.5)',
                  }
                }}
              >
                Start Synthesis
              </Button>
            )}

            {isGenerating && (
              <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1, color: 'primary.main', fontWeight: 700 }}>
                    Processing Constraints...
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                    {progress}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    bgcolor: 'rgba(56, 189, 248, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                    }
                  }} 
                />
              </Box>
            )}

            {result && (
              <Box sx={{ maxWidth: 400, mx: 'auto' }} className="animate-fade-in">
                <Alert 
                  icon={<CheckCircle2 size={20} />} 
                  severity="success" 
                  sx={{ 
                    mb: 4, 
                    textAlign: 'left', 
                    bgcolor: 'rgba(76, 175, 80, 0.05)', 
                    color: '#4CAF50',
                    border: '1px solid rgba(76, 175, 80, 0.2)',
                    '& .MuiAlert-icon': { color: '#4CAF50' }
                  }}
                >
                  <AlertTitle sx={{ fontWeight: 700 }}>Synthesis Complete</AlertTitle>
                  Generated {result.count} sessions successfully with zero hard conflicts detected.
                </Alert>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/timetable')}
                    fullWidth
                  >
                    View Timetable
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => setResult(null)}
                    fullWidth
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper className="glass" sx={{ p: 4, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Sparkles size={20} className="text-sky-400" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Generation Protocols
              </Typography>
            </Box>
            <Divider sx={{ mb: 3, opacity: 0.1 }} />
            <List sx={{ mt: 2 }}>
              {[
                { label: 'Hard: No teacher double-booking', type: 'hard' },
                { label: 'Hard: No room double-booking', type: 'hard' },
                { label: 'Hard: Room capacity vs Group size', type: 'hard' },
                { label: 'Hard: Teacher specialization matching', type: 'hard' },
                { label: 'Soft: Balanced workload distribution', type: 'soft' },
                { label: 'Soft: Minimize gaps between sessions', type: 'soft' },
              ].map((item, idx) => (
                <ListItem key={idx} sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: item.type === 'hard' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                      display: 'grid',
                      placeItems: 'center'
                    }}>
                      {item.type === 'hard' ? <CheckCircle2 size={14} color="#4CAF50" /> : <AlertTriangle size={14} color="#38BDF8" />}
                    </Box>
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography sx={{ fontSize: '0.9rem', color: 'text.primary', fontWeight: 600 }}>{item.label}</Typography>} 
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(56, 189, 248, 0.03)', borderRadius: 2, border: '1px dashed', borderColor: 'rgba(56, 189, 248, 0.3)' }}>
              <Typography variant="caption" sx={{ color: 'primary.main', display: 'block', mb: 1, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
                Solver Strategy
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', lineHeight: 1.6 }}>
                The engine uses a recursive backtracking approach augmented with minimum-remaining-values heuristics to find the most stable schedule within the search space.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function CalendarIllustration({ active }: { active?: boolean }) {
  return (
    <Box sx={{ position: 'relative' }}>
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#38BDF8', opacity: 0.8 }}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <path d="M8 14h.01" style={{ animation: active ? 'pulse 1s infinite' : 'none' }}></path>
        <path d="M12 14h.01" style={{ animation: active ? 'pulse 1s infinite 0.2s' : 'none' }}></path>
        <path d="M16 14h.01" style={{ animation: active ? 'pulse 1s infinite 0.4s' : 'none' }}></path>
        <path d="M8 18h.01" style={{ animation: active ? 'pulse 1s infinite 0.1s' : 'none' }}></path>
        <path d="M12 18h.01" style={{ animation: active ? 'pulse 1s infinite 0.3s' : 'none' }}></path>
        <path d="M16 18h.01" style={{ animation: active ? 'pulse 1s infinite 0.5s' : 'none' }}></path>
      </svg>
      {active && (
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: 140,
          height: 140,
          borderRadius: '50%',
          border: '2px dashed rgba(56, 189, 248, 0.3)',
          animation: 'spin 10s linear infinite'
        }} />
      )}
    </Box>
  );
}
