package fr.uga.web.rest;

import fr.uga.domain.Activity;
import fr.uga.domain.Instructor;
import fr.uga.domain.Student;
import fr.uga.domain.StudentActivity;
import fr.uga.domain.User;
import fr.uga.domain.Material;
import fr.uga.repository.ActivityRepository;
import fr.uga.repository.InstructorRepository;
import fr.uga.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Blob;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Iterator;
import java.util.Set;

/**
 * REST controller for managing {@link fr.uga.domain.Activity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ActivityResource {

    private final Logger log = LoggerFactory.getLogger(ActivityResource.class);

    private static final String ENTITY_NAME = "activity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ActivityRepository activityRepository;
    
    private final InstructorRepository instructorRepository;

    public ActivityResource(ActivityRepository activityRepository, InstructorRepository instructorRepository) {
        this.activityRepository = activityRepository;
        this.instructorRepository = instructorRepository;
    }

    /**
     * {@code POST  /activities} : Create a new activity.
     *
     * @param activity the activity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new activity, or with status {@code 400 (Bad Request)} if
     *         the activity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/activities")
    public ResponseEntity<Activity> createActivity(@Valid @RequestBody Activity activity) throws URISyntaxException {
        log.debug("REST request to save Activity : {}", activity);
        if (activity.getId() != null) {
            throw new BadRequestAlertException("A new activity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Activity result = activityRepository.save(activity);
        return ResponseEntity
                .created(new URI("/api/activities/" + result.getId())).headers(HeaderUtil
                        .createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT  /activities} : Updates an existing activity.
     *
     * @param activity the activity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated activity, or with status {@code 400 (Bad Request)} if the
     *         activity is not valid, or with status
     *         {@code 500 (Internal Server Error)} if the activity couldn't be
     *         updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/activities")
    public ResponseEntity<Activity> updateActivity(@Valid @RequestBody Activity activity) throws URISyntaxException {
        log.debug("REST request to update Activity : {}", activity);
        if (activity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Activity result = activityRepository.save(activity);
        return ResponseEntity.ok().headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, activity.getId().toString()))
                .body(result);
    }

    /**
     * {@code GET  /activities} : get all the activities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of activities in body.
     */
    @GetMapping("/activities")
    public List<Activity> getAllActivities() {
        log.debug("REST request to get all Activities");
        return activityRepository.findAll();
    }

    /**
     * {@code GET  /activities/:id} : get the "id" activity.
     *
     * @param id the id of the activity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the activity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/activities/{id}")
    public ResponseEntity<Activity> getActivity(@PathVariable Long id) {
        log.debug("REST request to get Activity : {}", id);
        Optional<Activity> activity = activityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(activity);
    }

    /**
     * {@code DELETE  /activities/:id} : delete the "id" activity.
     *
     * @param id the id of the activity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/activities/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        log.debug("REST request to delete Activity : {}", id);
        activityRepository.deleteById(id);
        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    @GetMapping("/activities/{id}/$content")
    public ResponseEntity<String> getActivityContent(@PathVariable Long id) {
        log.debug("REST request to get Activity content : {}", id);
        Optional<Activity> activity = activityRepository.findById(id);
        Optional<String> data;

        if (activity.isPresent()) {
            String content = "";

            Iterator<StudentActivity> iter = activity.get().getStudentActivities().iterator();
            while (iter.hasNext()) {
                Student student = iter.next().getStudent();
                Set<Material> materials = student.getMaterials();
                User user = student.getInternalUser();
                if (user != null) {
                    content += user.getFirstName() 
                    + ";" + user.getLastName();
                } else {
                    content += ";";
                }
                content += ";" + student.getSportLevel()
                    + ";" + student.getMeetingPlace();
                Iterator<Material> iterMat = materials.iterator();
                while (iterMat.hasNext()) {
                    Material material = iterMat.next();
                    content += ";" + material.getBoard().getName()
                        + ";" + material.getSail().getName()
                        + ";" + material.getTracksuit().getName();
                }
                content += "\n";
            }

            data = Optional.of(content);
        } else {
            data = Optional.empty();
        }

        return ResponseUtil.wrapOrNotFound(data);
    }
    
    
    // NOT OUT-OF-THE-BOX
    public static class RequestWrapper {
    	
    	public RequestWrapper () {
    		
    	}
    	
    	Activity activity;
    	Set<Instructor> managers;
    	Set<Instructor> monitors;
    	
    	public Activity getActivity() {
    		return activity;
    	};
    	
    	public Set<Instructor> getManagers(){
    		return managers;
    	}
    	
    	public Set<Instructor> getMonitors(){
    		return monitors;
    	}
    	
    }
    
    /**
     * {@code POST  /activities/:monitors/:managers} : Create a new activity with corresponding editing and participating instructors.
     *
     * @param activity the activity to create.
     * @param monitors the list of instructors who participate to the activity
     * @param managers the list of instructors who can edit the activity
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new activity, or with status {@code 400 (Bad Request)} if the activity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @RequestMapping(path = "/activities/withedi", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity<Activity> createActivityWithCorrespondingInstructors( 
    		@RequestBody RequestWrapper requestWrapper) throws URISyntaxException {
    	
    	Activity activity = requestWrapper.getActivity();
    	
        log.debug("REST request to save Activity : {}", activity);
        if (activity.getId() != null) {
            throw new BadRequestAlertException("A new activity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        activityRepository.save(activity);
        
        Set<Instructor> monitors = requestWrapper.getMonitors();
        Set<Instructor> managers = requestWrapper.getManagers();
        Set<Instructor> merged = new HashSet<Instructor>();
        
        //Workaround to avoid duplicates
        merged.addAll(monitors);
        merged.removeAll(managers);
        merged.addAll(managers);
        
        merged.stream().forEach(instructor -> {
        	boolean changed = false;
        	if (managers.contains(instructor)) {
        		activity.addManagers(instructor);
        		changed = true;
        	}
        	if (monitors.contains(instructor)) {
        		activity.addMonitors(instructor);
        		changed = true;
        	}
        	if (changed) {
        		instructorRepository.save(instructor);
        	}
       	});
        
        Activity result = activityRepository.save(activity);
        
        return ResponseEntity.created(new URI("/api/activities/withedi" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    
}