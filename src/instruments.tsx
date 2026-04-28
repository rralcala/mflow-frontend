import {
    BooleanField,
    BooleanInput,
    Create,
    DataTable,
    DateField,
    DateInput,
    Edit,
    EditButton,
    List,
    NumberField,
    NumberInput,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput
} from 'react-admin';
import { Stack, Typography } from '@mui/material';

export const InstrumentList = () => (
    <List title="Financial Instruments">
        <DataTable>
            <DataTable.Col source="location" />
            <DataTable.Col source="symbol" />
            <DataTable.NumberCol source="qty" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <DataTable.NumberCol source="value" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            }} />
            <DataTable.Col source="currency" />

            <DataTable.NumberCol source="dividend_rate" options={{
                style: 'percent',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <DataTable.NumberCol label="Monthly Dividend" source="estimated_dividend" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            }} />
            <DataTable.Col source="currency" />
            <DataTable.Col source="dividend" />

            <DataTable.Col source="liquid">
                <BooleanField source="liquid" />
            </DataTable.Col>

            <DataTable.NumberCol source="factor" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <DataTable.Col source="country" />
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>

        </DataTable>
    </List>
);

export const InstrumentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="country" />
            <TextField source="location" />
            <TextField source="symbol" />
            <NumberField source="qty" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <Typography color="textSecondary">{'Value'}</Typography>
            <Stack direction="row" alignItems="left" spacing={1}>
                <NumberField source="value" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                }} />
                <TextField source="currency" />
            </Stack>
            <DateField source="acquisition_date" />
            <NumberField source="acquisition_price" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <TextField source="dividend" />
            <NumberField source="dividend_rate" options={{
                style: 'percent',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />

            <Typography color="textSecondary">{'Estimated Dividend'}</Typography>
            <Stack direction="row" alignItems="left" spacing={1}>
                <NumberField source="estimated_dividend" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }} />
                <TextField source="currency" />
            </Stack>

            <NumberField source="factor" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />

            <BooleanField source="liquid" />
        </SimpleShowLayout>
    </Show>
);

export const InstrumentEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="country" InputProps={{ disabled: true }} />
            <TextInput source="location" InputProps={{ disabled: true }} />
            <TextInput source="symbol" />
            <NumberInput source="qty" />
            <TextInput source="currency" />
            <TextInput source="dividend" />
            <NumberInput source="dividend_rate" />

            <BooleanInput source="liquid" />
            <NumberInput source="factor" />
            <DateInput source="acquisition_date" />
            <NumberInput source="acquisition_price" />
            <TextInput source="id" InputProps={{ disabled: true }} />
        </SimpleForm>
    </Edit>
);

export const InstrumentCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="country" />
            <TextInput source="location" />
            <TextInput source="symbol" />
            <NumberInput source="qty" />
            <TextInput source="currency" />
            <TextInput source="dividend" />
            <NumberInput source="dividend_rate" />
            <BooleanInput source="liquid" />
            <NumberInput source="factor" />
            <DateInput source="acquisition_date" />
            <NumberInput source="acquisition_price" />
        </SimpleForm>
    </Create>
);