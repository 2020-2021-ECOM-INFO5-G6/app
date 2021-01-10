package fr.uga.web.rest;

import fr.uga.EcomApp;
import fr.uga.domain.Instructor;
import fr.uga.domain.User;
import fr.uga.repository.InstructorRepository;
import fr.uga.repository.UserRepository;

import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link InstructorResource} REST controller.
 */
@SpringBootTest(classes = EcomApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class InstructorResourceIT {

    @Autowired
    private InstructorRepository instructorRepository;

    @Mock
    private InstructorRepository instructorRepositoryMock;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInstructorMockMvc;

    private Instructor instructor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Instructor createEntity(EntityManager em) {
        Instructor instructor = new Instructor();
        return instructor;
    }
    
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Instructor createUpdatedEntity(EntityManager em) {
        Instructor instructor = new Instructor();
        return instructor;
    }

    @BeforeEach
    public void initTest() {
        instructor = createEntity(em);
    }

    @Test
    @Transactional
    public void createInstructor() throws Exception {
        int databaseSizeBeforeCreate = instructorRepository.findAll().size();
        // Create the Instructor
        restInstructorMockMvc.perform(post("/api/instructors")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(instructor)))
            .andExpect(status().isCreated());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeCreate + 1);
        Instructor testInstructor = instructorList.get(instructorList.size() - 1);
    }

    @Test
    @Transactional
    public void createInstructorWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = instructorRepository.findAll().size();

        // Create the Instructor with an existing ID
        instructor.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restInstructorMockMvc.perform(post("/api/instructors")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(instructor)))
            .andExpect(status().isBadRequest());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllInstructors() throws Exception {
        // Initialize the database
    	instructorRepository.saveAndFlush(instructor);

        // Get all the instructorList
        restInstructorMockMvc.perform(get("/api/instructors?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(instructor.getId().intValue())));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllInstructorsWithEagerRelationshipsIsEnabled() throws Exception {
        when(instructorRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restInstructorMockMvc.perform(get("/api/instructors?eagerload=true"))
            .andExpect(status().isOk());

        verify(instructorRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllInstructorsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(instructorRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restInstructorMockMvc.perform(get("/api/instructors?eagerload=true"))
            .andExpect(status().isOk());

        verify(instructorRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getInstructor() throws Exception {
        // Initialize the database
    	instructorRepository.saveAndFlush(instructor);

        // Get the instructor
        restInstructorMockMvc.perform(get("/api/instructors/{id}", instructor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(instructor.getId().intValue()));
    }
    @Test
    @Transactional
    public void getNonExistingInstructor() throws Exception {
        // Get the instructor
        restInstructorMockMvc.perform(get("/api/instructors/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateInstructor() throws Exception {
        // Initialize the database
    	instructorRepository.saveAndFlush(instructor);

        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();

        // Update the instructor
        Instructor updatedInstructor = instructorRepository.findById(instructor.getId()).get();
        // Disconnect from session so that the updates on updatedInstructor are not directly saved in db
        em.detach(updatedInstructor);

        restInstructorMockMvc.perform(put("/api/instructors")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedInstructor)))
            .andExpect(status().isOk());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
        Instructor testInstructor = instructorList.get(instructorList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingInstructor() throws Exception {
        int databaseSizeBeforeUpdate = instructorRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstructorMockMvc.perform(put("/api/instructors")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(instructor)))
            .andExpect(status().isBadRequest());

        // Validate the Instructor in the database
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteInstructor() throws Exception {
        // Initialize the database
    	instructorRepository.saveAndFlush(instructor);

        int databaseSizeBeforeDelete = instructorRepository.findAll().size();

        // Delete the instructor
        restInstructorMockMvc.perform(delete("/api/instructors/{id}", instructor.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Instructor> instructorList = instructorRepository.findAll();
        assertThat(instructorList).hasSize(databaseSizeBeforeDelete - 1);
    }
    
    //NOT OUT-OF-THE-BOX TESTS
    
    @Test
    @Transactional
    public void getNestedInstructor() throws Exception {
    	User user = new User();
    	user.setLogin("testlogin");
    	user.setPassword(RandomStringUtils.random(60));
    	
        // Initialize the database
    	userRepository.saveAndFlush(user);
    	instructor.setInternalUser(user);
    	instructorRepository.saveAndFlush(instructor);

        // Get the instructor
        restInstructorMockMvc.perform(get("/api/instructors/nestedinstructor/{userid}", user.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.internalUser.id").value(user.getId().intValue()));
    }
    @Test
    @Transactional
    public void getNonExistingNestedInstructor() throws Exception {
        // Get the instructor
        restInstructorMockMvc.perform(get("/api/instructors/nestedinstructor/{userid}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    
}
