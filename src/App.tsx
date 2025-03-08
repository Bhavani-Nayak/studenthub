
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import StudentData from "./pages/StudentData";
import Attendance from "./pages/Attendance";
import Performance from "./pages/Performance";
import Courses from "./pages/Courses";
import Users from "./pages/Users";
import { PrivateRoute } from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/students" element={<PrivateRoute><StudentData /></PrivateRoute>} />
        <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
        <Route path="/performance" element={<PrivateRoute><Performance /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><Courses /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute roles={['admin']}><Users /></PrivateRoute>} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
