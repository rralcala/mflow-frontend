
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

type DataRow = [any, number, number, number];
function reduceColumns<T>(matrix: DataRow[]): T[][] {
    return matrix.map(row => [row[0], {v: row[2] / row[1], f: formatterPct.format(row[2] / row[1])}, {v: row[3] / row[1], f: formatterPct.format(row[3] / row[1])}]);
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


export const DashboardValuationHistory = () => {
    const [dataR, setData] = useState([]);

    useEffect(() => {
        const user = { authenticated: true };
        fetchUtils.fetchJson(apiUrl + '/valuationHistory', { user, credentials: 'include' })
            .then(response => setData(response.json))
            .catch(error => console.error(error));

    }, []); // Empty array ensures this runs once on mount


    return (
        <Stack>
            <Chart
                chartType="AreaChart"
                width="100%"
                height="400px"
                data={[["Month", "Fixed", "Capital"], ...reduceColumns(dataR)]}
                options={options}
                legendToggle
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Location</TableCell>
                            <TableCell align="right">NW</TableCell>
                            <TableCell align="right">Fixed</TableCell>
                            <TableCell align="right">Capital</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataR.map((row) => (
                            <TableRow
                                key={row[0]}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row[0]}
                                </TableCell>

                                <TableCell align="right">{formatter.format(row[1]) + " $"}</TableCell>
                                <TableCell align="right">{formatter.format(row[2]) + " $"}</TableCell>
                                <TableCell align="right">{formatter.format(row[3]) + " $"}</TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Stack>
    );
};