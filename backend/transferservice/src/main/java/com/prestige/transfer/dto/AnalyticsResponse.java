package com.prestige.transfer.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

public record AnalyticsResponse(
        String accountNumber,
        List<WeeklyActivityPoint> weeklyActivity,
        List<MonthlyExpensePoint> monthlyExpenses,
        List<BalanceHistoryPoint> balanceHistory) {
    public record WeeklyActivityPoint(LocalDate date, BigDecimal deposits, BigDecimal withdrawals) { }
    public record MonthlyExpensePoint(YearMonth month, BigDecimal withdrawals) { }
    public record BalanceHistoryPoint(YearMonth month, BigDecimal closingBalance) { }
}
