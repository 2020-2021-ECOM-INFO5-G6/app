package fr.uga.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import org.hibernate.cache.jcache.ConfigSettings;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import io.github.jhipster.config.cache.PrefixedKeyGenerator;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {
    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, fr.uga.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, fr.uga.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, fr.uga.domain.User.class.getName());
            createCache(cm, fr.uga.domain.Authority.class.getName());
            createCache(cm, fr.uga.domain.User.class.getName() + ".authorities");
            createCache(cm, fr.uga.domain.Student.class.getName());
            createCache(cm, fr.uga.domain.Student.class.getName() + ".semesterInscriptions");
            createCache(cm, fr.uga.domain.Student.class.getName() + ".studentActivities");
            createCache(cm, fr.uga.domain.Student.class.getName() + ".materials");
            createCache(cm, fr.uga.domain.Instructor.class.getName());
            createCache(cm, fr.uga.domain.Instructor.class.getName() + ".participateActivities");
            createCache(cm, fr.uga.domain.Instructor.class.getName() + ".editableActivities");
            createCache(cm, fr.uga.domain.Activity.class.getName());
            createCache(cm, fr.uga.domain.Activity.class.getName() + ".studentActivities");
            createCache(cm, fr.uga.domain.Activity.class.getName() + ".monitors");
            createCache(cm, fr.uga.domain.Activity.class.getName() + ".managers");
            createCache(cm, fr.uga.domain.StudentActivity.class.getName());
            createCache(cm, fr.uga.domain.Cursus.class.getName());
            createCache(cm, fr.uga.domain.SemesterInscription.class.getName());
            createCache(cm, fr.uga.domain.Semester.class.getName());
            createCache(cm, fr.uga.domain.Semester.class.getName() + ".semesterInscriptions");
            createCache(cm, fr.uga.domain.Material.class.getName());
            createCache(cm, fr.uga.domain.Material.class.getName() + ".students");
            createCache(cm, fr.uga.domain.Tracksuit.class.getName());
            createCache(cm, fr.uga.domain.Tracksuit.class.getName() + ".materials");
            createCache(cm, fr.uga.domain.Board.class.getName());
            createCache(cm, fr.uga.domain.Board.class.getName() + ".materials");
            createCache(cm, fr.uga.domain.Sail.class.getName());
            createCache(cm, fr.uga.domain.Sail.class.getName() + ".materials");
            createCache(cm, fr.uga.domain.Prices.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache == null) {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
