package com.example.todoapp.entity;

import jakarta.persistence.Embeddable;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskStep {

    private String stepId;

    private String text;

    private boolean done;
}
