package fr.uga.web.rest;

import fr.uga.domain.Instructor;
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

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link fr.uga.domain.Instructor}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class InstructorResource {

    private final Logger log = LoggerFactory.getLogger(InstructorResource.class);

    private static final String ENTITY_NAME = "instructor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InstructorRepository instructorRepository;

    public InstructorResource(InstructorRepository instructorRepository) {
        this.instructorRepository = instructorRepository;
    }

    /**
     * {@code POST  /instructors} : Create a new instructor.
     *
     * @param instructor the instructor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new instructor, or with status {@code 400 (Bad Request)} if the instructor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/instructors")
    public ResponseEntity<Instructor> createInstructor(@RequestBody Instructor instructor) throws URISyntaxException {
        log.debug("REST request to save Instructor : {}", instructor);
        if (instructor.getId() != null) {
            throw new BadRequestAlertException("A new instructor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Instructor result = instructorRepository.save(instructor);
        return ResponseEntity.created(new URI("/api/instructors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /instructors} : Updates an existing instructor.
     *
     * @param instructor the instructor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated instructor,
     * or with status {@code 400 (Bad Request)} if the instructor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the instructor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/instructors")
    public ResponseEntity<Instructor> updateInstructor(@RequestBody Instructor instructor) throws URISyntaxException {
        log.debug("REST request to update Instructor : {}", instructor);
        if (instructor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Instructor result = instructorRepository.save(instructor);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, instructor.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /instructors} : get all the instructors.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of instructors in body.
     */
    @GetMapping("/instructors")
    public List<Instructor> getAllInstructors(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Instructors");
        return instructorRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /instructors/:id} : get the "id" instructor.
     *
     * @param id the id of the instructor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the instructor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/instructors/{id}")
    public ResponseEntity<Instructor> getInstructor(@PathVariable Long id) {
        log.debug("REST request to get Instructor : {}", id);
        Optional<Instructor> instructor = instructorRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(instructor);
    }

    /**
     * {@code DELETE  /instructors/:id} : delete the "id" instructor.
     *
     * @param id the id of the instructor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/instructors/{id}")
    public ResponseEntity<Void> deleteInstructor(@PathVariable Long id) {
        log.debug("REST request to delete Instructor : {}", id);
        instructorRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    //NOT OUT-OF-THE-BOX
    
    /**
     * {@code GET  /instructors/nestedinstructor/:userid} : get the "id" instructor.
     *
     * @param userid the id of the internalUser nested to the instructor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the instructor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/instructors/nestedinstructor/{userid}")
    public ResponseEntity<Instructor> getNestedInstructor(@PathVariable Long userid) {
        log.debug("REST request to get Instructor : {}", userid);
        Optional<Instructor> instructor = instructorRepository.findAll().stream()
        		.filter(s -> Objects.nonNull(s.getInternalUser()))
        		.filter(sbis -> sbis.getInternalUser().getId().equals(userid))
        		.findAny();
        return ResponseUtil.wrapOrNotFound(instructor);
    }
}
