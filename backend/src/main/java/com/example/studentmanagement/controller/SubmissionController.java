package com.example.studentmanagement.controller;

import com.example.studentmanagement.entity.Submission;
import com.example.studentmanagement.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    private final SubmissionService submissionService;

    @Autowired
    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    // 1. Submit or update an assignment submission (Student)
    @PostMapping("/submit")
    public ResponseEntity<?> submitAssignment(@RequestBody Submission submission) {
        try {
            if (submission.getAssignmentId() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Assignment ID is required"));
            }
            if (submission.getStudentId() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Student ID is required"));
            }

            Submission saved = submissionService.submitAssignment(submission);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error submitting assignment: " + e.getMessage()));
        }
    }

    // 2. Get all submissions by a student ID
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStudent(studentId));
    }

    // 3. Get all submissions for an assignment ID (Teacher)
    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<Submission>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    // 4. Get all submissions across system
    @GetMapping
    public ResponseEntity<List<Submission>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.getAllSubmissions());
    }

    // 5. Update submission grade / status (Teacher)
    @PutMapping("/{id}/grade")
    public ResponseEntity<?> gradeSubmission(
            @PathVariable Long id,
            @RequestBody Map<String, String> gradePayload) {
        try {
            String grade = gradePayload.getOrDefault("grade", "A");
            String status = gradePayload.getOrDefault("status", "GRADED");
            Submission graded = submissionService.updateGrade(id, grade, status);
            return ResponseEntity.ok(graded);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error grading submission: " + e.getMessage()));
        }
    }
}
