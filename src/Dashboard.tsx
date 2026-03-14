// in src/Dashboard.js
import { useGetOne } from "react-admin";

import { Card, CardContent, CardHeader } from '@mui/material';
import DollarIcon from '@mui/icons-material/AttachMoney';
import CardWithIcon from './CardWithIcon';
import { Stack } from '@mui/material';

export const Dashboard = () => {
    // Fetch a specific record using useGetOne hook
    // Replace 'dashboard-stats' with your actual resource name and '1' with the record ID
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed

    const { data, isLoading, error } = useGetOne('monthlyTransactions', { id: `${year}-${month}-CostoFijo-PY` });

    const { data: dataD, isLoading: isLoadingD, error: errorD } = useGetOne('monthlyTransactions', { id: `${year}-${month}-Discretionary` });
  
    
    const { data: dataS, isLoading: isLoadingS, error: errorS } = useGetOne('monthlyTransactions', { id: `${year}-${month}-Supermercado` });
  
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
                title={`Remaining discretionary for ${year}-${month}`}
                subtitle={dataD}
            />
            <CardWithIcon
                to="/recurrentTransactions"
                icon={DollarIcon}
                title={`Remaining groceries for ${year}-${month}`}
                subtitle={dataS}
            />
            <CardWithIcon
                to="/recurrentTransactions"
                icon={DollarIcon}
                title={`Remaining fixed for ${year}-${month}`}
                subtitle={data}
            />
       </Stack>
    );
};