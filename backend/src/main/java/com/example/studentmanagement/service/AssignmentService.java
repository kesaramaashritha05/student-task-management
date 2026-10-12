package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Assignment;
import com.example.studentmanagement.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    @Autowired
    public AssignmentService(AssignmentRepository assignmentRepository) {
        this.assignmentRepository = assignmentRepository;
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAllByOrderByDueDateAsc();
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Assignment createAssignment(Assignment assignment) {
        if (assignment.getMaxMarks() == null) {
            assignment.setMaxMarks(100);
        }
        return assignmentRepository.save(assignment);
    }

    public Assignment updateAssignment(Long id, Assignment details) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));

        assignment.setTitle(details.getTitle());
        assignment.setDescription(details.getDescription());
        assignment.setSubject(details.getSubject());
        assignment.setDueDate(details.getDueDate());
        assignment.setMaxMarks(details.getMaxMarks());
        if (details.getCreatedBy() != null) {
            assignment.setCreatedBy(details.getCreatedBy());
        }

        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new RuntimeException("Assignment not found with id: " + id);
        }
        assignmentRepository.deleteById(id);
    }
}
