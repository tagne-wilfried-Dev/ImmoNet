package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    List<Conversation> findByParticipant1IdOrParticipant2IdOrderByDernierMessageAtDesc(Long id1, Long id2);
    Optional<Conversation> findByBienIdAndParticipant1IdAndParticipant2Id(Long bienId, Long id1, Long id2);
}