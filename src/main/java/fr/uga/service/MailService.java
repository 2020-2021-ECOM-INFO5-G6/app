package fr.uga.service;

import fr.uga.domain.User;
import fr.uga.domain.SemesterInscription;
import fr.uga.domain.Student;
import fr.uga.repository.SemesterInscriptionRepository;
import fr.uga.repository.StudentRepository;

import io.github.jhipster.config.JHipsterProperties;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Locale;

import javax.inject.Inject;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Objects;



/**
 * Service for sending emails.
 * <p>
 * We use the {@link Async} annotation to send emails asynchronously.
 */
@Service
public class MailService {

    private final Logger log = LoggerFactory.getLogger(MailService.class);

    private static final String USER = "user";

    private static final String STUDENT = "student";

    private static final String BASE_URL = "baseUrl";
    
    private static final String EMAILKEY = "email.activation.title";
    
    private static final String S1 = "semester.one";
    
    private static final String S2 = "semester.two";

    private final JHipsterProperties jHipsterProperties;

    private final JavaMailSender javaMailSender;

    private final MessageSource messageSource;

    private final SpringTemplateEngine templateEngine;
    
    @Inject
    private final StudentRepository studentRepository;
    
    @Inject
    private final SemesterInscriptionRepository semesterInscriptionRepository;


    public MailService(JHipsterProperties jHipsterProperties, JavaMailSender javaMailSender,
            MessageSource messageSource, SpringTemplateEngine templateEngine, StudentRepository studentRepository, SemesterInscriptionRepository semesterInscriptionRepository) {

        this.jHipsterProperties = jHipsterProperties;
        this.javaMailSender = javaMailSender;
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
        this.studentRepository= studentRepository;
        this.semesterInscriptionRepository = semesterInscriptionRepository;
    }

    @Async
    public void sendEmail(String to, String subject, String content, boolean isMultipart, boolean isHtml) {
        log.debug("Send email[multipart '{}' and html '{}'] to '{}' with subject '{}' and content={}",
            isMultipart, isHtml, to, subject, content);

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage, isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setFrom(jHipsterProperties.getMail().getFrom());
            message.setSubject(subject);
            message.setText(content, isHtml);
            javaMailSender.send(mimeMessage);
            log.debug("Sent email to User '{}'", to);
        }  catch (MailException | MessagingException e) {
            log.warn("Email could not be sent to user '{}'", to, e);
        }
    }

    @Async
    public void sendEmailFromTemplate(User user, String templateName, String titleKey) {
        if (user.getEmail() == null) {
            log.debug("Email doesn't exist for user '{}'", user.getLogin());
            return;
        }
        Locale locale = Locale.forLanguageTag(user.getLangKey());
        Context context = new Context(locale);
        context.setVariable(USER, user);
        context.setVariable(BASE_URL, jHipsterProperties.getMail().getBaseUrl());
        
        Student student = getStudentMail(user.getId());
        context.setVariable(STUDENT,student);
        if(templateName.equals("mail/semesterInscriptionEmail") && Objects.nonNull(student)) {
        	Optional<SemesterInscription> s1 = student.getSemesterInscriptions().stream()
        			.filter(sem -> sem.getSemester().getStartDate().equals(LocalDate.of(2021, 9, 3)) && sem.getSemester().getEndDate().equals(LocalDate.of(2021, 12, 18)))
        			.findAny();
        	
        	Optional<SemesterInscription> s2 = student.getSemesterInscriptions().stream()
        			.filter(sem -> sem.getSemester().getStartDate().equals(LocalDate.of(2022, 1, 6)) && sem.getSemester().getEndDate().equals(LocalDate.of(2022, 6, 13)))
        			.findAny();
        	if(s1.isPresent()) {
        		context.setVariable(S1, s1.get());
        	}
        	if(s2.isPresent()) {
        		context.setVariable(S2, s2.get());
        	}
        }

        String content = templateEngine.process(templateName, context);
        String subject = messageSource.getMessage(titleKey, null, locale);

        sendEmail(user.getEmail(), subject, content, false, true);
    }

    @Async
    public void sendActivationEmail(User user) {
        log.debug("Sending activation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, "mail/activationEmail", EMAILKEY);
    }
    
    @Async
    public void sendActivationEmailTest(User user) {
        log.debug("Sending activation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, "mail/testEmail", EMAILKEY);
    }

    @Async
    public void sendCreationEmail(User user) {
        log.debug("Sending creation email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, "mail/creationEmail", EMAILKEY);
    }

    @Async
    public void sendPasswordResetMail(User user) {
        log.debug("Sending password reset email to '{}'", user.getEmail());
        sendEmailFromTemplate(user, "mail/passwordResetEmail", "email.reset.title");
    }
    
    @Async
    public void sendSemesterInscriptionEmail(User user) {
    	log.debug("Sending semester inscription email to '{}'", user.getEmail());
    	sendEmailFromTemplate(user, "mail/semesterInscriptionEmail", "email.semester.title");
    	
    }

    public Student getStudentMail(Long userid){
        Optional<Student> student = studentRepository.findAll().stream()
    		.filter(s -> Objects.nonNull(s.getInternalUser()))
    		.filter(sbis -> sbis.getInternalUser().getId().equals(userid))
            .findAny();
        if(student.isPresent()) {
        	Student st = student.get();
        	Set<SemesterInscription> siSet = semesterInscriptionRepository.findAll().stream()
        			.filter(si -> Objects.nonNull(si.getStudent()))
        			.filter(si -> si.getStudent().getId() == st.getId())
        			.collect(Collectors.toSet());
        	st.semesterInscriptions(siSet);
            return st;
        } else{
        	log.error("Student null");
        	return null;
        }
    }
}
