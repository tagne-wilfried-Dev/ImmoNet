package com.immoteam.immoteamdev.repository;

import com.immoteam.immoteamdev.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByConversationIdOrderByDateEnvoiAsc(Long conversationId);
    List<Message> findByConversationIdAndLuFalse(Long conversationId);
    long countByConversationIdAndDestinataireIdAndLuFalse(Long conversationId, Long destinataireId);
    Optional<Message> findTopByConversationIdOrderByDateEnvoiDesc(Long conversationId);
}