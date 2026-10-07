import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { AppProvider } from './store/AppContext';

import LoginPage from './pages/LoginPage';
import RegisterEmailPage from './pages/RegisterEmailPage';
import RegisterCodePage from './pages/RegisterCodePage';
import RegisterProfilePage from './pages/RegisterProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import HomePage from './pages/HomePage';
import SpacePage from './pages/SpacePage';
import FriendsPage from './pages/FriendsPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import AppLayout from './components/layout/AppLayout';

function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/" replace />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Публичные страницы */}
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterEmailPage />} />
                    <Route path="/register/verify" element={<RegisterCodePage />} />
                    <Route path="/register/profile" element={<RegisterProfilePage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                    {/* Приложение (только для авторизованных) */}
                    <Route
                        path="/app"
                        element={
                            <PrivateRoute>
                                <AppProvider>
                                    <AppLayout />
                                </AppProvider>
                            </PrivateRoute>
                        }
                    >
                        <Route index element={<HomePage />} />
                        <Route path="space/:spaceId" element={<SpacePage />} />
                        <Route path="space/:spaceId/channel/:channelId" element={<SpacePage />} />
                        <Route path="dm/:userId" element={<SpacePage />} />
                        <Route path="friends" element={<FriendsPage />} />
                        <Route path="search" element={<SearchPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}