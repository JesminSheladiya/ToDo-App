package com.example.todoapp.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {

    private String name;
    private String email;
    private String password;
    private String confirmPassword;
}
