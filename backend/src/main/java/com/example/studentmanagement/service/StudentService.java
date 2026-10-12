package com.example.studentmanagement.service;

import com.example.studentmanagement.entity.Student;
import com.example.studentmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new IllegalArgumentException("Student with this email already exists: " + student.getEmail());
        }
        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            throw new IllegalArgumentException("Student with this roll number already exists: " + student.getRollNumber());
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        // Check unique constraints if changed
        if (!student.getEmail().equalsIgnoreCase(studentDetails.getEmail()) &&
                studentRepository.existsByEmail(studentDetails.getEmail())) {
            throw new IllegalArgumentException("Email already taken by another student.");
        }
        if (!student.getRollNumber().equalsIgnoreCase(studentDetails.getRollNumber()) &&
                studentRepository.existsByRollNumber(studentDetails.getRollNumber())) {
            throw new IllegalArgumentException("Roll number already taken by another student.");
        }

        student.setName(studentDetails.getName());
        student.setEmail(studentDetails.getEmail());
        student.setRollNumber(studentDetails.getRollNumber());
        student.setCourse(studentDetails.getCourse());
        student.setDepartment(studentDetails.getDepartment());
        student.setSemester(studentDetails.getSemester());
        student.setPhoneNumber(studentDetails.getPhoneNumber());

        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }
}
