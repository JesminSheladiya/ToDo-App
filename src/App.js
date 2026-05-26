import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import CategoriesPage from "./pages/CategoriesPage";
import ListPage from "./pages/ListPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<CategoriesPage />} />
                    <Route path="list" element={<ListPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
