package com.example.todoapp.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String name;
    private String email;
    private String dob;
    private String photo;
}
