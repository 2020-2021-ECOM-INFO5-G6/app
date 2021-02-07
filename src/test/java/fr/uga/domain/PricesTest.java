package fr.uga.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import fr.uga.web.rest.TestUtil;

public class PricesTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Prices.class);
        Prices prices1 = new Prices();
        prices1.setId(1L);
        Prices prices2 = new Prices();
        prices2.setId(prices1.getId());
        assertThat(prices1).isEqualTo(prices2);
        prices2.setId(2L);
        assertThat(prices1).isNotEqualTo(prices2);
        prices1.setId(null);
        assertThat(prices1).isNotEqualTo(prices2);
    }
}
