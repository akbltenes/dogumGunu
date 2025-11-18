package com.dogumgunu.backend.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final String user1Username;
    private final String user1PasswordHash;
    private final String user2Username;
    private final String user2PasswordHash;

    public SecurityConfig(
            @Value("${app.security.user1.username}") String user1Username,
            @Value("${app.security.user1.password-hash}") String user1PasswordHash,
            @Value("${app.security.user2.username}") String user2Username,
            @Value("${app.security.user2.password-hash}") String user2PasswordHash) {
        this.user1Username = user1Username;
        this.user1PasswordHash = user1PasswordHash;
        this.user2Username = user2Username;
        this.user2PasswordHash = user2PasswordHash;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails userOne = User.withUsername(user1Username)
                .password(user1PasswordHash)
                .roles("USER")
                .build();

        UserDetails userTwo = User.withUsername(user2Username)
                .password(user2PasswordHash)
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(userOne, userTwo);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.permitAll())
                .logout(logout -> logout.permitAll());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
