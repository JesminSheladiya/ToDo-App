package com.example.todoapp.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
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
    private String emoji = "target";

    private LocalDate targetDate;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime targetTime;

    @Builder.Default
    private String status = "active";

    private Integer taskOrder;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "task_steps", joinColumns = @JoinColumn(name = "task_id"))
    @OrderColumn(name = "step_order")
    @Builder.Default
    private List<TaskStep> steps = new ArrayList<>();
}
