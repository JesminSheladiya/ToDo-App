package com.example.todoapp.repository;

import com.example.todoapp.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByOrderByTaskOrderAsc();

    @Modifying
    @Query(value = "UPDATE tasks SET task_order = :position WHERE id = :id", nativeQuery = true)
    void updateTaskOrder(Long id, int position);
}
