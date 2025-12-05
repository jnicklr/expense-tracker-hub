import { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    useTheme,
    CircularProgress,
} from "@mui/material";

import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as ReTooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    ResponsiveContainer,
} from "recharts";

import { getDashboardData } from "../services/dashboardService";

export default function DashboardPage() {
    const theme = useTheme();

    const [lineData, setLineData] = useState<any[]>([]);
    const [pieData, setPieData] = useState<any[]>([]);
    const [barData, setBarData] = useState<any[]>([]);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [monthlyExpenses, setMonthlyExpenses] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);

    const [loading, setLoading] = useState(true);

    const COLORS = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.error.main,
    ];

    useEffect(() => {
        async function load() {
            try {
                const data = await getDashboardData();

                setLineData(
                    data.lineData.map((i: any) => ({
                        month: i.month,
                        income: Number(i.income),
                        expense: Number(i.expense),
                    }))
                );

                setPieData(
                    data.pieData.map((i: any) => ({
                        name: i.name,
                        value: Number(i.value),
                    }))
                );

                setBarData(
                    data.barData.map((i: any) => ({
                        name: i.name,
                        income: Number(i.income),
                        expense: Number(i.expense),
                    }))
                );

                setMonthlyIncome(data.monthlyIncome);
                setMonthlyExpenses(data.monthlyExpenses);
                setTotalBalance(data.totalBalance);
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    width: "100%",
                    height: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ width: "100%", p: 3, boxSizing: "border-box" }}>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    width: "100%",
                }}
            >
                <Card sx={{ flex: "1 1 280px", backgroundColor: theme.palette.background.paper }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            Valor Total Disponível
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                            R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ flex: "1 1 280px", backgroundColor: theme.palette.background.paper }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            Ganho Total no Mês
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                            R$ {monthlyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </Typography>
                    </CardContent>
                </Card>

                <Card sx={{ flex: "1 1 280px", backgroundColor: theme.palette.background.paper }}>
                    <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                            Despesa Total no Mês
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                            R$ {monthlyExpenses.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </Typography>
                    </CardContent>
                </Card>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    mt: 2,
                    width: "100%",
                }}
            >
                <Card sx={{ flex: "1 1 400px", p: 2, borderRadius: 3, overflow: "hidden" }}>
                    <Typography variant="h6" mb={2} fontWeight="bold">
                        Gastos pos Mês
                    </Typography>
                    <Box sx={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    stroke={theme.palette.success.main}
                                    strokeWidth={3}
                                    name="Income"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    stroke={theme.palette.error.main}
                                    strokeWidth={3}
                                    name="Expense"
                                />
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <ReTooltip />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Card>

                <Card sx={{ flex: "1 1 400px", p: 2, borderRadius: 3, overflow: "hidden" }}>
                    <Typography variant="h6" mb={2} fontWeight="bold">
                        Despesas por Categoria
                    </Typography>
                    <Box sx={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                                    {pieData.map((_, idx) => (
                                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ReTooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Card>

                <Card sx={{ flex: "1 1 100%", p: 2, borderRadius: 3, overflow: "hidden" }}>
                    <Typography variant="h6" mb={2} fontWeight="bold">
                        Gastos na Semana
                    </Typography>
                    <Box sx={{ width: "100%", height: 280 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <ReTooltip />

                                <Bar
                                    dataKey="income"
                                    stackId="a"
                                    fill={theme.palette.success.main}
                                    radius={[6, 6, 0, 0]}
                                />

                                <Bar
                                    dataKey="expense"
                                    stackId="a"
                                    fill={theme.palette.error.main}
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>

                        </ResponsiveContainer>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
}
