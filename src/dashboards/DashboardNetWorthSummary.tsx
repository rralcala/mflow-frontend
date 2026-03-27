
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

const apiUrl = import.meta.env.VITE_API_URL;

const formatterPct = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    useGrouping: true,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});


export const DashboardNetWorthSummary = () => {
    const [dataR, setData] = useState({});

    useEffect(() => {
        const user = { authenticated: true };
        fetchUtils.fetchJson(apiUrl + '/nwSummary', { user, credentials: 'include' })
            .then(response => setData(response.json))
            .catch(error => console.error(error));

    }, []); // Empty array ensures this runs once on mount


    return (
        <Stack>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Label</TableCell>
                            <TableCell align="right">Value</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(dataR).map(([key, value]) => (
                            <TableRow
                                key={key}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {key}
                                </TableCell>

                                <TableCell align="right">{formatter.format(value)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};