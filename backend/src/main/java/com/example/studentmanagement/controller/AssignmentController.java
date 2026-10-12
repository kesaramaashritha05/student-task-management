package com.example.studentmanagement.controller;

import com.example.studentmanagement.entity.Assignment;
import com.example.studentmanagement.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @Autowired
    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // 1. Get all assignments
    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    // 2. Get assignment by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignmentById(@PathVariable Long id) {
        return assignmentService.getAssignmentById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body((Assignment) null));
    }

    // 3. Create new assignment (Teacher)
    @PostMapping
    public ResponseEntity<?> createAssignment(@RequestBody Assignment assignment) {
        try {
            if (assignment.getTitle() == null || assignment.getTitle().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Title is required"));
            }
            if (assignment.getSubject() == null || assignment.getSubject().isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Subject is required"));
            }
            if (assignment.getDueDate() == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Due Date is required"));
            }

            Assignment saved = assignmentService.createAssignment(assignment);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error creating assignment: " + e.getMessage()));
        }
    }

    // 4. Update assignment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, @RequestBody Assignment details) {
        try {
            Assignment updated = assignmentService.updateAssignment(id, details);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating assignment: " + e.getMessage()));
        }
    }

    // 5. Delete assignment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            assignmentService.deleteAssignment(id);
            return ResponseEntity.ok(Map.of("message", "Assignment deleted successfully", "id", id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting assignment: " + e.getMessage()));
        }
    }
}
