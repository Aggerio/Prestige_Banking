package com.prestige.transfer.controller;

import com.prestige.transfer.domain.enums.TransferStatus;
import com.prestige.transfer.dto.*;
import com.prestige.transfer.service.*;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.jwt.Jwt;
import java.math.BigDecimal;
import java.time.Instant;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class TransferControllerTest {
    @Test void identicalReplayReturnsOk() {
        TransferApplicationService application=mock(TransferApplicationService.class);
        TransferController controller=new TransferController(application, mock(TransferQueryService.class));
        TransferResponse transfer=new TransferResponse(1L, "TRF-ABC", TransferStatus.COMPLETED, new BigDecimal("10.00"), Instant.now());
        when(application.execute(eq(101L), eq("idem-1"), any())).thenReturn(new TransferApplicationService.TransferExecution(transfer, false));
        Jwt jwt=Jwt.withTokenValue("token").header("alg", "none").claim("customer_id", 101).build();
        var result=controller.transfer(jwt, "idem-1", new TransferRequest("A", "B", "Customer", "IFSC", new BigDecimal("10.00"), "secret"));
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("TRF-ABC", result.getBody().referenceNumber());
    }
}
