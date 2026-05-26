import { useSelector } from "react-redux";
import { CATEGORIES } from "../constants/goals";
import CategorySection from "../components/CategorySection";
import Stack from "../components/Stack";
import { useGoalActions } from "../hooks/useGoalActions";

function CategoriesPage() {
    const goals = useSelector((state) => state.goals.items);
    const {
        handleOpenCreate,
        handleOpenEdit,
        handleDelete,
        handleToggleGoal,
        handleToggleStep
    } = useGoalActions();

    return (
        <Stack spacing={4}>
            {CATEGORIES.map((category) => (
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
