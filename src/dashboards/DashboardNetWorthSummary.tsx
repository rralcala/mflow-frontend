
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
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
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
                        <TableRow
                            key={"capital"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Capital"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.capital)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"debt"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Debt"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.debt)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"debt_to_assets"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Debt to Assets"}
                            </TableCell>
                            <TableCell align="right">{formatterPct.format(dataR.debt_to_assets)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"net_worth"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Net Worth"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.net_worth)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"return_on_assets"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Return on Assets"}
                            </TableCell>
                            <TableCell align="right">{formatterPct.format(dataR.return_on_assets)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"estimated_monthly_income"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Estimated Monthly Income"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.estimated_monthly_income)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"fixed_income"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Fixed Income"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.fixed_income)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};