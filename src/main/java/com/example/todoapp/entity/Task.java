package com.example.todoapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String description;

    private boolean completed;

    @Builder.Default
    private String category = "short_term";

    @Builder.Default
    private String emoji = "🎯";

    private LocalDate targetDate;

    @Builder.Default
    private String status = "active";

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "task_steps",
            joinColumns = @JoinColumn(name = "task_id")
    )
    @OrderColumn(name = "step_order")
    @Builder.Default
    private List<TaskStep> steps = new ArrayList<>();
}
