package com.example.todoapp.controller;

import com.example.todoapp.dto.CategoryDto;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins = "http://192.168.1.4:3000")
public class CategoryController {

    @GetMapping
    public List<CategoryDto> getCategories() {
        return Arrays.asList(
                CategoryDto.builder()
                        .key("short_term")
                        .label("Short Term")
                        .sublabel("Days to weeks")
                        .iconKey("flash")
                        .gradient("linear-gradient(135deg, #fb923c, #f87171)")
                        .soft("#fff7ed")
                        .border("#fed7aa")
                        .badgeBg("#ffedd5")
                        .text("#ea580c")
                        .progress("#fb923c")
                        .build(),
                CategoryDto.builder()
                        .key("mid_term")
                        .label("Mid Term")
                        .sublabel("Weeks to months")
                        .iconKey("target")
                        .gradient("linear-gradient(135deg, #facc15, #f59e0b)")
                        .soft("#fefce8")
                        .border("#fef08a")
                        .badgeBg("#fef3c7")
                        .text("#ca8a04")
                        .progress("#facc15")
                        .build(),
                CategoryDto.builder()
                        .key("long_term")
                        .label("Long Term")
                        .sublabel("6 months to 1 year")
                        .iconKey("growth")
                        .gradient("linear-gradient(135deg, #4ade80, #10b981)")
                        .soft("#f0fdf4")
                        .border("#bbf7d0")
                        .badgeBg("#dcfce7")
                        .text("#16a34a")
                        .progress("#4ade80")
                        .build(),
                CategoryDto.builder()
                        .key("very_long_term")
                        .label("Very Long Term")
                        .sublabel("1 to 5 years")
                        .iconKey("launch")
                        .gradient("linear-gradient(135deg, #60a5fa, #6366f1)")
                        .soft("#eff6ff")
                        .border("#bfdbfe")
                        .badgeBg("#dbeafe")
                        .text("#2563eb")
                        .progress("#60a5fa")
                        .build(),
                CategoryDto.builder()
                        .key("life_goal")
                        .label("Life Goal")
                        .sublabel("5+ years / lifetime")
                        .iconKey("star")
                        .gradient("linear-gradient(135deg, #c084fc, #ec4899)")
                        .soft("#faf5ff")
                        .border("#e9d5ff")
                        .badgeBg("#f3e8ff")
                        .text("#9333ea")
                        .progress("#a855f7")
                        .build()
        );
    }
}
