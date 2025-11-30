import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Auth from "./pages/Auth";
import Wardrobe from "./pages/Wardrobe";
import Scanner from "./pages/Scanner";
import Analytics from "./pages/Analytics";
import DiscoverWardrobes from "./pages/DiscoverWardrobes";
import Settings from "./pages/Settings";
import PublicWardrobe from "./pages/PublicWardrobe";
import PublicProductDetail from "./pages/PublicProductDetail";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route
              path="/wardrobe"
              element={
                <ProtectedRoute>
                  <Wardrobe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scanner"
              element={
                <ProtectedRoute>
                  <Scanner />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/discover-wardrobes"
              element={
                <ProtectedRoute>
                  <DiscoverWardrobes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="/public-wardrobe/:id" element={<PublicWardrobe />} />
            <Route path="/public-wardrobe/:influencerId/product/:productId" element={<PublicProductDetail />} />
            <Route
              path="/product/:id"
              element={
                <ProtectedRoute>
                  <ProductDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
