
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';

import { formatter } from '../lib';
import { fetcherEffect } from '../httpClient';

export const formatterFract = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    useGrouping: true,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
});

export const DashboardProjectionAnalysis = () => {
    const reportRoute = '/reports/projection_analysis';
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
                        <TableRow
                            key={"net_worth_value"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Net Worth Value"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.net_worth_value)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"desired_estate"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Desired Estate"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.desired_estate)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"runway_years"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Runway Years"}
                            </TableCell>
                            <TableCell align="right">{formatterFract.format(dataR.runway_years)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"current_year_net"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Current Year Net"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.current_year_net)}</TableCell>
                        </TableRow>
                        <TableRow
                            key={"estimated_max_var_usd"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Estimated Max VAR"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.estimated_max_var_usd)} USD</TableCell>
                        </TableRow>
                        <TableRow
                            key={"estimated_max_var_sec_cur"}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {"Estimated Max VAR Sec Cur"}
                            </TableCell>
                            <TableCell align="right">{formatter.format(dataR.estimated_max_var_sec_cur)} {dataR.secondary_currency}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};