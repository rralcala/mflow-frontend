import {
    BooleanField,
    BooleanInput,
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

const postFilters = [
    <ReferenceInput source="bondId" label="Bond" reference="assets/bonds" />,
    <BooleanInput source="paid" label="Paid" />,
];

export const BondscheduleList = () => (
    <List filters={postFilters}>
        <DataTable>
            <DataTable.Col source="bondId">
                <ReferenceField source="bondId" reference="assets/bonds" />
            </DataTable.Col>
            <DataTable.Col source="transactionDate">
                <DateField source="transactionDate" />
            </DataTable.Col>
            <DataTable.NumberCol source="amount" />
            <DataTable.Col source="paid">
                <BooleanField source="paid" />
            </DataTable.Col>
            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const BondscheduleShow = () => (
    <Show>
        <SimpleShowLayout>
            <ReferenceField source="bondId" reference="assets/bonds" />
            <DateField source="transactionDate" />
            <NumberField source="amount" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <BooleanField source="paid" />
            <TextField source="id" />
        </SimpleShowLayout>
    </Show>
);

export const BondscheduleEdit = () => (
    <Edit>
        <SimpleForm>
            <ReferenceInput source="bondId" reference="assets/bonds" InputProps={{ disabled: true }} />
            <BooleanInput source="paid" />
            <DateInput source="transactionDate" />
            <NumberInput source="amount" />
            <TextInput source="id" InputProps={{ disabled: true }} />
        </SimpleForm>
    </Edit>
);