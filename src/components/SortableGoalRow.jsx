import GoalRow from "./GoalRow";

function SortableGoalRow({ goal, category, onEdit, onDelete, onToggleGoal, onToggleStep, onReorderSteps, onPauseToggle, isLast }) {
    return (
        <GoalRow className="sortable-goal-row"
            goal={goal}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleGoal={onToggleGoal}
            onToggleStep={onToggleStep}
            onReorderSteps={onReorderSteps}
            onPauseToggle={onPauseToggle}
            isLast={isLast}
        />
    );
}

export default SortableGoalRow;
