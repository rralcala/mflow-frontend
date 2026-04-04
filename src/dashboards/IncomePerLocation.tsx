
import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';

import { fetcherEffect } from '../httpClient';
import { formatter, formatterPct } from '../lib';


export const DashboardIncomePerLocation = () => {
    const reportRoute = '/reports/income_per_location';
    const [dataR, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(fetcherEffect(setData, setError, setLoading, reportRoute), []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    let totalValue = 0;

    Object.values(dataR.tot_per_location).forEach(row => {

        if (row[3] > 0) {
            totalValue += row[3];
        }
    });

    return (
        <Stack>
            Asset Location<br /><br />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell align="right">Value</TableCell>
                            <TableCell align="right">Allocation</TableCell>
                            <TableCell align="right">Fixed Income (PYG)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(dataR.tot_per_location).map((row) => (

                            <TableRow hover
                                key={row[1][0]}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row[1][0]}
                                </TableCell>

                                <TableCell align="right">{formatter.format(row[1][1])}</TableCell>
                                <TableCell align="right">{formatterPct.format(row[1][2])}</TableCell>
                                <TableCell align="right">{formatter.format(row[1][3])}</TableCell>
                            </TableRow>
                        ))}
                        <TableRow hover
                            key="total"
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                Total Income (No Negs)
                            </TableCell>

                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">{formatter.format(totalValue)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            End
        </Stack>
    );
};