package fr.uga.web.rest;

import fr.uga.domain.Activity;
import fr.uga.domain.Instructor;
import fr.uga.domain.Semester;
import fr.uga.domain.SemesterInscription;
import fr.uga.domain.Student;
import fr.uga.repository.SemesterInscriptionRepository;
import fr.uga.repository.SemesterRepository;
import fr.uga.service.MailService;
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
import java.util.Set;

/**
 * REST controller for managing {@link fr.uga.domain.SemesterInscription}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SemesterInscriptionResource {

    private final Logger log = LoggerFactory.getLogger(SemesterInscriptionResource.class);

    private static final String ENTITY_NAME = "semesterInscription";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SemesterInscriptionRepository semesterInscriptionRepository;
    
    private final SemesterRepository semesterRepository;
    
    private final MailService mailService;

    public SemesterInscriptionResource(SemesterInscriptionRepository semesterInscriptionRepository, SemesterRepository semesterRepository, MailService mailService) {
        this.semesterInscriptionRepository = semesterInscriptionRepository;
        this.semesterRepository = semesterRepository;
        this.mailService = mailService;
    }

    /**
     * {@code POST  /semester-inscriptions} : Create a new semesterInscription.
     *
     * @param semesterInscription the semesterInscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new semesterInscription, or with status {@code 400 (Bad Request)} if the semesterInscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/semester-inscriptions")
    public ResponseEntity<SemesterInscription> createSemesterInscription(@Valid @RequestBody SemesterInscription semesterInscription) throws URISyntaxException {
        log.debug("REST request to save SemesterInscription : {}", semesterInscription);
        if (semesterInscription.getId() != null) {
            throw new BadRequestAlertException("A new semesterInscription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SemesterInscription result = semesterInscriptionRepository.save(semesterInscription);
        return ResponseEntity.created(new URI("/api/semester-inscriptions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /semester-inscriptions} : Updates an existing semesterInscription.
     *
     * @param semesterInscription the semesterInscription to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semesterInscription,
     * or with status {@code 400 (Bad Request)} if the semesterInscription is not valid,
     * or with status {@code 500 (Internal Server Error)} if the semesterInscription couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/semester-inscriptions")
    public ResponseEntity<SemesterInscription> updateSemesterInscription(@Valid @RequestBody SemesterInscription semesterInscription) throws URISyntaxException {
        log.debug("REST request to update SemesterInscription : {}", semesterInscription);
        if (semesterInscription.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SemesterInscription result = semesterInscriptionRepository.save(semesterInscription);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semesterInscription.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /semester-inscriptions} : get all the semesterInscriptions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of semesterInscriptions in body.
     */
    @GetMapping("/semester-inscriptions")
    public List<SemesterInscription> getAllSemesterInscriptions() {
        log.debug("REST request to get all SemesterInscriptions");
        return semesterInscriptionRepository.findAll();
    }

    /**
     * {@code GET  /semester-inscriptions/:id} : get the "id" semesterInscription.
     *
     * @param id the id of the semesterInscription to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the semesterInscription, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/semester-inscriptions/{id}")
    public ResponseEntity<SemesterInscription> getSemesterInscription(@PathVariable Long id) {
        log.debug("REST request to get SemesterInscription : {}", id);
        Optional<SemesterInscription> semesterInscription = semesterInscriptionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(semesterInscription);
    }

    /**
     * {@code DELETE  /semester-inscriptions/:id} : delete the "id" semesterInscription.
     *
     * @param id the id of the semesterInscription to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/semester-inscriptions/{id}")
    public ResponseEntity<Void> deleteSemesterInscription(@PathVariable Long id) {
        log.debug("REST request to delete SemesterInscription : {}", id);
        semesterInscriptionRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
    
    //NOT OUT-OF-THE-BOX
    
    public static class RequestWrapper {
    	
    	public RequestWrapper () {
    		
    	}
    	
    	SemesterInscription semesterInscription;
    	int semester;
    	
    	public int getSemester(){
    		return semester;
    	}
    	
    	public SemesterInscription getSemesterInscription() {
    		return semesterInscription;
    	}
    }
    
    /**
     * {@code POST  /semester-inscriptions} : Create a new semesterInscription.
     *
     * @param semesterInscription the semesterInscription to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new semesterInscription, or with status {@code 400 (Bad Request)} if the semesterInscription has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @RequestMapping(path = "/semester-inscriptions/withsemester", method = RequestMethod.POST, consumes = "application/json")
    public ResponseEntity<SemesterInscription> createSemesterInscriptionAndSemester( @RequestBody RequestWrapper requestWrapper) throws URISyntaxException {
    	
    	SemesterInscription semesterInscription = requestWrapper.getSemesterInscription();
    	
    	log.debug("REST request to save SemesterInscription : {}", requestWrapper);
        if (semesterInscription.getId() != null) {
            throw new BadRequestAlertException("A new semesterInscription cannot already have an ID", ENTITY_NAME, "idexists");
        }
        
        int semesternb = requestWrapper.getSemester();      
        
        if (Objects.isNull(semesterInscription.getSemester())) {
    		LocalDate startDate;
    		LocalDate endDate;
    		
    		switch(semesternb) {
    		case 1: 
    			startDate = LocalDate.of(2021, 9, 3);
    			endDate = LocalDate.of(2021, 12, 18);
    			break;
    		case 2:
    			startDate = LocalDate.of(2022, 1, 6);
    			endDate = LocalDate.of(2022, 6, 13);
    			break;
    		default:
    			log.error("This new SemesterInscription hasn't any nested Semester: {}", semesterInscription);
        		throw new BadRequestAlertException("This new SemesterInscription hasn't any nested Semester: {}", ENTITY_NAME, "nonested");
    		}
    		
    		Optional<Semester> semester = semesterRepository.findAll().stream()
    				.filter(sem -> sem.getStartDate().equals(startDate) && sem.getEndDate().equals(endDate))
    				.findAny();
    		
    		
    		Semester semesterToAssign;
    		if(semester.isEmpty()) {
    			semesterToAssign = new Semester();
    			semesterToAssign.setStartDate(startDate);
    			semesterToAssign.setEndDate(endDate);
    			semesterRepository.save(semesterToAssign);
    		} else { 
    			semesterToAssign = semester.get();
    		}
    		semesterInscription.setSemester(semesterToAssign);
        }
        
        SemesterInscription result = semesterInscriptionRepository.save(semesterInscription);

        log.debug("student : {}", result.getStudent());
        mailService.sendSemesterInscriptionEmail(result.getStudent().getInternalUser(), semesternb);
        
        return ResponseEntity.created(new URI("/api/semester-inscriptions/withsemester/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    
}
