package com.example.todoapp.dto;

import lombok.*;

import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ReorderDto {
    private List<GoalOrder> goals;
    private List<StepOrder> steps;

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class GoalOrder {
        private Long id;
        private int position;
    }

    @Getter @Setter
    @NoArgsConstructor @AllArgsConstructor
    public static class StepOrder {
        private Long stepId;
        private int position;
    }
}
