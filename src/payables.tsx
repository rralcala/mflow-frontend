import { 
    BooleanField, DataTable, DateField, EditButton, List,
    NumberField, Show, SimpleShowLayout, TextField,
    BooleanInput, DateInput, Edit, NumberInput, SimpleForm, TextInput
 } from 'react-admin';
import { Stack, Typography } from '@mui/material';

export const PayableList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="country" />
            <DataTable.Col source="description" />
            <DataTable.Col source="dueDate">
                <DateField source="dueDate" />
            </DataTable.Col>

            <DataTable.NumberCol source="amount" />
            <DataTable.Col source="currency" />

            <DataTable.Col source="commited">
                <BooleanField source="commited" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);


export const PayableShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="description" />
            <DateField source="dueDate" />
            <Typography color="textSecondary">{'Amount'}</Typography>
            <Stack direction="row" alignItems="left" spacing={1}>
                <NumberField source="amount" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }}/>
                <TextField source="currency" />
            </Stack>
            <TextField source="country" />
            <BooleanField source="commited" />
        </SimpleShowLayout>
    </Show>
);


export const PayableEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="country" />
            <TextInput source="description" />
            <NumberInput source="amount" />
            <TextInput source="currency" />
            <DateInput source="dueDate" />
            <BooleanInput source="commited" />
            <TextInput source="id"  InputProps={{ disabled: true }}/>
        </SimpleForm>
    </Edit>
);


export const PayableCreate = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="country" />
            <TextInput source="description" />
            <NumberInput source="amount" />
            <TextInput source="currency" />
            <DateInput source="dueDate" />
            <BooleanInput source="commited" />
            <TextInput source="id"  InputProps={{ disabled: true }}/>
        </SimpleForm>
    </Edit>
);