package com.immoteam.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {
            
        HttpSecurity httpSecurity = http.sessionManagement(management ->
             management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
             .authorizeHttpRequests((Authorize ->
                Authorize.requestMatchers("/api/**").authenticated()
                    .requestMatchers("/api/super-admin/**")
                    .hasRole("ADMIN")
                    .anyRequest().permitAll()
                )
                
             );

            return null;
        }

}
