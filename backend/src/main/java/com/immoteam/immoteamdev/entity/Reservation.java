package com.immoteam.immoteamdev.entity;

import com.immoteam.immoteamdev.entity.enums.TypeReservation;
import com.immoteam.immoteamdev.entity.enums.StatutReservation;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservations")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "bien_id", nullable = false)
	private Bien bien;

	@ManyToOne
	@JoinColumn(name = "client_id", nullable = false)
	private Utilisateur client;

	@OneToOne(mappedBy = "reservation")
	private Contrat contrat;

	@OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<Notation> notations = new ArrayList<>();

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TypeReservation typeReservation;

	@NotNull
	@Column(nullable = false)
	private LocalDateTime dateDebut;

	@NotNull
	@Column(nullable = false)
	private LocalDateTime dateFin;

	@NotNull
	@Column(nullable = false)
	private BigDecimal montantTotal;

	@Column(nullable = false)
	private String devise;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private StatutReservation statut = StatutReservation.EN_ATTENTE;

	@Column
	private String motifRefus;

	@Column
	private String stripePaymentIntentId;

	@Column
	private String stripePaymentStatus;

	@Column(columnDefinition = "TEXT")
	private String messageClient;

	@Column
	private LocalDateTime dateConfirmation;

	@Column
	private LocalDateTime dateAnnulation;

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(nullable = false)
	private LocalDateTime updatedAt;
}