import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) {}

    async getData(userId: number) {

        const pieData =
            (await this.prisma.$queryRaw<
                { name: string; value: number }[]
            >`
                SELECT 
                    c.name,
                    SUM(t.amount) AS value
                FROM "Transaction" t
                JOIN "Category" c ON c.id = t."categoryId"
                JOIN "BankAccount" b ON b.id = t."bankAccountId"
                WHERE 
                    b."userId" = ${userId}
                    AND t.type = 'EXPENSE'
                    AND DATE_TRUNC('month', t."transactionAt") = DATE_TRUNC('month', NOW())
                GROUP BY c.name;
            `) ?? [];

        const lineDataRaw =
            (await this.prisma.$queryRaw<
                { month: string; income: number; expense: number }[]
            >`
                SELECT 
                    TO_CHAR(t."transactionAt", 'Mon') AS month,
                    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) AS income,
                    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS expense
                FROM "Transaction" t
                JOIN "BankAccount" b ON b.id = t."bankAccountId"
                WHERE 
                    b."userId" = ${userId}
                    AND DATE_PART('year', t."transactionAt") = DATE_PART('year', NOW())
                GROUP BY month
                ORDER BY MIN(t."transactionAt");
            `) ?? [];

        const lineData = lineDataRaw.map((i) => ({
            month: i?.month ?? "",
            income: Number((i?.income ?? 0).toFixed(2)),
            expense: Number((i?.expense ?? 0).toFixed(2)),
        }));

        const rawBarData =
            (await this.prisma.$queryRaw<
                { date: Date; income: number; expense: number }[]
            >`
                SELECT
                    DATE(t."transactionAt") AS date,
                    SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END) AS income,
                    SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END) AS expense
                FROM "Transaction" t
                JOIN "BankAccount" b ON b.id = t."bankAccountId"
                WHERE 
                    b."userId" = ${userId}
                    AND t."transactionAt" >= NOW() - INTERVAL '7 days'
                GROUP BY DATE(t."transactionAt")
                ORDER BY DATE(t."transactionAt");
            `) ?? [];


        const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

        const barData: { name: string; income: number; expense: number }[] = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);

            const dateKey = d.toISOString().slice(0, 10);

            const found = rawBarData.find(
                r => r?.date?.toISOString()?.slice(0, 10) === dateKey
            );

            barData.push({
                name: weekdays[d.getDay()],
                income: Number(((found?.income ?? 0)).toFixed?.(2) ?? 0),
                expense: Number(((found?.expense ?? 0)).toFixed?.(2) ?? 0),
            });
        }

        const [monthlyIncome] =
            (await this.prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(t.amount), 0) AS total
                FROM "Transaction" t
                JOIN "BankAccount" b ON b.id = t."bankAccountId"
                WHERE 
                    b."userId" = ${userId}
                    AND t.type = 'INCOME'
                    AND DATE_TRUNC('month', t."transactionAt") = DATE_TRUNC('month', NOW());
            `) ?? [{ total: 0 }];

        const [monthlyExpenses] =
            (await this.prisma.$queryRaw<{ total: number }[]>`
                SELECT COALESCE(SUM(t.amount), 0) AS total
                FROM "Transaction" t
                JOIN "BankAccount" b ON b.id = t."bankAccountId"
                WHERE 
                    b."userId" = ${userId}
                    AND t.type = 'EXPENSE'
                    AND DATE_TRUNC('month', t."transactionAt") = DATE_TRUNC('month', NOW());
            `) ?? [{ total: 0 }];

        const [totals] =
            (await this.prisma.$queryRaw<
                { income: number; expense: number }[]
            >`
                SELECT 
                    COALESCE(SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END), 0) AS income,
                    COALESCE(SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END), 0) AS expense
                FROM "Transaction" t
                JOIN "BankAccount" b ON b.id = t."bankAccountId"
                WHERE b."userId" = ${userId};
            `) ?? [{ income: 0, expense: 0 }];

        const totalBalance = (totals?.income ?? 0) - (totals?.expense ?? 0);

        const totalInAccounts = totalBalance;

        return {
            pieData,
            lineData,
            barData,
            monthlyIncome: monthlyIncome?.total ?? 0,
            monthlyExpenses: monthlyExpenses?.total ?? 0,
            totalBalance,
            totalInAccounts,
        };
    }
}
