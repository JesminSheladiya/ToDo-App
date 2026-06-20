import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./layouts/MainLayout";
import CategoriesPage from "./pages/CategoriesPage";
import ListPage from "./pages/ListPage";
import GoalFormPage from "./pages/GoalFormPage";
import GoalDetailPage from "./pages/GoalDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProtectedRoute, { GuestRoute } from "./components/ProtectedRoute";
import { fetchCategories } from "./store/configSlice";
import { fetchCurrentUser } from "./store/authSlice";

function AppRoutes() {
    const dispatch = useDispatch();
    const location = useLocation();
    const background = location.state?.background;
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        if (token) {
            dispatch(fetchCurrentUser());
        }
        dispatch(fetchCategories());
    }, [dispatch, token]);

    return (
        <div className="app">
            <Routes location={background || location}>
                <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
                <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
                <Route path="/verify-otp" element={<GuestRoute><OtpVerificationPage /></GuestRoute>} />
                <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

                <Route path="/goals/new" element={<ProtectedRoute><GoalFormPage /></ProtectedRoute>} />
                <Route path="/goals/:id/edit" element={<ProtectedRoute><GoalFormPage /></ProtectedRoute>} />

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route index element={<CategoriesPage />} />
                        <Route path="list" element={<ListPage />} />
                        <Route path="goals/:id" element={<GoalDetailPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {background && (
                <Routes>
                    <Route path="/goals/new" element={<ProtectedRoute><GoalFormPage /></ProtectedRoute>} />
                    <Route path="/goals/:id/edit" element={<ProtectedRoute><GoalFormPage /></ProtectedRoute>} />
                </Routes>
            )}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter className="app__browser-router">
            <LocalizationProvider dateAdapter={AdapterDayjs} className="app__localization-provider">
                <AppRoutes />
                <ToastContainer position="bottom-right" autoClose={1500} hideProgressBar={false} newestOnTop closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Zoom} />
            </LocalizationProvider>
        </BrowserRouter>
    );
}

export default App;
