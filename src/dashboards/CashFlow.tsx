
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';

import { formatNumberWithColor } from '../lib';
import { fetcherEffect } from '../httpClient';

const reportRoute = 'reports/cash_flow';

export const DashboardCashFlow = () => {
    const [dataR, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(fetcherEffect(setData, setError, setLoading, reportRoute), []); // Empty array ensures this runs once on mount

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const today = new Date().toISOString().split('T')[0];

    let min_uu = Infinity;
    let min_up = Infinity;
    let min_pp = Infinity;

    // 2. Use .forEach() instead of .map() when you aren't creating a new array
    dataR.forEach((row) => {
        if (row.date >= today) {
            min_uu = Math.min(min_uu, row["USD-US"]);
            min_up = Math.min(min_up, row["USD-PY"]);
            min_pp = Math.min(min_pp, row["PYG-PY"]);
        }
    });
    return (
        <Stack>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">US-USD Min: {formatNumberWithColor(min_uu)}</TableCell>
                            <TableCell align="right">PY-USD Min: {formatNumberWithColor(min_up)}</TableCell>
                            <TableCell align="right">PY-PYG Min: {formatNumberWithColor(min_pp)}</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataR.map((row) => (
                            <TableRow hover
                                key={row.date}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.date}
                                </TableCell>

                                <TableCell align="right">{formatNumberWithColor(row["USD-US"])}</TableCell>
                                <TableCell align="right">{formatNumberWithColor(row["USD-PY"])}</TableCell>
                                <TableCell align="right">{formatNumberWithColor(row["PYG-PY"])}</TableCell>
                                <TableCell align="right">{formatNumberWithColor(row["Total"])}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};