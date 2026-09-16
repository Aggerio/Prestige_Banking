package com.prestige.transfer.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.UUID;
@Component
public class TraceIdFilter extends OncePerRequestFilter {
    @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String traceId=request.getHeader("X-Correlation-Id"); if (traceId==null || traceId.isBlank()) traceId=UUID.randomUUID().toString();
        try { MDC.put("traceId", traceId); response.setHeader("X-Correlation-Id", traceId); chain.doFilter(request,response); } finally { MDC.remove("traceId"); }
    }
}
