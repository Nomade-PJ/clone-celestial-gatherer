import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Devices from "./pages/Devices";
import Services from "./pages/Services";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CustomerDetail from "./pages/CustomerDetail";
import NewCustomer from "./pages/NewCustomer";
import EditCustomer from "./pages/EditCustomer";
import DeviceDetail from "./pages/DeviceDetail";
import NewDevice from "./pages/NewDevice";
import EditDevice from "./pages/EditDevice";
import ServiceDetail from "./pages/ServiceDetail";
import NewService from "./pages/NewService";
import EditService from "./pages/EditService";
import NotificationDemo from "./pages/NotificationDemo";
import Documents from "./pages/Documents";
import NewDocument from "./pages/NewDocument";
import DocumentDetail from "./pages/DocumentDetail";

// Add framer-motion for animations
import { AnimatePresence } from "framer-motion";
import { useToast } from "./components/ui/use-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

// Create a protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem('pauloCell_user');
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
            
            <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
            <Route path="/customers/new" element={<ProtectedRoute><NewCustomer /></ProtectedRoute>} />
            <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
            <Route path="/customers/edit/:id" element={<ProtectedRoute><EditCustomer /></ProtectedRoute>} />
            
            <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
            <Route path="/devices/new" element={<ProtectedRoute><NewDevice /></ProtectedRoute>} />
            <Route path="/devices/:id" element={<ProtectedRoute><DeviceDetail /></ProtectedRoute>} />
            <Route path="/devices/edit/:id" element={<ProtectedRoute><EditDevice /></ProtectedRoute>} />
            
            <Route path="/services" element={<ProtectedRoute><Services /></ProtectedRoute>} />
            <Route path="/services/new" element={<ProtectedRoute><NewService /></ProtectedRoute>} />
            <Route path="/services/:id" element={<ProtectedRoute><ServiceDetail /></ProtectedRoute>} />
            <Route path="/services/edit/:id" element={<ProtectedRoute><EditService /></ProtectedRoute>} />
            
            <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
            <Route path="/documents/new" element={<ProtectedRoute><NewDocument /></ProtectedRoute>} />
            <Route path="/documents/:id" element={<ProtectedRoute><DocumentDetail /></ProtectedRoute>} />
            
            <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/notification-demo" element={<ProtectedRoute><NotificationDemo /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
