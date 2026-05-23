import {
    Box,
    Button,
    Paper,
    Stack,
    TextField
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

function TaskForm({
    title,
    setTitle,
    description,
    setDescription,
    handleSubmit
}) {

    return (

        <Paper
            elevation={0}
            sx={{
                p: 4,

                background:
                    "rgba(30,41,59,0.8)",

                backdropFilter:
                    "blur(12px)",

                border:
                    "1px solid rgba(255,255,255,0.08)"
            }}
        >

            <Box
                component="form"
                onSubmit={handleSubmit}
            >

                <Stack spacing={3}>

                    <TextField
                        label="Task Title"
                        fullWidth
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />

                    <TextField
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<AddIcon />}
                        sx={{
                            py: 1.5,
                            fontWeight: "bold"
                        }}
                    >
                        Add Task
                    </Button>

                </Stack>

            </Box>

        </Paper>
    );
}

export default TaskForm;