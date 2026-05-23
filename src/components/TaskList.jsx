import Grid from "@mui/material/Grid";
import TaskCard from "./TaskCard";

function TaskList({
    tasks,
    onDelete,
    onToggle
}) {

    return (
        <Grid
            container
            spacing={3}
        >

            {tasks.map((task) => (

                <Grid
                    key={task.id}
                    size={{
                        xs: 12,
                        sm: 6,
                        lg: 4
                    }}
                >

                    <TaskCard
                        task={task}
                        onDelete={onDelete}
                        onToggle={onToggle}
                    />

                </Grid>

            ))}

        </Grid>
    );
}

export default TaskList;