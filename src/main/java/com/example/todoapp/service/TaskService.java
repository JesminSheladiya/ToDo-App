package com.example.todoapp.service;

import com.example.todoapp.dto.ReorderDto;
import com.example.todoapp.entity.Task;
import com.example.todoapp.entity.TaskStep;
import com.example.todoapp.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Comparator;
import java.util.stream.Stream;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<Task> getAllTasks(Long userId, String search, String category, String status, String sortBy, String sortOrder) {
        Stream<Task> stream = taskRepository.findByUserIdOrderByTaskOrderAsc(userId).stream();

        if (search != null && !search.isBlank()) {
            stream = stream.filter(t -> t.getTitle().toLowerCase().contains(search.toLowerCase()));
        }
        if (category != null && !category.isBlank()) {
            stream = stream.filter(t -> category.equals(t.getCategory()));
        }
        if (status != null && !status.isBlank()) {
            stream = stream.filter(t -> status.equals(t.getStatus()));
        }

        return stream.sorted(getComparator(sortBy, sortOrder)).collect(Collectors.toList());
    }

    private Comparator<Task> getComparator(String sortBy, String sortOrder) {
        Comparator<Task> comparator;
        if (sortBy == null) sortBy = "taskOrder";
        switch (sortBy) {
            case "title":
                comparator = Comparator.comparing(Task::getTitle, String.CASE_INSENSITIVE_ORDER);
                break;
            case "createdAt":
                comparator = Comparator.comparing(Task::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
                break;
            case "status":
                comparator = Comparator.comparing(Task::getStatus);
                break;
            default:
                comparator = Comparator.comparing(Task::getTaskOrder, Comparator.nullsLast(Comparator.naturalOrder()));
        }
        if ("desc".equalsIgnoreCase(sortOrder)) {
            comparator = comparator.reversed();
        }
        return comparator;
    }

    @Transactional
    public Task createTask(Task task, Long userId) {
        task.setUserId(userId);
        normalizeTask(task);
        syncCompletion(task);
        updateCompletedAt(task);
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, Task updatedTask, Long userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));

        if (task.getUserId() != null && !task.getUserId().equals(userId)) {
            throw new EntityNotFoundException("Task not found: " + id);
        }
        task.setUserId(userId);

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
        updateCompletedAt(task);

        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id, Long userId) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found: " + id));

        if (task.getUserId() != null && !task.getUserId().equals(userId)) {
            throw new EntityNotFoundException("Task not found: " + id);
        }

        taskRepository.deleteById(id);
    }

    @Transactional
    public void reorderGoals(List<ReorderDto.GoalOrder> goalOrders, Long userId) {
        if (goalOrders == null) return;
        for (ReorderDto.GoalOrder order : goalOrders) {
            taskRepository.updateTaskOrder(order.getId(), order.getPosition(), userId);
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

    private void updateCompletedAt(Task task) {
        if (task.isCompleted()) {
            if (task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDateTime.now());
            }
        } else {
            task.setCompletedAt(null);
        }
    }
}
