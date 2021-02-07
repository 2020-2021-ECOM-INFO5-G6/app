package fr.uga.web.rest;

import fr.uga.domain.Student;
import fr.uga.domain.Activity;
import fr.uga.domain.Cursus;
import fr.uga.domain.User;
import fr.uga.repository.ActivityRepository;
import fr.uga.repository.SemesterInscriptionRepository;
import fr.uga.repository.StudentActivityRepository;
import fr.uga.repository.StudentRepository;
import fr.uga.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Iterator;

/**
 * REST controller for managing {@link fr.uga.domain.Student}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StudentResource {

    private final Logger log = LoggerFactory.getLogger(StudentResource.class);

    private static final String ENTITY_NAME = "student";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentRepository studentRepository;
    
    private final SemesterInscriptionRepository semesterInscriptionRepository;
    
    private final StudentActivityRepository studentActivityRepository;
    
    private final ActivityRepository activityRepository;
    
    public StudentResource(StudentRepository studentRepository, SemesterInscriptionRepository semesterInscriptionRepository, StudentActivityRepository studentActivityRepository, ActivityRepository activityRepository) {
        this.studentRepository = studentRepository;
        this.semesterInscriptionRepository = semesterInscriptionRepository;
        this.studentActivityRepository = studentActivityRepository;
        this.activityRepository = activityRepository;
    }

    /**
     * {@code POST  /students} : Create a new student.
     *
     * @param student the student to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new student, or with status {@code 400 (Bad Request)} if the
     *         student has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/students")
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) throws URISyntaxException {
        log.debug("REST request to save Student : {}", student);
        if (student.getId() != null) {
            throw new BadRequestAlertException("A new student cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Student result = studentRepository.save(student);
        return ResponseEntity
                .created(new URI("/api/students/" + result.getId())).headers(HeaderUtil
                        .createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT  /students} : Updates an existing student.
     *
     * @param student the student to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated student, or with status {@code 400 (Bad Request)} if the
     *         student is not valid, or with status
     *         {@code 500 (Internal Server Error)} if the student couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/students")
    public ResponseEntity<Student> updateStudent(@Valid @RequestBody Student student) throws URISyntaxException {
        log.debug("REST request to update Student : {}", student);
        if (student.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Student result = studentRepository.save(student);
        return ResponseEntity.ok().headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, student.getId().toString()))
                .body(result);
    }

    /**
     * {@code GET  /students} : get all the students.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of students in body.
     */
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        log.debug("REST request to get all Students");
        return studentRepository.findAll();
    }

    /**
     * {@code GET  /students/:id} : get the "id" student.
     *
     * @param id the id of the student to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the student, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/students/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable Long id) {
        log.debug("REST request to get Student : {}", id);
        Optional<Student> student = studentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(student);
    }

    /**
     * {@code DELETE  /students/:id} : delete the "id" student.
     *
     * @param id the id of the student to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/students/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        log.debug("REST request to delete Student : {}", id);
        studentRepository.deleteById(id);
        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    // NOT OUT-OF-THE-BOX

    /**
     * {@code GET  /students/nestedstudent/:userid} : get the student having the
     * corresponding internalUser.
     *
     * @param userid the id of the internalUser nested to the student to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the student, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/students/nestedstudent/{userid}")
    public ResponseEntity<Student> getNestedStudent(@PathVariable Long userid) {
        log.debug("REST request to get Student with corresponding internalUser : {}", userid);
        Optional<Student> student = studentRepository.findAll().stream()
        		.filter(s -> Objects.nonNull(s.getInternalUser()))
        		.filter(sbis -> sbis.getInternalUser().getId().equals(userid))
        		.findAny();
        
        if(student.isPresent()) {
        	Student st = student.get();
        	semesterInscriptionRepository.findAll().stream()
        			.filter(si -> Objects.nonNull(si.getStudent()))
        			.filter(si -> si.getStudent().getId() == st.getId())
        			.forEach(si -> st.addSemesterInscription(si));
        }  
        return ResponseUtil.wrapOrNotFound(student);
    }

    @GetMapping("/students/$content")
    public ResponseEntity<String> getStudentsContent() {
        log.debug("REST request to get Students content");
        List<Student> students = studentRepository.findAll();
        Optional<String> data;

        if (!students.isEmpty()) {
            String content = "";

            Iterator<Student> iter = students.iterator();
            while (iter.hasNext()) {
                Student student = iter.next();
                User user = student.getInternalUser();
                if (user != null) {
                    content += user.getFirstName() 
                    + ";" + user.getLastName();
                } else {
                    content += ";";
                }
                content += ";" + student.getSportLevel() 
                    + ";" + student.getMeetingPlace()
                    + ";" + student.isDrivingLicence();
                Cursus cursus = student.getCursus();
                if (cursus != null) {
                    content += ";" + cursus.getComposant()
                    + ";" + cursus.getAcademicLevel();
                } else {
                    content += ";;";
                }
                content += "\n";
            }

            data = Optional.of(content);
        } else {
            data = Optional.empty();
        }

        return ResponseUtil.wrapOrNotFound(data);
    }
    
    @GetMapping("/students/valid/{activityId}")
    public List<Student> getValidStudents(@PathVariable Long activityId) {
        log.debug("REST request to get valid Students who are not yet subscribed to this Activity{}");
        List<Student> students = studentRepository.findAll();
        
        Optional<Activity> opt = activityRepository.findById(activityId);
        if (opt.isEmpty()) {
        	throw new BadRequestAlertException("No activity with this Id", ENTITY_NAME, "notfound");
        }
        Activity activity = opt.get();
        
        LocalDate startDate;
    	LocalDate date = LocalDate.of(2021, 12, 18);
    	if (activity.getDate().compareTo(date) < 0) {
    		startDate = LocalDate.of(2021, 9, 3);
    	} else {
    		startDate = LocalDate.of(2022, 1, 6);
    	}
        
        List<Student> validStudents = students.stream()
        		.filter(student -> isValid(student, activity, startDate))
        		.collect(Collectors.toList());
        		
        return validStudents;
    }
    
    private boolean isValid(Student student, Activity activity, LocalDate startDate) {
    	log.debug("student to compare: {}", student);
    	log.debug("activity to compare: {}", activity);
    	boolean hasPaid = semesterInscriptionRepository.findAll().stream()
    			.filter(sem -> Objects.nonNull(sem.getStudent()) && Objects.nonNull(sem.getSemester()) && Objects.nonNull(sem.getSemester().getStartDate()))
    			.filter(sem -> sem.getStudent().getId().equals(student.getId()))
    			.filter(sem -> sem.getSemester().getStartDate().equals(startDate))
    			.anyMatch(sem -> sem.isPaid());
    	boolean isAlreadySubscribed = studentActivityRepository.findAll().stream()
    			.filter(stA -> Objects.nonNull(stA.getStudent()) && Objects.nonNull(stA.getActivity()))
    			.anyMatch(stA -> stA.getActivity().getId().equals(activity.getId()) && stA.getStudent().getId().equals(student.getId()));
    	return hasPaid && !isAlreadySubscribed;
    }
}
