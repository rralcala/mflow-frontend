
import { useState, useEffect, ReactNode } from 'react';
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

function formatNumberWithColor(value: number): ReactNode {
    const formatted = formatter.format(value);
    if (value < 0) {
        return <span style={{ color: 'red' }}>{formatted}</span>;
    }
    return <span>{formatted}</span>;
}

type DataRow = [any, number, number, number];
function reduceColumns<T>(matrix: DataRow[]): T[][] {
    return matrix.map(row => [row[0], { v: row[2] / row[1], f: formatter.format(row[2]) + " " + formatterPct.format(row[2] / row[1]) }, { v: row[3] / row[1], f: formatter.format(row[3]) + " " + formatterPct.format(row[3] / row[1]) }]);
}

const options = {
    title: "Change over Time",
    isStacked: true,
    legend: { position: "bottom" },
    vAxis: {
        // 'percent' is a built-in ICU format that handles the *100 math for you
        format: 'percent'
    },
    hAxis: {
        title: "Year Month",
        gridlines: { count: 3 }, // Controls the number of gridlines
    },
};


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