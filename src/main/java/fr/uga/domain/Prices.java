package fr.uga.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;

/**
 * A Prices.
 */
@Entity
@Table(name = "prices")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Prices implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "noted", nullable = false)
    private Integer noted;

    @NotNull
    @Column(name = "non_noted", nullable = false)
    private Integer nonNoted;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNoted() {
        return noted;
    }

    public Prices noted(Integer noted) {
        this.noted = noted;
        return this;
    }

    public void setNoted(Integer noted) {
        this.noted = noted;
    }

    public Integer getNonNoted() {
        return nonNoted;
    }

    public Prices nonNoted(Integer nonNoted) {
        this.nonNoted = nonNoted;
        return this;
    }

    public void setNonNoted(Integer nonNoted) {
        this.nonNoted = nonNoted;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Prices)) {
            return false;
        }
        return id != null && id.equals(((Prices) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Prices{" +
            "id=" + getId() +
            ", noted=" + getNoted() +
            ", nonNoted=" + getNonNoted() +
            "}";
    }
}
