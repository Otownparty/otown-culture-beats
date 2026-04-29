import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Events from "./pages/Events";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Tickets from "./pages/Tickets";
import Claim from "./pages/Claim";
import Scan from "./pages/Scan";
import StaffAuth from "./pages/StaffAuth";
import NotFound from "./pages/NotFound";
import Success from "./pages/Success";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/claim" element={<Claim />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/staff" element={<StaffAuth />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
