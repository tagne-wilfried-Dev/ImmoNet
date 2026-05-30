package com.immoteam.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

// @ManyToOne -> Bien
// @ManyToOne -> Utilisateur (client)
// @OneToOne(mappedBy = "reservation") -> Contrat
// @OneToMany -> List<Notation>
public class Reservation {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	typeReservation  
	dateDebut  
	dateFin  
	montantTotal  
	devise  
	statut  
	motifRefus   
	stripePaymentIntentId  
	stripePaymentStatus   
	messageClient  
	dateConfirmation  
	dateAnnulation   
	LocalDateTime updatedAt   
}