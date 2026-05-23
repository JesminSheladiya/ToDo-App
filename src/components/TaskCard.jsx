import {
    Card,
    CardContent,
    Typography,
    Stack,
    IconButton,
    Chip,
    Box
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function TaskCard({
    task,
    onDelete,
    onToggle
}) {

    return (

        <Card
            sx={{
                height: "100%",
                background:
                    "rgba(30, 41, 59, 0.8)",

                backdropFilter: "blur(10px)",

                border:
                    "1px solid rgba(255,255,255,0.08)",

                transition: "0.3s",

                "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.4)"
                }
            }}
        >

            <CardContent>

                <Stack
                    spacing={3}
                >

                    <Box>

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                textDecoration:
                                    task.completed
                                        ? "line-through"
                                        : "none",

                                opacity:
                                    task.completed
                                        ? 0.6
                                        : 1
                            }}
                        >
                            {task.title}
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                color: "#94a3b8"
                            }}
                        >
                            {task.description}
                        </Typography>

                    </Box>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Chip
                            label={
                                task.completed
                                    ? "Completed"
                                    : "Pending"
                            }

                            color={
                                task.completed
                                    ? "success"
                                    : "warning"
                            }
                        />

                        <Stack direction="row">

                            <IconButton
                                color="success"
                                onClick={() => onToggle(task)}
                            >
                                <CheckCircleIcon />
                            </IconButton>

                            <IconButton
                                color="error"
                                onClick={() => onDelete(task.id)}
                            >
                                <DeleteIcon />
                            </IconButton>

                        </Stack>

                    </Stack>

                </Stack>

            </CardContent>

        </Card>
    );
}

export default TaskCard;