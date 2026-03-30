
import { useState, useEffect, ReactNode } from 'react';
import { fetchUtils } from 'react-admin';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';

const apiUrl = import.meta.env.VITE_API_URL;

const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    useGrouping: true,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
});

function formatNumberWithColor(value: number): ReactNode {
    const formatted = formatter.format(value);
    if (value < 0) {
        return <span style={{ color: 'red' }}>{formatted}</span>;
    }
    return <span>{formatted}</span>;
}

export const DashboardCashFlow = () => {
    const [dataR, setData] = useState([]);

    useEffect(() => {
        const user = { authenticated: true };
        fetchUtils.fetchJson(apiUrl + '/cashFlow', { user, credentials: 'include' })
            .then(response => setData(response.json))
            .catch(error => console.error(error));

    }, []); // Empty array ensures this runs once on mount


    return (
        <Stack>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">US-USD</TableCell>
                            <TableCell align="right">PY-USD</TableCell>
                            <TableCell align="right">PY-PYG</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataR.map((row) => (
                            <TableRow
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