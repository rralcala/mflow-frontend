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
    useListContext,
    useGetOne
} from 'react-admin';
import { Stack } from '@mui/material';
import { formatter } from './lib/formaters';

const sumCurrency = (data, fieldName, currency) => {
    return data.reduce((sum, record) => {
        if (currency && record.currency !== currency) {
            return sum; // Skip records that don't match the specified currency
        }
        let amount = record[fieldName] || 0;
        if (amount > 0) {
            return sum;
        }
        return sum - amount;
    }, 0)
}

const SumFooter = ({ fieldName }) => {
    const { data, isLoading } = useListContext();
    const { data: dataQuotes, isLoading: isLoadingQuotes, error: errorQuotes } = useGetOne('reports/exchangeRates', { id: "USDPYG" });

    if (isLoading || !data || data.length === 0 || errorQuotes || isLoadingQuotes || !dataQuotes) {
        return null;
    }

    // Calculate the totals
    const totalUSD = sumCurrency(data, fieldName, "USD");
    const totalPYG = sumCurrency(data, fieldName, "PYG");

    return (
        <Stack>
            <>Spending:</>
            <b>USD:</b>
            <>{formatter.format(totalUSD)}</>
            <b>PYG:</b>
            <>{formatter.format(totalPYG)}</>
            <b>Combo:</b>
            <b>{formatter.format(totalUSD * dataQuotes.rate + totalPYG)}</b>
        </Stack>);
}
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
    <List filters={postFilters} title="Recurrent Transactions" aside={<SumFooter fieldName="amount" />} >
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