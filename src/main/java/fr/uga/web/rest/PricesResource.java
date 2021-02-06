package fr.uga.web.rest;

import fr.uga.domain.Prices;
import fr.uga.repository.PricesRepository;
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
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link fr.uga.domain.Prices}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PricesResource {

    private final Logger log = LoggerFactory.getLogger(PricesResource.class);

    private static final String ENTITY_NAME = "prices";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PricesRepository pricesRepository;

    public PricesResource(PricesRepository pricesRepository) {
        this.pricesRepository = pricesRepository;
    }

    /**
     * {@code POST  /prices} : Create a new prices.
     *
     * @param prices the prices to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new prices, or with status {@code 400 (Bad Request)} if the prices has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/prices")
    public ResponseEntity<Prices> createPrices(@Valid @RequestBody Prices prices) throws URISyntaxException {
        log.debug("REST request to save Prices : {}", prices);
        if (prices.getId() != null) {
            throw new BadRequestAlertException("A new prices cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Prices result = pricesRepository.save(prices);
        return ResponseEntity.created(new URI("/api/prices/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /prices} : Updates an existing prices.
     *
     * @param prices the prices to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated prices,
     * or with status {@code 400 (Bad Request)} if the prices is not valid,
     * or with status {@code 500 (Internal Server Error)} if the prices couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/prices")
    public ResponseEntity<Prices> updatePrices(@Valid @RequestBody Prices prices) throws URISyntaxException {
        log.debug("REST request to update Prices : {}", prices);
        if (prices.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Prices result = pricesRepository.save(prices);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, prices.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /prices} : get all the prices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of prices in body.
     */
    @GetMapping("/prices")
    public List<Prices> getAllPrices() {
        log.debug("REST request to get all Prices");
        return pricesRepository.findAll();
    }

    /**
     * {@code GET  /prices/:id} : get the "id" prices.
     *
     * @param id the id of the prices to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the prices, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/prices/{id}")
    public ResponseEntity<Prices> getPrices(@PathVariable Long id) {
        log.debug("REST request to get Prices : {}", id);
        Optional<Prices> prices = pricesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(prices);
    }

    /**
     * {@code DELETE  /prices/:id} : delete the "id" prices.
     *
     * @param id the id of the prices to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/prices/{id}")
    public ResponseEntity<Void> deletePrices(@PathVariable Long id) {
        log.debug("REST request to delete Prices : {}", id);
        pricesRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
