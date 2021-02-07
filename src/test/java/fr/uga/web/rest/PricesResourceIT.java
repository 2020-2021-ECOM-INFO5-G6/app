package fr.uga.web.rest;

import fr.uga.EcomApp;
import fr.uga.domain.Prices;
import fr.uga.repository.PricesRepository;

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

/**
 * Integration tests for the {@link PricesResource} REST controller.
 */
@SpringBootTest(classes = EcomApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class PricesResourceIT {

    private static final Integer DEFAULT_NOTED = 1;
    private static final Integer UPDATED_NOTED = 2;

    private static final Integer DEFAULT_NON_NOTED = 1;
    private static final Integer UPDATED_NON_NOTED = 2;

    @Autowired
    private PricesRepository pricesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPricesMockMvc;

    private Prices prices;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prices createEntity(EntityManager em) {
        Prices prices = new Prices()
            .noted(DEFAULT_NOTED)
            .nonNoted(DEFAULT_NON_NOTED);
        return prices;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Prices createUpdatedEntity(EntityManager em) {
        Prices prices = new Prices()
            .noted(UPDATED_NOTED)
            .nonNoted(UPDATED_NON_NOTED);
        return prices;
    }

    @BeforeEach
    public void initTest() {
        prices = createEntity(em);
    }

    @Test
    @Transactional
    public void createPrices() throws Exception {
        int databaseSizeBeforeCreate = pricesRepository.findAll().size();
        // Create the Prices
        restPricesMockMvc.perform(post("/api/prices")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(prices)))
            .andExpect(status().isCreated());

        // Validate the Prices in the database
        List<Prices> pricesList = pricesRepository.findAll();
        assertThat(pricesList).hasSize(databaseSizeBeforeCreate + 1);
        Prices testPrices = pricesList.get(pricesList.size() - 1);
        assertThat(testPrices.getNoted()).isEqualTo(DEFAULT_NOTED);
        assertThat(testPrices.getNonNoted()).isEqualTo(DEFAULT_NON_NOTED);
    }

    @Test
    @Transactional
    public void createPricesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = pricesRepository.findAll().size();

        // Create the Prices with an existing ID
        prices.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPricesMockMvc.perform(post("/api/prices")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(prices)))
            .andExpect(status().isBadRequest());

        // Validate the Prices in the database
        List<Prices> pricesList = pricesRepository.findAll();
        assertThat(pricesList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNotedIsRequired() throws Exception {
        int databaseSizeBeforeTest = pricesRepository.findAll().size();
        // set the field null
        prices.setNoted(null);

        // Create the Prices, which fails.


        restPricesMockMvc.perform(post("/api/prices")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(prices)))
            .andExpect(status().isBadRequest());

        List<Prices> pricesList = pricesRepository.findAll();
        assertThat(pricesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkNonNotedIsRequired() throws Exception {
        int databaseSizeBeforeTest = pricesRepository.findAll().size();
        // set the field null
        prices.setNonNoted(null);

        // Create the Prices, which fails.


        restPricesMockMvc.perform(post("/api/prices")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(prices)))
            .andExpect(status().isBadRequest());

        List<Prices> pricesList = pricesRepository.findAll();
        assertThat(pricesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPrices() throws Exception {
        // Initialize the database
        pricesRepository.saveAndFlush(prices);

        // Get all the pricesList
        restPricesMockMvc.perform(get("/api/prices?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(prices.getId().intValue())))
            .andExpect(jsonPath("$.[*].noted").value(hasItem(DEFAULT_NOTED)))
            .andExpect(jsonPath("$.[*].nonNoted").value(hasItem(DEFAULT_NON_NOTED)));
    }
    
    @Test
    @Transactional
    public void getPrices() throws Exception {
        // Initialize the database
        pricesRepository.saveAndFlush(prices);

        // Get the prices
        restPricesMockMvc.perform(get("/api/prices/{id}", prices.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(prices.getId().intValue()))
            .andExpect(jsonPath("$.noted").value(DEFAULT_NOTED))
            .andExpect(jsonPath("$.nonNoted").value(DEFAULT_NON_NOTED));
    }
    @Test
    @Transactional
    public void getNonExistingPrices() throws Exception {
        // Get the prices
        restPricesMockMvc.perform(get("/api/prices/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePrices() throws Exception {
        // Initialize the database
        pricesRepository.saveAndFlush(prices);

        int databaseSizeBeforeUpdate = pricesRepository.findAll().size();

        // Update the prices
        Prices updatedPrices = pricesRepository.findById(prices.getId()).get();
        // Disconnect from session so that the updates on updatedPrices are not directly saved in db
        em.detach(updatedPrices);
        updatedPrices
            .noted(UPDATED_NOTED)
            .nonNoted(UPDATED_NON_NOTED);

        restPricesMockMvc.perform(put("/api/prices")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedPrices)))
            .andExpect(status().isOk());

        // Validate the Prices in the database
        List<Prices> pricesList = pricesRepository.findAll();
        assertThat(pricesList).hasSize(databaseSizeBeforeUpdate);
        Prices testPrices = pricesList.get(pricesList.size() - 1);
        assertThat(testPrices.getNoted()).isEqualTo(UPDATED_NOTED);
        assertThat(testPrices.getNonNoted()).isEqualTo(UPDATED_NON_NOTED);
    }

    @Test
    @Transactional
    public void updateNonExistingPrices() throws Exception {
        int databaseSizeBeforeUpdate = pricesRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPricesMockMvc.perform(put("/api/prices")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(prices)))
            .andExpect(status().isBadRequest());

        // Validate the Prices in the database
        List<Prices> pricesList = pricesRepository.findAll();
        assertThat(pricesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deletePrices() throws Exception {
        // Initialize the database
        pricesRepository.saveAndFlush(prices);

        int databaseSizeBeforeDelete = pricesRepository.findAll().size();

        // Delete the prices
        restPricesMockMvc.perform(delete("/api/prices/{id}", prices.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Prices> pricesList = pricesRepository.findAll();
        assertThat(pricesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
