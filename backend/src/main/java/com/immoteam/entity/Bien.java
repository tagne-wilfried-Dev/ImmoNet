package com.immoteam.entity;

	@ManyToOne -> Utilisateur (proprietaire)
	@OneToMany -> List<PhotoBien>
	@OneToMany -> List<EquipementBien>
	@OneToMany -> List<Disponibilite>
	@OneToMany -> List<Reservation>
	@OneToMany -> List<OffreAchat>
	@OneToMany -> List<DemandeVisite>
	@OneToMany -> List<Favori>
	@OneToMany -> List<Signalement>
public class Bien {

	id
	titre
	description
	typeOperation
	typeBien
	adresse
	ville
	quartier
	pays
	latitude
	longitude
	periodeLocation
	prix
	// garantie payee par le locataire
	caution
	chargesIncluses
	prixNegoceable
	surface
	nbPieces
	nbChambres
	// nb de salles de bain
	nbSdb
	etage
	statut
	datePublication
	dateExpiration
	nbVues
	nbFavoris
	estBoost
	updatedAt

	public boolean estPublie() {
	    return StatutAnnonce.PUBLIE.equals(this.statut);
	}

	public boolean estEnLocation() {
	    return StatutAnnonce.EN_LOCATION.equals(this.statut);
	}

	public boolean estVendu() {
	    return StatutAnnonce.VENDU.equals(this.statut);
	}
}