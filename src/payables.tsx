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

export const PayableList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="country" />
            <DataTable.Col source="description" />
            <DataTable.Col source="dueDate">
                <DateField source="dueDate" />
            </DataTable.Col>

            <DataTable.NumberCol source="amount" />
            <DataTable.NumberCol source="balance" />
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
            <Typography color="textSecondary">{'Balance'}</Typography>
            <Stack direction="row" alignItems="left" spacing={1}>
                <NumberField source="balance" options={{
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
            <NumberInput source="balance" />
            <TextInput source="currency" />
            <DateInput source="dueDate" />
            <BooleanInput source="commited" />
            <TextInput source="id"  InputProps={{ disabled: true }}/>
        </SimpleForm>
    </Edit>
);


export const PayableCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="country" />
            <TextInput source="description" />
            <NumberInput source="amount" />
            <NumberInput source="balance" />
            <TextInput source="currency" />
            <DateInput source="dueDate" />
            <BooleanInput source="commited" />
        </SimpleForm>
    </Create>
);