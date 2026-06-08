package com.example.todoapp.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CategoryDto {
    private String key;
    private String label;
    private String sublabel;
    private String iconKey;
    private String gradient;
    private String soft;
    private String border;
    private String badgeBg;
    private String text;
    private String progress;
}
