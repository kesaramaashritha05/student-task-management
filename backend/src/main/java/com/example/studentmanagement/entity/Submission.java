package com.example.studentmanagement.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "assignment_id", nullable = false)
    private Long assignmentId;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "student_name", nullable = false, length = 100)
    private String studentName;

    @Column(name = "submission_notes", columnDefinition = "TEXT")
    private String submissionNotes;

    @Column(name = "submission_date")
    private LocalDateTime submissionDate;

    @Column(length = 50)
    private String status = "SUBMITTED"; // "SUBMITTED", "GRADED", "PENDING"

    @Column(length = 20)
    private String grade = "PENDING";

    public Submission() {
    }

    public Submission(Long assignmentId, Long studentId, String studentName, String submissionNotes, String status, String grade) {
        this.assignmentId = assignmentId;
        this.studentId = studentId;
        this.studentName = studentName;
        this.submissionNotes = submissionNotes;
        this.status = status != null ? status : "SUBMITTED";
        this.grade = grade != null ? grade : "PENDING";
    }

    @PrePersist
    protected void onCreate() {
        this.submissionDate = LocalDateTime.now();
        if (this.status == null) {
            this.status = "SUBMITTED";
        }
        if (this.grade == null) {
            this.grade = "PENDING";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getSubmissionNotes() {
        return submissionNotes;
    }

    public void setSubmissionNotes(String submissionNotes) {
        this.submissionNotes = submissionNotes;
    }

    public LocalDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(LocalDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}
