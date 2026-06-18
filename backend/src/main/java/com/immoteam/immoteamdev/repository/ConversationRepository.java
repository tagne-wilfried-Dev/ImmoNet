package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByParticipant1IdOrParticipant2IdOrderByDernierMessageAtDesc(Long id1, Long id2);
    Optional<Conversation> findByBienIdAndParticipant1IdAndParticipant2Id(Long bienId, Long id1, Long id2);

    // Recherche une conversation pour un bien entre deux participants, quel que soit leur ordre (p1/p2 ou p2/p1).
    @Query("""
            SELECT c FROM Conversation c
            WHERE c.bien.id = :bienId
              AND ((c.participant1.id = :userA AND c.participant2.id = :userB)
                OR (c.participant1.id = :userB AND c.participant2.id = :userA))
            """)
    Optional<Conversation> findConversationForBienBetween(Long bienId, Long userA, Long userB);
}