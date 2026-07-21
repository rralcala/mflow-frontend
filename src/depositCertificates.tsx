
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
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput
} from 'react-admin';
import { Stack, Typography } from '@mui/material';

export const DepositCertificateList = () => (
    <List title="Deposit Certificates">
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
            <DataTable.NumberCol source="purchasePrice" />
            <DataTable.Col source="maturityDate">
                <DateField source="maturityDate" />
            </DataTable.Col>
            <DataTable.Col source="entity" />
            <DataTable.Col source="country" />
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const DepositCertificateShow = () => (
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
            <NumberField source="rate" options={{
                style: 'percent',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <TextField source="country" />
            <TextField source="entity" />
            <DateField source="maturityDate" />
        </SimpleShowLayout>
    </Show>
);

export const DepositCertificateEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="entity" />
            <TextInput source="country" />
            <TextInput source="currency" />
            <NumberInput source="capital" />
            <DateInput source="maturityDate" />
            <NumberInput source="rate" />
            <TextInput source="id"  InputProps={{ disabled: true }} />
        </SimpleForm>
    </Edit>
);

export const DepositCertificateCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="entity" />
            <TextInput source="country" />
            <TextInput source="currency" />
            <NumberInput source="capital" />
            <DateInput source="maturityDate" />
            <NumberInput source="rate" />
        </SimpleForm>
    </Create>
);