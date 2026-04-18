import * as React from 'react';
import {
    Button,
    DataTable,
    List,
    useNotify,
    useRefresh
} from 'react-admin';
import { TopToolbar, ExportButton } from 'react-admin';
import RefreshIcon from '@mui/icons-material/Refresh';
import { httpClient } from './httpClient';

const apiUrl = import.meta.env.VITE_API_URL;

const PostListActions = () => (
    <TopToolbar>
        <ExportButton />
        <Button
            onClick={handleClick}
            label="Refresh Exchange Rates"
        >
            <RefreshIcon />
        </Button>
    </TopToolbar>
);


let notify: (message: string, options?: { type: 'info' | 'warning' | 'error' }) => void;
let refresh: () => void;

const handleClick = async () => {
    console.log(typeof notify);
    try {

        httpClient(`${apiUrl}/reports/exchangeRatesRefresh`)
            .then(response => notify(response.json.message))
            .catch(error => console.log(error))
        refresh();
    } catch (error) {
        notify('Error: Action failed', { type: 'warning' });
        console.error(error);
    }
};

export const ExchangerateList = () => {
    notify = useNotify();
    refresh = useRefresh();
    return (<List actions={<PostListActions />} title="Exchange Rates">
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.NumberCol source="rate"
                options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                }} />
            <DataTable.NumberCol source="weekChange"
                options={{
                    style: 'percent',
                    useGrouping: true,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                }} />
        </DataTable>
    </List>);
};