import GoalRow from "./GoalRow";

function SortableGoalRow({ goal, category, onEdit, onDelete, onToggleGoal, onToggleStep, onReorderSteps, isLast }) {
    return (
        <GoalRow
            goal={goal}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleGoal={onToggleGoal}
            onToggleStep={onToggleStep}
            onReorderSteps={onReorderSteps}
            isLast={isLast}
        />
    );
}

export default SortableGoalRow;
