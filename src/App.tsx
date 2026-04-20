/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  DoorOpen,
  Layers,
  CalendarRange,
  Settings,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";

import {
  MOCK_ROOMS,
  MOCK_TEACHERS,
  MOCK_MODULES,
  MOCK_GROUPS,
  generateTimeSlots,
  MODULE_SESSIONS,
} from "./mockData";
import { solveTimetable } from "./solver";
import { ScheduledSession } from "./types";

// Pages (will define them below or in separate files)
import Dashboard from "./pages/Dashboard";
import DataManagement from "./pages/DataManagement";
import ScheduleGenerator from "./pages/ScheduleGenerator";
import TimetableView from "./pages/TimetableView";
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

const drawerWidth = 260;

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const getDesignTokens = (mode: "light" | "dark") => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          primary: { main: "#0284c7", contrastText: "#ffffff" },
          secondary: { main: "#64748b" },
          background: { default: "#f8fafc", paper: "#ffffff" },
          text: { primary: "#0f172a", secondary: "#475569" },
          divider: "rgba(0, 0, 0, 0.08)",
        }
      : {
          primary: { main: "#38BDF8", contrastText: "#05070A" },
          secondary: { main: "#8B949E" },
          background: { default: "#05070A", paper: "#0D1117" },
          text: { primary: "#F0F6FC", secondary: "#8B949E" },
          divider: "rgba(255, 255, 255, 0.08)",
        }),
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    h6: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
    button: {
      textTransform: "none" as const,
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor:
            mode === "light"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(13, 17, 23, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom:
            mode === "light"
              ? "1px solid rgba(0, 0, 0, 0.08)"
              : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "none",
          color: mode === "light" ? "#0f172a" : "#fff",
          height: 72,
          justifyContent: "center",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === "light" ? "#ffffff" : "#0D1117",
          borderRight:
            mode === "light"
              ? "1px solid rgba(0,0,0,0.08)"
              : "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "8px 16px",
          transition: "all 0.2s ease",
        },
        contained: {
          boxShadow:
            mode === "light"
              ? "0 4px 12px rgba(2, 132, 199, 0.2)"
              : "0 4px 12px rgba(56, 189, 248, 0.2)",
          "&:hover": {
            boxShadow:
              mode === "light"
                ? "0 6px 16px rgba(2, 132, 199, 0.3)"
                : "0 6px 16px rgba(56, 189, 248, 0.3)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderColor:
            mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255, 255, 255, 0.1)",
          "&:hover": {
            backgroundColor:
              mode === "light"
                ? "rgba(0,0,0,0.03)"
                : "rgba(255, 255, 255, 0.03)",
            borderColor:
              mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(255, 255, 255, 0.2)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: mode === "light" ? "#ffffff" : "#0D1117",
          border:
            mode === "light"
              ? "1px solid rgba(0,0,0,0.08)"
              : "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow:
            mode === "light"
              ? "0 4px 20px rgba(0,0,0,0.05)"
              : "0 4px 20px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: "4px 12px",
          "&.Mui-selected": {
            backgroundColor:
              mode === "light"
                ? "rgba(2, 132, 199, 0.1)"
                : "rgba(56, 189, 248, 0.1)",
            color: mode === "light" ? "#0284c7" : "#38BDF8",
            "& .MuiListItemIcon-root": {
              color: mode === "light" ? "#0284c7" : "#38BDF8",
            },
            "&:hover": {
              backgroundColor:
                mode === "light"
                  ? "rgba(2, 132, 199, 0.15)"
                  : "rgba(56, 189, 248, 0.15)",
            },
          },
        },
      },
    },
  },
});

function AppContent({ mode }: { mode: "light" | "dark" }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const { toggleColorMode } = React.useContext(ColorModeContext);
  const theme = useTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/" },
    { text: "Data Management", icon: <Settings size={20} />, path: "/data" },
    {
      text: "Generate Schedule",
      icon: <CalendarRange size={20} />,
      path: "/generate",
    },
    {
      text: "View Timetable",
      icon: <CalendarRange size={20} />,
      path: "/timetable",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      {/* Background Grid Effect */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.4,
          pointerEvents: "none",
        }}
        className="bg-grid"
      />

      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ px: "24px !important" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2, color: "text.secondary" }}
          >
            <MenuIcon size={20} />
          </IconButton>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: "primary.main",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)",
              }}
            >
              <CalendarRange size={20} color="#05070A" />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 1.5,
                  display: "block",
                  lineHeight: 1,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                }}
              >
                Faculty of Engineering
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  letterSpacing: -0.5,
                  fontSize: "1.1rem",
                }}
              >
                Smart Timetable{" "}
                <span style={{ color: "#38BDF8", opacity: 0.8 }}>
                  Generator
                </span>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <IconButton
              onClick={toggleColorMode}
              color="inherit"
              sx={{ mr: 1 }}
            >
              {mode === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
            <IconButton
              color="inherit"
              sx={{ mr: 1 }}
            >
              <LogOut color="red" size={20} />
            </IconButton>
            <Button variant="outlined" component={Link} to="/data" size="small">
              Manage Data
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to="/generate"
              size="small"
            >
              Synthesize
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 80,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: open ? drawerWidth : 80,
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
            pt: "72px",
          },
        }}
      >
        <Box sx={{ overflow: "auto", py: 3 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{ display: "block", mb: 0.5 }}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      justifyContent: "center",
                      color:
                        location.pathname === item.path
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      "& .MuiTypography-root": {
                        fontSize: "0.85rem",
                        fontWeight: location.pathname === item.path ? 600 : 500,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 4, position: "relative", zIndex: 1 }}
      >
        <Toolbar sx={{ height: 72 }} />
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/data"
              element={
                <ProtectedRoute>
                  <DataManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/generate"
              element={
                <ProtectedRoute>
                  <ScheduleGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timetable"
              element={
                <ProtectedRoute>
                  <TimetableView />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

export default function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === "light" ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", nextMode);
          return nextMode;
        });
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppContent mode={mode} />
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
