import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MainLayout from "./layouts/MainLayout";
import CategoriesPage from "./pages/CategoriesPage";
import ListPage from "./pages/ListPage";
import GoalFormPage from "./pages/GoalFormPage";
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
            <Routes location={background || location}>
                <Route element={<MainLayout />}>
                    <Route index element={<CategoriesPage />} />
                    <Route path="list" element={<ListPage />} />
                </Route>
            </Routes>

            <Routes>
                <Route path="goals/new" element={<GoalFormPage />} />
                <Route path="goals/:id/edit" element={<GoalFormPage />} />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <AppRoutes />
            </LocalizationProvider>
        </BrowserRouter>
    );
}

export default App;
