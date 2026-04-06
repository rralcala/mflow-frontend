
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

const reportRoute = 'reports/income_per_location';

const ExportButton = ({ data }: { data: any[] }) => {
  const downloadCSV = () => {
    // 1. Define your headers
    //const headers = Object.keys(data[0]).join(',');

    // 2. Map the data to rows
    const rows = data.map((obj) => 
      Object.values(obj).map(val => `"${val}"`).join(',')
    ).join('\n');

    // 3. Create the CSV content
    const csvContent = `s${rows}`;

    // 4. Create a blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    return <button onClick={downloadCSV}>Download CSV</button>;
};

export const DashboardIncomePerLocation = () => {

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
            <br />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <span>Asset Location</span>
                <ExportButton data={Object.values(dataR.tot_per_location)} />
            </Stack>
            <br />
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