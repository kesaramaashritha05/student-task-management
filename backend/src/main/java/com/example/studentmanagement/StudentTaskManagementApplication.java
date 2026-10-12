package com.example.studentmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentTaskManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentTaskManagementApplication.class, args);
        System.out.println("=================================================");
        System.out.println(" Student Task Management Backend Started on :8080 ");
        System.out.println("=================================================");
    }
}
