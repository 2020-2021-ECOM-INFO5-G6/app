package fr.uga.repository;

import fr.uga.domain.Prices;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Prices entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PricesRepository extends JpaRepository<Prices, Long> {
}
