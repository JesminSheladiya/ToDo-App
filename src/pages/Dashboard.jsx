import { useEffect, useState } from "react";

import {
    Box,
    Container,
    Typography
} from "@mui/material";

import api from "../api/api";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import EmptyState from "../components/EmptyState";

function Dashboard() {

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {

        try {

            const response = await api.get("/tasks");

            setTasks(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!title.trim()) return;

        try {

            const newTask = {
                title,
                description,
                completed: false
            };

            const response = await api.post(
                "/tasks",
                newTask
            );

            setTasks((prev) => [
                response.data,
                ...prev
            ]);

            setTitle("");
            setDescription("");

        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {

        try {

            await api.delete(`/tasks/${id}`);

            setTasks((prev) =>
                prev.filter((task) => task.id !== id)
            );

        } catch (error) {
            console.error(error);
        }
    };

    const handleToggle = async (task) => {

        try {

            const updatedTask = {
                ...task,
                completed: !task.completed
            };

            const response = await api.put(
                `/tasks/${task.id}`,
                updatedTask
            );

            setTasks((prev) =>
                prev.map((t) =>
                    t.id === task.id
                        ? response.data
                        : t
                )
            );

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(to bottom right, #0f172a, #111827)",
                py: 6
            }}
        >

            <Container maxWidth="lg">

                <Box
                    sx={{
                        mb: 5
                    }}
                >

                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        gutterBottom
                    >
                        GoalPath
                    </Typography>

                    <Typography
                        color="gray"
                        fontSize="18px"
                    >
                        Track tasks, stay focused,
                        and build consistency.
                    </Typography>

                </Box>

                <TaskForm
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    handleSubmit={handleSubmit}
                />

                <Box sx={{ mt: 5 }}>

                    {
                        tasks.length > 0 ? (
                            <TaskList
                                tasks={tasks}
                                onDelete={handleDelete}
                                onToggle={handleToggle}
                            />
                        ) : (
                            <EmptyState />
                        )
                    }

                </Box>

            </Container>

        </Box>
    );
}

export default Dashboard;