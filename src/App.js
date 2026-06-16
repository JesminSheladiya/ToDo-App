import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MainLayout from "./layouts/MainLayout";
import CategoriesPage from "./pages/CategoriesPage";
import ListPage from "./pages/ListPage";
import GoalFormPage from "./pages/GoalFormPage";
import GoalDetailPage from "./pages/GoalDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
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
            <Routes location={background || location} className="app__routes">
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />} className="app__route">
                        <Route index element={<CategoriesPage />} className="app__route" />
                        <Route path="list" element={<ListPage />} className="app__route" />
                        <Route path="goals/:id" element={<GoalDetailPage />} className="app__route" />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Routes className="app__routes">
                <Route path="/goals/new" element={<ProtectedRoute><GoalFormPage /></ProtectedRoute>} className="app__route" />
                <Route path="/goals/:id/edit" element={<ProtectedRoute><GoalFormPage /></ProtectedRoute>} className="app__route" />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter className="app__browser-router">
            <LocalizationProvider dateAdapter={AdapterDayjs} className="app__localization-provider">
                <AppRoutes />
            </LocalizationProvider>
        </BrowserRouter>
    );
}

export default App;
