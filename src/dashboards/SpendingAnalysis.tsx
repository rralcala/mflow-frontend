
import { useState, useEffect } from 'react';
import { fetchUtils } from 'react-admin';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';

import { formatter } from '../lib';

const apiUrl = import.meta.env.VITE_API_URL;

const formatterFract = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

export const DashboardSpendingAnalysis = () => {
    const [dataR, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const user = { authenticated: true };
        fetchUtils.fetchJson(apiUrl + '/reports/spending_analysis', { user, credentials: 'include' })
            .then(response => setData(response.json))
            .catch(error => setError(error))
            .finally(() => setLoading(false));

    }, []); // Empty array ensures this runs once on mount
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Stack>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">

                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell align="right">USD</TableCell>
                            <TableCell align="right">{dataR.secondary_currency}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            key={"expense"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Expenses"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.total_budget.expense)}</TableCell>
                            <TableCell align="right">{formatter.format(dataR.total_budget.expense * dataR.exchange)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"loan"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Loans"}
                            </TableCell>
                            <TableCell align="right">{formatterFract.format(dataR.total_budget.loan)}</TableCell>
                            <TableCell align="right">{formatter.format(dataR.total_budget.loan * dataR.exchange)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"total_expense"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Total Expenses"}
                            </TableCell>
                            <TableCell align="right">{formatterFract.format(dataR.total_budget.loan + dataR.total_budget.expense)}</TableCell>
                            <TableCell align="right">{formatter.format((dataR.total_budget.loan + dataR.total_budget.expense) * dataR.exchange)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"income"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Income"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.total_budget.income)}</TableCell>
                            <TableCell align="right">{formatter.format(dataR.total_budget.income * dataR.exchange)}</TableCell>
                        </TableRow>

                        <TableRow
                            key={"repayment"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Repayment Income"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.total_budget.repayment)}</TableCell>
                            <TableCell align="right">{formatter.format(dataR.total_budget.repayment * dataR.exchange)}</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};