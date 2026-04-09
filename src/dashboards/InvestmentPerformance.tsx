
import { useState, useEffect } from 'react';

import { Chart } from "react-google-charts";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import { formatNumberWithColor, formatterPct, formatPctWithNan } from '../lib';
import { fetcherEffect } from '../httpClient';

const reportRoute = 'reports/investment_performance';

type DataRow = [string, number];
function reduceColumns<T>(matrix): DataRow[] {
    return matrix.map(row => [row["from"] + "-" + row["to"], Math.trunc(row["assets"].reduce((a, b) => a + b[1], 0))]);
}

function checkUndefinedPct(value, ifso: string) {
    if (value === undefined) {
        return ifso;
    } else {
        return formatPctWithNan(value / 100)
    }
}

function headRow(row) {
    return (
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell><b>Range</b></TableCell>
            <TableCell align="right"><b>{checkUndefinedPct(row["from"], "-Inf")}</b></TableCell>
            <TableCell align="right"><b>{checkUndefinedPct(row["to"], "Inf")}</b></TableCell>

        </TableRow>
    );
}

function subRows(row) {
    return row.assets.map((irow) => (
        <TableRow hover
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell align="left">{irow[0]}</TableCell>
            <TableCell align="right">{formatNumberWithColor(irow[1])} {irow[2]}</TableCell>
            <TableCell align="right">{formatterPct.format(irow[3] / 100)}</TableCell>
        </TableRow>

    ))
}

const options = {
    title: "Investment Clusters",
};

export const DashboardInvestmentPerformance = () => {
    const [dataR, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(fetcherEffect(setData, setError, setLoading, reportRoute), []); // Empty array ensures this runs once on mount

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <Stack>
            <Chart
                chartType="PieChart"
                data={[["Range", "Total"], ...reduceColumns(dataR)]}
                options={options}
                width={"100%"}
                height={"400px"}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Asset</TableCell>
                            <TableCell align="right">Capital</TableCell>

                            <TableCell align="right">Return</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataR.map((row) => (
                            <>
                                {headRow(row)}
                                {subRows(row)}
                            </>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};