
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
import { formatNumberWithColor, formatterPct } from '../lib';

const apiUrl = import.meta.env.VITE_API_URL;

function formatPctWithNan(value: number): ReactNode {
    if (isNaN(value)) {
        return <span>-</span>;
    }
    return formatterPct.format(value);
}

type DataRow = [string, number];
function reduceColumns<T>(matrix): DataRow[] {

    return matrix.map(row => [row["from"] + "-" + row["to"], Math.trunc(row["assets"].reduce((a, b) => a + b[1], 0))]);
}

function headRow(row) {
    return (<TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell><b>Range</b></TableCell>
        <TableCell align="right"><b>{formatPctWithNan(row["from"] / 100)}</b></TableCell>
        <TableCell align="right"><b>{formatPctWithNan(row["to"] / 100)}</b></TableCell>

    </TableRow>
    );
}

function subRows(row) {
    return row.assets.map((irow) => (
        <TableRow

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
    const [dataR, setData] = useState([]);

    useEffect(() => {
        const user = { authenticated: true };
        fetchUtils.fetchJson(apiUrl + '/reports/investment_performance', { user, credentials: 'include' })
            .then(response => setData(response.json))
            .catch(error => console.error(error));

    }, []); // Empty array ensures this runs once on mount

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