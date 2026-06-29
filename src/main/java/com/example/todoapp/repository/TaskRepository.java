package com.example.todoapp.repository;

import com.example.todoapp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByUserIdOrderByTaskOrderAsc(Long userId);

    @Modifying
    @Query(value = "UPDATE tasks SET task_order = :position WHERE id = :id AND user_id = :userId", nativeQuery = true)
    void updateTaskOrder(Long id, int position, Long userId);

    void deleteByUserId(Long userId);
}
