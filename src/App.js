import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MainLayout from "./layouts/MainLayout";
import CategoriesPage from "./pages/CategoriesPage";
import ListPage from "./pages/ListPage";
import GoalFormPage from "./pages/GoalFormPage";
import GoalDetailPage from "./pages/GoalDetailPage";
import { fetchCategories } from "./store/configSlice";

function AppRoutes() {
    const dispatch = useDispatch();
    const location = useLocation();
    const background = location.state?.background;

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    return (
        <div className="app">
            <Routes location={background || location} className="app__routes">
                <Route element={<MainLayout />} className="app__route">
                    <Route index element={<CategoriesPage />} className="app__route" />
                    <Route path="list" element={<ListPage />} className="app__route" />
                    <Route path="goals/:id" element={<GoalDetailPage />} className="app__route" />
                </Route>
            </Routes>

            <Routes className="app__routes">
                <Route path="goals/new" element={<GoalFormPage />} className="app__route" />
                <Route path="goals/:id/edit" element={<GoalFormPage />} className="app__route" />
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
