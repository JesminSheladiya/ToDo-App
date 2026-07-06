import GoalRow from "./GoalRow";

function SortableGoalRow({ goal, category, onViewDetails, onEdit, onDelete, onToggleGoal, onToggleStep, onReorderSteps, onPauseToggle, isLast, className }) {
    const combinedClassName = `sortable-goal-row${className ? ` ${className}` : ""}`;
    return (
        <GoalRow className={combinedClassName}
            goal={goal}
            category={category}
            onViewDetails={onViewDetails}
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
