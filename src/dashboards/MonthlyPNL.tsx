
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


export const DashboardMonthlyPNL = () => {
    const reportRoute = '/reports/monthly_pnl';
    const [dataR, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(fetcherEffect(setData, setError, setLoading, reportRoute), []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    console.log(dataR);
    return (
    <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
      <h3>Raw Report Data</h3>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(dataR, null, 2)}
      </pre>
    </div>
    );
};