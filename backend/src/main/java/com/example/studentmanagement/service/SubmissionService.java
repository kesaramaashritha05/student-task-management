package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Submission;
import com.example.studentmanagement.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;

    @Autowired
    public SubmissionService(SubmissionRepository submissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    public Submission submitAssignment(Submission submission) {
        // Check if student has already submitted this assignment
        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentId(
                submission.getAssignmentId(), submission.getStudentId());

        if (existing.isPresent()) {
            // Update existing submission
            Submission prev = existing.get();
            prev.setSubmissionNotes(submission.getSubmissionNotes());
            prev.setSubmissionDate(LocalDateTime.now());
            prev.setStatus("SUBMITTED");
            return submissionRepository.save(prev);
        } else {
            submission.setSubmissionDate(LocalDateTime.now());
            submission.setStatus("SUBMITTED");
            if (submission.getGrade() == null || submission.getGrade().isBlank()) {
                submission.setGrade("PENDING");
            }
            return submissionRepository.save(submission);
        }
    }

    public List<Submission> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public Submission updateGrade(Long id, String grade, String status) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + id));

        submission.setGrade(grade);
        if (status != null && !status.isBlank()) {
            submission.setStatus(status);
        } else {
            submission.setStatus("GRADED");
        }
        return submissionRepository.save(submission);
    }
}
