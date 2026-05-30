package com.immoteam.repository;

import com.immoteam.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByUtilisateur1IdOrUtilisateur2IdOrderByDateDernierMessageDesc(Long id1, Long id2);
    Optional<Conversation> findByBienIdAndUtilisateur1IdAndUtilisateur2Id(Long bienId, Long id1, Long id2);
}