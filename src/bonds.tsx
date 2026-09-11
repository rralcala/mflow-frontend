
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
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput
} from 'react-admin';
import { Stack, Typography } from '@mui/material';
import { TargetAssetsInput } from './lib';

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
            <DataTable.NumberCol source="purchasePrice" />

            <DataTable.Col source="maturityDate">
                <DateField source="maturityDate" />
            </DataTable.Col>
            <DataTable.Col source="entity" />
            <DataTable.Col source="country" />
            <DataTable.Col source="targetAssetId">
                <ReferenceField source="targetAssetId" reference="assets/assets" link="show" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);


export const BondShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="name" />
            <Typography color="textSecondary">{'Value'}</Typography>
            <Stack direction="row" sx={{ alignItems: "flex-start", }} spacing={1}>
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
            <ReferenceField source="targetAssetId" reference="assets/assets" label="Target Asset" />
        </SimpleShowLayout>
    </Show>
);

export const BondEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="entity" />
            <TextInput source="country" />
            <TextInput source="currency" />
            <NumberInput source="capital" />
            <DateInput source="maturityDate" />
            <NumberInput source="rate" />
            <TargetAssetsInput source="targetAssetId" />
            <TextInput source="id" disabled />
        </SimpleForm>
    </Edit>
);

export const BondCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="entity" />
            <TextInput source="country" />
            <TextInput source="currency" />
            <NumberInput source="capital" />
            <DateInput source="maturityDate" />
            <NumberInput source="rate" />
            <TargetAssetsInput source="targetAssetId" />
        </SimpleForm>
    </Create>
);