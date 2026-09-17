package com.prestige.authentication.repository;

import com.prestige.authentication.entity.AuthSession;

import java.util.Optional;
import java.time.LocalDateTime;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface AuthSessionRepository extends JpaRepository<AuthSession, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from AuthSession s where s.refreshTokenHash=:hash")
    Optional<AuthSession> findForRefresh(@Param("hash") String hash);

    @Modifying
    @Query("update AuthSession s set s.revokedAt=:revokedAt where s.customerId=:id and s.revokedAt is null")
    int revokeAll(@Param("id") Long id, @Param("revokedAt") LocalDateTime revokedAt);

    @Modifying
    @Query("update AuthSession s set s.revokedAt=:revokedAt where s.familyId=:family and s.revokedAt is null")
    int revokeFamily(@Param("family") String family, @Param("revokedAt") LocalDateTime revokedAt);
}
