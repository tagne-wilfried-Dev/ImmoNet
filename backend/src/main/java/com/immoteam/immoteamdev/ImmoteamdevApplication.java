package com.immoteam.immoteamdev;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Pour les tâches planifiées (archivage annonces expirées, etc
public class ImmoteamdevApplication {

	public static void main(String[] args) {
		SpringApplication.run(ImmoteamdevApplication.class, args);
	}

}
