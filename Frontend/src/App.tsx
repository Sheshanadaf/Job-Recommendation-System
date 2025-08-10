import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Router,Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import QualificationsPage from "./pages/QualificationsPage";
import QualificationsFormPage from "./pages/QualificationsFormPage";
import PostJobPage from "./pages/PostJobPage";
import LoadingPage from "./pages/LoadingPage";
import Signup from "./pages/Signup";
import ResultPage from "./pages/ResultPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="Signup/" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Layout><HomePage /></Layout></ProtectedRoute>} />
          <Route path="/qualifications" element={<ProtectedRoute><Layout><QualificationsPage /></Layout></ProtectedRoute>} />
          <Route path="/qualifications-form" element={<ProtectedRoute><Layout><QualificationsFormPage /></Layout></ProtectedRoute>} />
          <Route path="/post-job" element={<ProtectedRoute><Layout><PostJobPage /></Layout></ProtectedRoute>} />
          <Route path="/job-matching" element={<ProtectedRoute><LoadingPage title="Finding Perfect Matches" message="We're analyzing your profile and matching you with the best job opportunities." /></ProtectedRoute>} />
          <Route path="/job-details" element={<ProtectedRoute><LoadingPage title="Loading Job Details" message="Please wait while we load the complete job information." /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><Layout><ResultPage /></Layout></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
