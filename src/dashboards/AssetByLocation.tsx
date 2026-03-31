
import { useState, useEffect } from 'react';
import { fetchUtils } from 'react-admin';

import { Chart } from "react-google-charts";
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

export const DashboardAssetByLocation = () => {
    // Fetch a specific record using useGetOne hook
    // Replace 'dashboard-stats' with your actual resource name and '1' with the record ID
    const [dataR, setData] = useState([]);

    useEffect(() => {
        const user = { authenticated: true };
        fetchUtils.fetchJson(apiUrl + '/reports/assets_by_location', { user, credentials: 'include' })
            .then(response => setData(response.json))
            .catch(error => console.error(error));

    }, []); // Empty array ensures this runs once on mount

    type DataRow = [any, number];
    function addTotal<T>(matrix: DataRow[]): DataRow[] {
        const columnSum = matrix.reduce((accumulator, currentRow) => {
            // We use the nullish coalescing operator (?? 0) in case a row is shorter than expected
            console.log(currentRow);
            return accumulator + (currentRow[1] ?? 0);
        }, 0);

        return [...matrix, ["Total", columnSum]];
    }
    return (
        <Stack>
            <Chart
                chartType="PieChart"
                data={dataR}

                width={"100%"}
                height={"400px"}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell align="right">Value</TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {addTotal(dataR.slice(1)).map((row) => (
                            <TableRow
                                key={row[0]}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row[0]}
                                </TableCell>

                                <TableCell align="right">{formatter.format(row[1]) + " $"}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};