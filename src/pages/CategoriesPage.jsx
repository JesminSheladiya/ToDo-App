import { useSelector } from "react-redux";
import { CATEGORIES } from "../constants/goals";
import CategorySection from "../components/CategorySection";
import Stack from "../components/Stack";
import { useGoalActions } from "../hooks/useGoalActions";

function CategoriesPage() {
    const goals = useSelector((state) => state.goals.items);
    const activeCategory = useSelector((state) => state.ui.activeCategory);
    const {
        handleOpenCreate,
        handleOpenEdit,
        handleDelete,
        handleToggleGoal,
        handleToggleStep
    } = useGoalActions();

    const filteredCategories = activeCategory === "all"
        ? CATEGORIES
        : CATEGORIES.filter((cat) => cat.key === activeCategory);

    return (
        <Stack spacing={2.5}>
            {filteredCategories.map((category) => (
                <CategorySection
                    key={category.key}
                    category={category}
                    goals={goals.filter((goal) => goal.category === category.key)}
                    onCreate={handleOpenCreate}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                    onToggleGoal={handleToggleGoal}
                    onToggleStep={handleToggleStep}
                />
            ))}
        </Stack>
    );
}

export default CategoriesPage;
