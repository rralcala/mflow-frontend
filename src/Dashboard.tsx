// in src/Dashboard.js
import { useGetOne } from "react-admin";

import { Card, CardContent, CardHeader } from '@mui/material';
import DollarIcon from '@mui/icons-material/AttachMoney';
import CardWithIcon from './CardWithIcon';
import { Stack } from '@mui/material';

export const Dashboard = () => {
    // Fetch a specific record using useGetOne hook
    // Replace 'dashboard-stats' with your actual resource name and '1' with the record ID
    const { data, isLoading, error } = useGetOne('monthlyTransactions', { id: '2026-03-CostoFijo-PY' });

    const { data: dataD, isLoading: isLoadingD, error: errorD } = useGetOne('monthlyTransactions', { id: '2026-03-Discretionary' });
  
    
    const { data: dataS, isLoading: isLoadingS, error: errorS } = useGetOne('monthlyTransactions', { id: '2026-03-Supermercado' });
  
    if (isLoading || isLoadingD || isLoadingS) return <Card><CardContent>Loading...</CardContent></Card>;
    if (error || errorD || errorS) return <Card><CardContent>Error loading data</CardContent></Card>;

    return (

        <Stack spacing={1}>

            <Card>
                <CardHeader title="Welcome mFlow" />
                <CardContent>Here's a summary of key budgets:</CardContent>
            </Card>
            <CardWithIcon
                to="/recurrentTransactions"
                icon={DollarIcon}
                title="Remaining fixed"
                subtitle={data}
            />
            <CardWithIcon
                to="/recurrentTransactions"
                icon={DollarIcon}
                title="Remaining discretionary"
                subtitle={dataD}
            />
            <CardWithIcon
                to="/recurrentTransactions"
                icon={DollarIcon}
                title="Remaining groceries"
                subtitle={dataS}
            />

       </Stack>
    );
};