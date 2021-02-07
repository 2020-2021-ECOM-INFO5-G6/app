package fr.uga.web.rest;

import fr.uga.domain.Activity;
import fr.uga.domain.Student;
import fr.uga.domain.StudentActivity;
import fr.uga.repository.ActivityRepository;
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

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing {@link fr.uga.domain.StudentActivity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class StudentActivityResource {

    private final Logger log = LoggerFactory.getLogger(StudentActivityResource.class);

    private static final String ENTITY_NAME = "studentActivity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentActivityRepository studentActivityRepository;
    
    private final StudentRepository studentRepository;
    
    private final ActivityRepository activityRepository;

    public StudentActivityResource(StudentActivityRepository studentActivityRepository, StudentRepository studentRepository, ActivityRepository activityRepository) {
        this.studentActivityRepository = studentActivityRepository;
        this.activityRepository = activityRepository;
        this.studentRepository = studentRepository;
    }

    /**
     * {@code POST  /student-activities} : Create a new studentActivity.
     *
     * @param studentActivity the studentActivity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studentActivity, or with status {@code 400 (Bad Request)} if the studentActivity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/student-activities")
    public ResponseEntity<StudentActivity> createStudentActivity(@RequestBody StudentActivity studentActivity) throws URISyntaxException {
        log.debug("REST request to save StudentActivity : {}", studentActivity);
        if (studentActivity.getId() != null) {
            throw new BadRequestAlertException("A new studentActivity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        StudentActivity result = studentActivityRepository.save(studentActivity);
        return ResponseEntity.created(new URI("/api/student-activities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /student-activities} : Updates an existing studentActivity.
     *
     * @param studentActivity the studentActivity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentActivity,
     * or with status {@code 400 (Bad Request)} if the studentActivity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the studentActivity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/student-activities")
    public ResponseEntity<StudentActivity> updateStudentActivity(@RequestBody StudentActivity studentActivity) throws URISyntaxException {
        log.debug("REST request to update StudentActivity : {}", studentActivity);
        if (studentActivity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        StudentActivity result = studentActivityRepository.save(studentActivity);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentActivity.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /student-activities} : get all the studentActivities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studentActivities in body.
     */
    @GetMapping("/student-activities")
    public List<StudentActivity> getAllStudentActivities() {
        log.debug("REST request to get all StudentActivities");
        return studentActivityRepository.findAll();
    }

    /**
     * {@code GET  /student-activities/:id} : get the "id" studentActivity.
     *
     * @param id the id of the studentActivity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the studentActivity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/student-activities/{id}")
    public ResponseEntity<StudentActivity> getStudentActivity(@PathVariable Long id) {
        log.debug("REST request to get StudentActivity : {}", id);
        Optional<StudentActivity> studentActivity = studentActivityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(studentActivity);
    }

    /**
     * {@code DELETE  /student-activities/:id} : delete the "id" studentActivity.
     *
     * @param id the id of the studentActivity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/student-activities/{id}")
    public ResponseEntity<Void> deleteStudentActivity(@PathVariable Long id) {
        log.debug("REST request to delete StudentActivity : {}", id);
        studentActivityRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    //NOT OUT-OF-THE-BOX
    
    /**
     * {@code GET  /student-activities} : get the studentActivities for a defined student .
     *
     * @param id the id of the Student .
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studentActivities in body.
     */
    @GetMapping("/student-activities/fordefinedstudent/{id}")
    public List<StudentActivity> getStudentActivitiesForThisStudent(@PathVariable Long id) {
    	 	
        log.debug("REST request to get StudentActivities of a specific student");
        
        List<StudentActivity> activities = studentActivityRepository.findAll();
        
        List<StudentActivity> studentActivities = activities.stream()
        		.filter(act -> Objects.nonNull(act.getStudent()))
        		.filter(act -> act.getStudent().getId().equals(id))
        		.collect(Collectors.toList());
        
        
        return studentActivities;
    }
    
    
    public static class RequestWrapper {
    	
    	public RequestWrapper () {}
    	
    	long studentId;
    	long activityId;
    	String comment;
    	
    	public long getStudentId(){
    		return studentId;
    	}
    	
    	public long getActivityId() {
    		return activityId;
    	}
    	
    	public String getComment() {
    		return comment;
    	}
    }
    
    /**
     * {@code POST  /student-activities/subscribestudent} : Create a new studentActivity.
     *
     * @param RequestWrapper containing the Student to register and the Activity.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studentActivity, or with status {@code 400 (Bad Request)} if the studentActivity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/student-activities/subscribestudent")
    public ResponseEntity<StudentActivity> subscribeStudentToActivity(@RequestBody RequestWrapper requestWrapper) throws URISyntaxException {
    	
    	Optional<Student> student = studentRepository.findById(requestWrapper.getStudentId());

    	Optional<Activity> activity = activityRepository.findById(requestWrapper.getActivityId());
    	
    	if (activity.isEmpty() || student.isEmpty()) {
    		throw new BadRequestAlertException("Activity or Student cannot be null", ENTITY_NAME, "nullparameter");
      	}
    	
    	LocalDate startDate;
    	LocalDate date = LocalDate.of(2021, 12, 18);
    	if (activity.get().getDate().compareTo(date) < 0) {
    		startDate = LocalDate.of(2021, 9, 3);
    	} else {
    		startDate = LocalDate.of(2022, 1, 6);
    	}
    	
    	boolean hasPaidSemester = student.get().getSemesterInscriptions().stream()
    			.filter(sem -> Objects.nonNull(sem.getSemester()) && Objects.nonNull(sem.getSemester().getStartDate()))
    			.filter(sem -> sem.getSemester().getStartDate().equals(startDate))
    			.anyMatch(sem -> sem.isPaid());
    	
    	log.debug("stAs: {}", activity.get().getStudentActivities());
    	
    	List<StudentActivity> studentActivities = studentActivityRepository.findAll();
    	boolean isAlreadySubscribed = Objects.nonNull(studentActivities) && studentActivities.stream()
    			.filter(stA -> Objects.nonNull(stA.getStudent()) && Objects.nonNull(stA.getActivity()))
    			.anyMatch(stA -> stA.getStudent().getId().equals(student.get().getId()) && stA.getActivity().getId().equals(activity.get().getId()));
    	
    	if (!hasPaidSemester) {
    		throw new BadRequestAlertException("Student hasnt paid his semesterInscription yet, he can't register to activity", ENTITY_NAME, "notpaid");
    	}
    	
    	if (isAlreadySubscribed) {
    		throw new BadRequestAlertException("Student is already subscribed to this Activity", ENTITY_NAME, "alreadysubscribed");
      	}
    	
    	log.debug("REST request to save StudentActivity with corresponding Student & Activity IDs: {}", requestWrapper);
    	
    	StudentActivity studentActivity = new StudentActivity();
    	studentActivity.setActivity(activity.get());
    	studentActivity.setStudent(student.get());
    	
    	if(Objects.nonNull(requestWrapper.getComment())) {
    		studentActivity.setCommentToIntructor(requestWrapper.getComment());
    	}
    	
        StudentActivity result = studentActivityRepository.save(studentActivity);
        
        return ResponseEntity.created(new URI("/api/student-activities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    
}
