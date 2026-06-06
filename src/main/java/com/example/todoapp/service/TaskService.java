package com.example.todoapp.service;

import com.example.todoapp.entity.Task;
import com.example.todoapp.entity.TaskStep;
import com.example.todoapp.repository.TaskRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {
        normalizeTask(task);
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id).orElseThrow();

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setCompleted(updatedTask.isCompleted());
        task.setCategory(updatedTask.getCategory());
        task.setEmoji(updatedTask.getEmoji());
        task.setTargetDate(updatedTask.getTargetDate());
        task.setStatus(updatedTask.getStatus());
        task.setTaskOrder(updatedTask.getTaskOrder());
        task.setSteps(updatedTask.getSteps());

        normalizeTask(task);

        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    private void normalizeTask(Task task) {
        if (task.getCategory() == null || task.getCategory().isBlank()) {
            task.setCategory("short_term");
        }

        if (task.getEmoji() == null || task.getEmoji().isBlank()) {
            task.setEmoji("🎯");
        }

        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus(task.isCompleted() ? "completed" : "active");
        }

        if (task.isCompleted()) {
            task.setStatus("completed");
        }

        if ("completed".equals(task.getStatus())) {
            task.setCompleted(true);
        }

        if (task.getSteps() == null) {
            task.setSteps(new ArrayList<>());
        }

        for (TaskStep step : task.getSteps()) {
            if (step.getStepId() == null || step.getStepId().isBlank()) {
                step.setStepId(UUID.randomUUID().toString());
            }
        }
    }
}
