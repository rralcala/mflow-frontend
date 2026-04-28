
import { 
    DataTable,
    DateField,
    List,
    NumberField,
    Show,
    SimpleShowLayout,
    TextField
} from 'react-admin';
import { Stack, Typography } from '@mui/material';

export const BondList = () => (
    <List title="Bonds">
        <DataTable>
            <DataTable.Col source="name" />
            <DataTable.NumberCol source="capital" />
            <DataTable.Col source="currency" />
            <DataTable.NumberCol source="rate" options={{
                style: 'percent',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />

            <DataTable.Col source="maturityDate">
                <DateField source="maturityDate" />
            </DataTable.Col>
            <DataTable.Col source="entity" />
            <DataTable.Col source="country" />

        </DataTable>
    </List>
);


export const BondShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="name" />
            <Typography color="textSecondary">{'Value'}</Typography>
            <Stack direction="row" alignItems="left" spacing={1}>
                <NumberField source="capital" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                }} />
                <TextField source="currency" />
            </Stack>
            <DateField source="maturityDate" />
            <NumberField source="rate" options={{
                style: 'percent',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <TextField source="country" />
            <TextField source="entity" />
        </SimpleShowLayout>
    </Show>
);