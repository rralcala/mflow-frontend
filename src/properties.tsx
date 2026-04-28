import {
    DataTable,
    DateField,
    DateInput,
    Edit,
    List,
    NumberField,
    NumberInput,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput
} from 'react-admin';

export const PropertyList = () => (
    <List title="Properties">
        <DataTable>
            <DataTable.Col source="propertyName" />
            <DataTable.Col source="country" />
            <DataTable.Col source="purchaseDate">
                <DateField source="purchaseDate" />
            </DataTable.Col>
            <DataTable.NumberCol source="purchasePrice" />
            <DataTable.NumberCol source="currentPrice" />
            <DataTable.Col source="currency" />
            <DataTable.Col source="additionalData"/>
            <DataTable.NumberCol source="rentPrice" />
            <DataTable.Col source="rentCurrency" />
            <DataTable.Col source="id" />
            <DataTable.NumberCol source="depreciation" />
        </DataTable>
    </List>
);

export const PropertyShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="propertyName" />
            <TextField source="country" />
            <DateField source="purchaseDate" />
            <NumberField source="purchasePrice" />
            <NumberField source="currentPrice" />
            <TextField source="currency" />
            <NumberField source="rentPrice" />
            <TextField source="rentCurrency" />
            <TextField source="additionalData" />
            <NumberField source="depreciation" />
            <TextField source="id" />

        </SimpleShowLayout>
    </Show>
);


export const PropertyEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="propertyName" />
            <TextInput source="country" />
            <DateInput source="purchaseDate" />
            <NumberInput source="purchasePrice" />
            <NumberInput source="currentPrice" />
            <TextInput source="currency" />
            <NumberInput source="depreciation" />
            <NumberInput source="rentPrice" />
            <TextInput source="rentCurrency" />
            <TextInput source="additionalData"  multiline rows={5} />
        </SimpleForm>
    </Edit>
);