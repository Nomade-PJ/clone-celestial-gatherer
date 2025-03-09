
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { NotificationProvider } from "@/contexts/NotificationContext";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotificationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/new" element={<NewCustomer />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/customers/edit/:id" element={<EditCustomer />} />
            
            <Route path="/devices" element={<Devices />} />
            <Route path="/devices/new" element={<NewDevice />} />
            <Route path="/devices/:id" element={<DeviceDetail />} />
            <Route path="/devices/edit/:id" element={<EditDevice />} />
            
            <Route path="/services" element={<Services />} />
            <Route path="/services/new" element={<NewService />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/services/edit/:id" element={<EditService />} />
            
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notification-demo" element={<NotificationDemo />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
