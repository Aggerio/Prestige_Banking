package com.prestige.authentication.config;

import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;

import java.io.InputStream;
import java.security.KeyStore;
import java.util.List;

import org.springframework.context.annotation.*;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class AuthConfig {

    @Bean
    RSAKey rsaKey(JwtProperties p, ResourceLoader loader) throws Exception {
        KeyStore ks = KeyStore.getInstance("PKCS12");
        try (InputStream stream = loader.getResource(p.keystoreLocation()).getInputStream()) {
            ks.load(stream, p.keystorePassword().toCharArray());
        }
        RSAPrivateKey privateKey = (RSAPrivateKey) ks.getKey(p.keyAlias(), p.keyPassword().toCharArray());
        RSAPublicKey publicKey = (RSAPublicKey) ks.getCertificate(p.keyAlias()).getPublicKey();
        return new RSAKey.Builder(publicKey).privateKey(privateKey).keyID(p.keyId()).build();
    }

    @Bean
    JwtEncoder jwtEncoder(RSAKey key) {
        JWKSource<SecurityContext> source = (selector, context) -> selector.select(new JWKSet(key));
        return new NimbusJwtEncoder(source);
    }

    @Bean
    JwtDecoder jwtDecoder(RSAKey key, JwtProperties p) throws Exception {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withPublicKey(key.toRSAPublicKey()).build();
        OAuth2TokenValidator<Jwt> issuer = JwtValidators.createDefaultWithIssuer(p.issuer());
        decoder.setJwtValidator(jwt -> {
            OAuth2TokenValidatorResult result = issuer.validate(jwt);
            return result.hasErrors() ? result : jwt.getAudience().contains(p.audience())
                    ? OAuth2TokenValidatorResult.success()
                    : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "Invalid audience", null));
        });
        return decoder;
    }

    @Bean
    SecurityFilterChain security(HttpSecurity http, JwtDecoder decoder) throws Exception {
        return http.csrf(csrf -> csrf.disable()).sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a.requestMatchers(HttpMethod.POST, "/api/v1/auth/login", "/api/v1/auth/refresh").permitAll()
                        .requestMatchers(HttpMethod.GET, "/.well-known/jwks.json").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o.jwt(j -> j.decoder(decoder))).build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
