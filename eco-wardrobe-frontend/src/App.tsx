import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Wardrobe from "./pages/Wardrobe";
import Scanner from "./pages/Scanner";
import Analytics from "./pages/Analytics";
import Influencers from "./pages/Influencers";
import Settings from "./pages/Settings";
import PublicWardrobe from "./pages/PublicWardrobe";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/wardrobe" element={<Wardrobe />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/influencers" element={<Influencers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/public-wardrobe/:id" element={<PublicWardrobe />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
