import {
    Create,
    DataTable,
    DateField,
    DateInput,
    Edit,
    EditButton,
    List,
    NumberField,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput
} from 'react-admin';
import { Stack, Typography } from '@mui/material';
import { FlowFilters } from './lib';

export const RecurrentList = () => (
    <List filters={FlowFilters}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="flowClass" />
            <DataTable.NumberCol source="amount" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            }} />
            <DataTable.Col source="currency" />
            <DataTable.Col source="start">
                <DateField source="start" />
            </DataTable.Col>
            <DataTable.Col source="recurrence" />
            <DataTable.Col source="end">
                <DateField source="end" />
            </DataTable.Col>
            <DataTable.NumberCol source="rate" options={{
                style: 'percent',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <DataTable.Col source="country" />
            <DataTable.Col source="assetId">
                <ReferenceField source="assetId" reference="assets" link="show" />
            </DataTable.Col>

            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const RecurrentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="flowClass" />
            <TextField source="country" />
            <Typography color="textSecondary">{'Value'}</Typography>
            <Stack direction="row" alignItems="left" spacing={1}>
                <NumberField source="amount" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                }} />
                <TextField source="currency" />
            </Stack>
            <ReferenceField source="assetId" reference="assets" />
            <DateField source="start" />
            <DateField source="end" />
            <TextField source="recurrence" />
            <NumberField source="rate" options={{
                style: 'percent',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
        </SimpleShowLayout>
    </Show>
);

export const RecurrentEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" InputProps={{ disabled: true }} />
            <TextInput source="country" />
            <TextInput source="flowClass" />
            <NumberInput source="amount" />
            <TextInput source="currency" />
            <ReferenceInput source="assetId" reference="assets" />
            <DateInput source="start" />
            <DateInput source="end" />
            <TextInput source="recurrence" />
            <NumberInput source="rate" />
        </SimpleForm>
    </Edit>
);


export const RecurrentCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="country" />
            <TextInput source="flowClass" />
            <NumberInput source="amount" />
            <TextInput source="currency" />
            <ReferenceInput source="assetId" reference="assets" />
            <DateInput source="start" />
            <DateInput source="end" />
            <TextInput source="recurrence" />
            <NumberInput source="rate" />
        </SimpleForm>
    </Create>
);