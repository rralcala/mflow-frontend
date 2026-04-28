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
    <ReferenceInput source="depositCertificateId" label="Deposit Certificate" reference="assets/depositCertificates" />,
    <BooleanInput source="paid" label="Paid" />,
];

export const DepositCertificateSchedulesList = () => (
    <List filters={postFilters} title="Deposit Certificate Schedules">
        <DataTable>
            <DataTable.Col source="depositCertificateId">
                <ReferenceField source="depositCertificateId" reference="assets/depositCertificates" />
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

export const DepositCertificateScheduleShow = () => (
    <Show>
        <SimpleShowLayout>
            <ReferenceField source="depositCertificateId" reference="assets/depositCertificates" />
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

export const DepositCertificateScheduleEdit = () => (
    <Edit>
        <SimpleForm>
            <ReferenceInput source="depositCertificateId" reference="assets/depositCertificates" InputProps={{ disabled: true }} />
            <BooleanInput source="paid" />
            <DateInput source="transactionDate" />
            <NumberInput source="amount" />
            <TextInput source="id" InputProps={{ disabled: true }} />
        </SimpleForm>
    </Edit>
);