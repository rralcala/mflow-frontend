
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

const reportRoute = 'reports/nw_summary';

export const DashboardNetWorthSummary = () => {
    const [dataR, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(fetcherEffect(setData, setError, setLoading, reportRoute), []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Stack>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                        <TableRow hover
                            key={"capital"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Capital"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.capital)}</TableCell>
                        </TableRow>
                        <TableRow hover
                            key={"debt"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Debt"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.debt)}</TableCell>
                        </TableRow>
                        <TableRow hover
                            key={"debt_to_assets"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Debt to Assets"}
                            </TableCell>
                            <TableCell align="right">{formatterPct.format(dataR.debt_to_assets)}</TableCell>
                        </TableRow>
                        <TableRow hover
                            key={"net_worth"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Net Worth"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.net_worth)}</TableCell>
                        </TableRow>
                        <TableRow hover
                            key={"return_on_assets"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Return on Assets"}
                            </TableCell>
                            <TableCell align="right">{formatterPct.format(dataR.return_on_assets)}</TableCell>
                        </TableRow>
                        <TableRow hover
                            key={"estimated_monthly_income"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Estimated Monthly Income"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.estimated_monthly_income)}</TableCell>
                        </TableRow>
                        <TableRow hover
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
            <br />
            Market Exposure<br /><br />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Market</TableCell>
                            <TableCell align="right">Exposure</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(dataR.tot_per_market).map((row) => (
                            <TableRow hover
                                key={row[0]}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row[0]}
                                </TableCell>

                                <TableCell align="right">{formatterPct.format(row[1])}</TableCell>


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            Asset Location<br /><br />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell align="right">Value</TableCell>
                            <TableCell align="right">Allocation</TableCell>
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

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            End
        </Stack>
    );
};