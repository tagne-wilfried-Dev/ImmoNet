package com.immoteam.immoteamdev.controller;

import com.immoteam.immoteamdev.dto.ConversationResponse;
import com.immoteam.immoteamdev.dto.MessageRequest;
import com.immoteam.immoteamdev.dto.MessageResponse;
import com.immoteam.immoteamdev.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "Messages & Conversations", description = "Système de messagerie interne")
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/conversations")
    @Operation(summary = "Lister mes conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(Authentication authentication) {
        return ResponseEntity.ok(messageService.getConversations(authentication.getName()));
    }

    @GetMapping("/conversations/{id}")
    @Operation(summary = "Récupérer les messages d'une conversation")
    public ResponseEntity<List<MessageResponse>> getMessages(
            @PathVariable Long id, 
            Authentication authentication) {
        return ResponseEntity.ok(messageService.getMessages(id, authentication.getName()));
    }

    @PostMapping
    @Operation(summary = "Envoyer un message")
    public ResponseEntity<MessageResponse> envoyerMessage(
            @Valid @RequestBody MessageRequest request, 
            Authentication authentication) {
        return ResponseEntity.ok(messageService.envoyerMessage(request, authentication.getName()));
    }
}
