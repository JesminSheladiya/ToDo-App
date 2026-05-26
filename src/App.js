import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CategoriesPage from "./pages/CategoriesPage";
import ListPage from "./pages/ListPage";
import GoalFormPage from "./pages/GoalFormPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<CategoriesPage />} />
                    <Route path="list" element={<ListPage />} />
                </Route>
                <Route path="goals/new" element={<GoalFormPage />} />
                <Route path="goals/:id/edit" element={<GoalFormPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
