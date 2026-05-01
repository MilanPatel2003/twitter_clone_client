import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { FeedPage } from "@/pages/FeedPage";
import { TweetDetailPage } from "./pages/TweetDetails";
import { ProfilePage } from "./pages/ProfilePage";
import { SearchPage } from "./pages/SearchPage";
// import { NotificationsPage } from "@/pages/NotificationsPage";

const Spinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#1d9bf0] border-t-transparent rounded-full animate-spin" />
  </div>
);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />; 
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />; //
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
     <Route path="/tweet/:tweetId" element={<PrivateRoute><TweetDetailPage /></PrivateRoute>} />
      {/*  <Route path="/notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />*/}
      <Route path="/:username" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> 
      <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />

    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
