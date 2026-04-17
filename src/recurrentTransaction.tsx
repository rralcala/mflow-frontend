import {
    List,
    Create,
    DataTable,
    DateField,
    DateInput,
    Edit,
    EditButton,
    NumberField,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
} from 'react-admin';

// Define a function that returns the default values
const postDefaultValue = () => {
    const now = new Date();
    return {
        transactionDate: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
            now.getDate()).padStart(2, "0")}`,
        yearMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    };
};

const postFilters = [
    <ReferenceInput source="recurrentId" label="Recurrent" reference="assets/recurrents" />,
    <TextInput source="yearMonth" label="Year Month" />
];

export const RecurrenttransactionList = () => (
    <List filters={postFilters}>
        <DataTable>
            <DataTable.Col source="recurrentId">
                <ReferenceField source="recurrentId" reference="assets/recurrents" />
            </DataTable.Col>
            <DataTable.Col source="yearMonth" />
            <DataTable.Col source="description" />
            <DataTable.NumberCol source="amount" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            }} />
            <DataTable.Col source="paidWithAssetId">
                <ReferenceField source="paidWithAssetId" reference="assets/assets" />
            </DataTable.Col>
            <DataTable.Col source="transactionDate">
                <DateField source="transactionDate" />
            </DataTable.Col>


            <DataTable.Col source="createDate">
                <DateField source="createDate" />
            </DataTable.Col>

            <DataTable.Col>
                <EditButton />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const RecurrenttransactionShow = () => (
    <Show>
        <SimpleShowLayout>
            <ReferenceField source="recurrentId" reference="assets/recurrents" />
            <TextField source="yearMonth" />
            <TextField source="description" />
            <DateField source="transactionDate" />
            <DateField source="createDate" />


            <ReferenceField source="paidWithAssetId" reference="assets/assets" />

            <NumberField source="amount" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            }} />
            <TextField source="id" />

        </SimpleShowLayout>
    </Show>
);

export const RecurrenttransactionEdit = () => (
    <Edit>
        <SimpleForm>
            <ReferenceInput source="recurrentId" reference="assets/recurrents" />
            <TextInput source="yearMonth" />
            <TextInput source="description" />
            <NumberInput source="amount" />
            <DateInput source="transactionDate" />
            <ReferenceInput source="paidWithAssetId" reference="assets/assets" filter={{ liquid: true }} sort={{ field: 'id', order: 'ASC' }} />
            <TextInput source="id" InputProps={{ disabled: true }} />
            <DateInput source="createDate" InputProps={{ disabled: true }} />
        </SimpleForm>
    </Edit>
);


export const RecurrenttransactionCreate = () => (
    <Create>
        <SimpleForm defaultValues={postDefaultValue}>
            <ReferenceInput source="recurrentId" reference="assets/recurrents" />
            <TextInput source="yearMonth" />
            <TextInput source="description" />
            <NumberInput source="amount" />
            <DateInput source="transactionDate" />
            <ReferenceInput source="paidWithAssetId" reference="assets/assets" filter={{ liquid: true }} sort={{ field: 'id', order: 'ASC' }} />
        </SimpleForm>
    </Create>
);