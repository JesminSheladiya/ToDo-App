package com.example.todoapp.controller;

import com.example.todoapp.dto.ReorderDto;
import com.example.todoapp.entity.Task;
import com.example.todoapp.entity.User;
import com.example.todoapp.repository.UserRepository;
import com.example.todoapp.service.TaskService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    public TaskController(TaskService taskService, UserRepository userRepository) {
        this.taskService = taskService;
        this.userRepository = userRepository;
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping
    public List<Task> getTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false, defaultValue = "taskOrder") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder) {
        return taskService.getAllTasks(getCurrentUserId(), search, category, status, sortBy, sortOrder);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@Valid @RequestBody Task task) {
        return taskService.createTask(task, getCurrentUserId());
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskService.updateTask(id, updatedTask, getCurrentUserId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id, getCurrentUserId());
    }

    @PutMapping("/reorder")
    @ResponseStatus(HttpStatus.OK)
    public void reorderGoals(@RequestBody ReorderDto reorderDto) {
        taskService.reorderGoals(reorderDto.getGoals(), getCurrentUserId());
    }
}
