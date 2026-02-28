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
  
    if (isLoading || isLoadingD) return <Card><CardContent>Loading...</CardContent></Card>;
    if (error || errorD) return <Card><CardContent>Error loading data</CardContent></Card>;

    return (

        <Stack spacing={1}>
            <span>
                <Card>
                    <CardHeader title="Welcome mFlow" />
                    <CardContent>Here's a summary of key budgets:</CardContent>
                </Card>
            </span>
            <span>
                <CardWithIcon
                    to="/recurrentTransactions"
                    icon={DollarIcon}
                    title="Remaining fixed"
                    subtitle={data}
                />
            </span>
            <span>
                <CardWithIcon
                    to="/recurrentTransactions"
                    icon={DollarIcon}
                    title="Remaining discretionary"
                    subtitle={dataD}
                />
            </span>
       </Stack>
    );
};