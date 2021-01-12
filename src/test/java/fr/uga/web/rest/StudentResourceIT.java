package fr.uga.web.rest;

import fr.uga.EcomApp;
import fr.uga.domain.Student;
import fr.uga.domain.User;
import fr.uga.repository.StudentRepository;
import fr.uga.repository.UserRepository;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.uga.domain.enumeration.SportLevel;
import fr.uga.domain.enumeration.MeetingPlace;
/**
 * Integration tests for the {@link StudentResource} REST controller.
 */
@SpringBootTest(classes = EcomApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class StudentResourceIT {

    private static final SportLevel DEFAULT_SPORT_LEVEL = SportLevel.BEGINNER;
    private static final SportLevel UPDATED_SPORT_LEVEL = SportLevel.BEGINNER2;

    private static final Boolean DEFAULT_DRIVING_LICENCE = false;
    private static final Boolean UPDATED_DRIVING_LICENCE = true;

    private static final MeetingPlace DEFAULT_MEETING_PLACE = MeetingPlace.SMH;
    private static final MeetingPlace UPDATED_MEETING_PLACE = MeetingPlace.MINATEC;

    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStudentMockMvc;

    private Student student;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Student createEntity(EntityManager em) {
        Student student = new Student()
            .sportLevel(DEFAULT_SPORT_LEVEL)
            .drivingLicence(DEFAULT_DRIVING_LICENCE)
            .meetingPlace(DEFAULT_MEETING_PLACE);
        return student;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Student createUpdatedEntity(EntityManager em) {
        Student student = new Student()
            .sportLevel(UPDATED_SPORT_LEVEL)
            .drivingLicence(UPDATED_DRIVING_LICENCE)
            .meetingPlace(UPDATED_MEETING_PLACE);
        return student;
    }

    @BeforeEach
    public void initTest() {
        student = createEntity(em);
    }

    @Test
    @Transactional
    public void createStudent() throws Exception {
        int databaseSizeBeforeCreate = studentRepository.findAll().size();
        // Create the Student
        restStudentMockMvc.perform(post("/api/students")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(student)))
            .andExpect(status().isCreated());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeCreate + 1);
        Student testStudent = studentList.get(studentList.size() - 1);
        assertThat(testStudent.getSportLevel()).isEqualTo(DEFAULT_SPORT_LEVEL);
        assertThat(testStudent.isDrivingLicence()).isEqualTo(DEFAULT_DRIVING_LICENCE);
        assertThat(testStudent.getMeetingPlace()).isEqualTo(DEFAULT_MEETING_PLACE);
    }

    @Test
    @Transactional
    public void createStudentWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = studentRepository.findAll().size();

        // Create the Student with an existing ID
        student.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStudentMockMvc.perform(post("/api/students")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(student)))
            .andExpect(status().isBadRequest());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkDrivingLicenceIsRequired() throws Exception {
        int databaseSizeBeforeTest = studentRepository.findAll().size();
        // set the field null
        student.setDrivingLicence(null);

        // Create the Student, which fails.


        restStudentMockMvc.perform(post("/api/students")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(student)))
            .andExpect(status().isBadRequest());

        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStudents() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        // Get all the studentList
        restStudentMockMvc.perform(get("/api/students?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(student.getId().intValue())))
            .andExpect(jsonPath("$.[*].sportLevel").value(hasItem(DEFAULT_SPORT_LEVEL.toString())))
            .andExpect(jsonPath("$.[*].drivingLicence").value(hasItem(DEFAULT_DRIVING_LICENCE.booleanValue())))
            .andExpect(jsonPath("$.[*].meetingPlace").value(hasItem(DEFAULT_MEETING_PLACE.toString())));
    }
    
    @Test
    @Transactional
    public void getStudent() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        // Get the student
        restStudentMockMvc.perform(get("/api/students/{id}", student.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(student.getId().intValue()))
            .andExpect(jsonPath("$.sportLevel").value(DEFAULT_SPORT_LEVEL.toString()))
            .andExpect(jsonPath("$.drivingLicence").value(DEFAULT_DRIVING_LICENCE.booleanValue()))
            .andExpect(jsonPath("$.meetingPlace").value(DEFAULT_MEETING_PLACE.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingStudent() throws Exception {
        // Get the student
        restStudentMockMvc.perform(get("/api/students/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStudent() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        int databaseSizeBeforeUpdate = studentRepository.findAll().size();

        // Update the student
        Student updatedStudent = studentRepository.findById(student.getId()).get();
        // Disconnect from session so that the updates on updatedStudent are not directly saved in db
        em.detach(updatedStudent);
        updatedStudent
            .sportLevel(UPDATED_SPORT_LEVEL)
            .drivingLicence(UPDATED_DRIVING_LICENCE)
            .meetingPlace(UPDATED_MEETING_PLACE);

        restStudentMockMvc.perform(put("/api/students")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedStudent)))
            .andExpect(status().isOk());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
        Student testStudent = studentList.get(studentList.size() - 1);
        assertThat(testStudent.getSportLevel()).isEqualTo(UPDATED_SPORT_LEVEL);
        assertThat(testStudent.isDrivingLicence()).isEqualTo(UPDATED_DRIVING_LICENCE);
        assertThat(testStudent.getMeetingPlace()).isEqualTo(UPDATED_MEETING_PLACE);
    }

    @Test
    @Transactional
    public void updateNonExistingStudent() throws Exception {
        int databaseSizeBeforeUpdate = studentRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStudentMockMvc.perform(put("/api/students")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(student)))
            .andExpect(status().isBadRequest());

        // Validate the Student in the database
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteStudent() throws Exception {
        // Initialize the database
        studentRepository.saveAndFlush(student);

        int databaseSizeBeforeDelete = studentRepository.findAll().size();

        // Delete the student
        restStudentMockMvc.perform(delete("/api/students/{id}", student.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Student> studentList = studentRepository.findAll();
        assertThat(studentList).hasSize(databaseSizeBeforeDelete - 1);
    }
    
//NOT OUT-OF-THE-BOX TESTS
    
    @Test
    @Transactional
    public void getNestedStudent() throws Exception {
    	User user = new User();
    	user.setLogin("testlogin");
    	user.setPassword(RandomStringUtils.random(60));
    	
        // Initialize the database
    	userRepository.saveAndFlush(user);
    	student.setInternalUser(user);
    	studentRepository.saveAndFlush(student);

        // Get the instructor
        restStudentMockMvc.perform(get("/api/students/nestedstudent/{userid}", user.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.internalUser.id").value(user.getId().intValue()));
    }
    
    @Test
    @Transactional
    public void getNonExistingNestedStudent() throws Exception {
        // Get the instructor
        restStudentMockMvc.perform(get("/api/students/nestedstudent/{userid}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }
    
}
