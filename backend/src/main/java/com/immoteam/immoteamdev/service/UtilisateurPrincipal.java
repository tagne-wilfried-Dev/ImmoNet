package com.immoteam.immoteamdev.service;

import java.util.Collection;
import java.util.Collections;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.immoteam.immoteamdev.entity.Utilisateur;

public class UtilisateurPrincipal implements UserDetails{

    Utilisateur utilisateur;
    public UtilisateurPrincipal(Utilisateur utilisateur){
        this.utilisateur = utilisateur;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // TODO Auto-generated method stub
        return Collections.singleton(new SimpleGrantedAuthority("CLIENT"));
    }

    @Override
    public  String getPassword() {
        // TODO Auto-generated method stub
        return utilisateur.getMotDePasseHash();
    }

    @Override
    public String getUsername() {
        // TODO Auto-generated method stub
        return utilisateur.getEmail();
    }
    
}
