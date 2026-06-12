package com.example.todoapp.service;

import com.example.todoapp.dto.ReorderDto;
import com.example.todoapp.entity.Task;
import com.example.todoapp.entity.TaskStep;
import com.example.todoapp.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByTaskOrderAsc();
    }

    @Transactional
    public Task createTask(Task task) {
        normalizeTask(task);
        syncCompletion(task);
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, Task updatedTask) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));

        task.setTitle(updatedTask.getTitle());
        task.setDescription(updatedTask.getDescription());
        task.setCategory(updatedTask.getCategory());
        task.setEmoji(updatedTask.getEmoji());
        task.setTargetDate(updatedTask.getTargetDate());
        task.setTargetTime(updatedTask.getTargetTime());
        task.setTaskOrder(updatedTask.getTaskOrder());
        task.setCompleted(updatedTask.isCompleted());
        task.setStatus(updatedTask.getStatus());
        task.setSteps(updatedTask.getSteps() != null ? updatedTask.getSteps() : new ArrayList<>());

        normalizeTask(task);
        syncCompletion(task);

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    @Transactional
    public void reorderGoals(List<ReorderDto.GoalOrder> goalOrders) {
        if (goalOrders == null) return;
        for (ReorderDto.GoalOrder order : goalOrders) {
            taskRepository.updateTaskOrder(order.getId(), order.getPosition());
        }
    }

    private void normalizeTask(Task task) {
        if (task.getCategory() == null || task.getCategory().isBlank()) {
            task.setCategory("short_term");
        }
        if (task.getEmoji() == null || task.getEmoji().isBlank()) {
            task.setEmoji("target");
        }
        if (task.getStatus() == null || task.getStatus().isBlank()) {
            task.setStatus(task.isCompleted() ? "completed" : "active");
        }
        if (!"paused".equals(task.getStatus()) && task.isCompleted()) {
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

    private void syncCompletion(Task task) {
        List<TaskStep> steps = task.getSteps();
        if (steps != null && !steps.isEmpty()) {
            boolean allDone = steps.stream().allMatch(TaskStep::isDone);
            task.setCompleted(allDone);
            if (!"paused".equals(task.getStatus())) {
                task.setStatus(allDone ? "completed" : "active");
            }
        }
    }
}
