package com.immoteam.immoteamdev.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.immoteam.immoteamdev.entity.enums.RoleUtilisateur;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    public String generateAccessToken(String email, RoleUtilisateur role) {
        return Jwts.builder()
                .subject(email)
                .claim("role", role.name())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), Jwts.SIG.HS512)// j'ai remplae
                                                                                   // SignatureAlgorithm.HS256 pour
                                                                                   // deprecation cause
                .compact();
    }

    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes()), Jwts.SIG.HS512)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes())).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractEmail(String token) {
        return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes())).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public RoleUtilisateur extractRole(String token) {
        String role = Jwts.parser().verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes())).build()
                .parseSignedClaims(token).getPayload().get("role", String.class);
        return RoleUtilisateur.valueOf(role);
    }

    public boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser().verifyWith(Keys.hmacShaKeyFor(jwtSecret.getBytes())).build()
                .parseSignedClaims(token).getPayload().getExpiration();
        return expiration.before(new Date());
    }
}
