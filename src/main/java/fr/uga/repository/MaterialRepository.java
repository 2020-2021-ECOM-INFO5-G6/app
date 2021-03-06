package fr.uga.repository;

import fr.uga.domain.Material;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Material entity.
 */
@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    @Query(value = "select distinct material from Material material left join fetch material.students",
        countQuery = "select count(distinct material) from Material material")
    Page<Material> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct material from Material material left join fetch material.students")
    List<Material> findAllWithEagerRelationships();

    @Query("select material from Material material left join fetch material.students where material.id =:id")
    Optional<Material> findOneWithEagerRelationships(@Param("id") Long id);
}
