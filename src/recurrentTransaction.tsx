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
import { Stack, Typography } from '@mui/material';
import { formatter, SingleFetchAutocomplete } from './lib';

interface Transaction {
    id: number;
    currency: string;
    amount: number;
}

// Currency amounts are stored as negative for spending, positive for income.
// This sums only the spending (negative) side and returns it as a positive total.
const sumSpending = (data: Transaction[], currency: string) =>
    data
        .filter((record) => record.currency === currency && record.amount < 0)
        .reduce((sum, record) => sum - record.amount, 0);

const numberFieldOptions = {
    style: 'decimal' as const,
    useGrouping: true,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
};

const SumFooter = () => {
    const { data, isLoading } = useListContext<Transaction>();
    const { data: dataQuotes, isLoading: isLoadingQuotes, error: errorQuotes } =
        useGetOne('reports/exchangeRates', { id: 'USDPYG' });

    if (isLoading || !data?.length || isLoadingQuotes || errorQuotes || !dataQuotes) {
        return null;
    }

    const totalUSD = sumSpending(data, 'USD');
    const totalPYG = sumSpending(data, 'PYG');

    return (
        <Stack spacing={0.5}>
            <Typography variant="subtitle2">Spending</Typography>
            <Typography>USD: {formatter.format(totalUSD)}</Typography>
            <Typography>PYG: {formatter.format(totalPYG)}</Typography>
            <Typography sx={{ fontWeight: "bold" }}>
                Combined: {formatter.format(totalUSD * dataQuotes.rate + totalPYG)}
            </Typography>
        </Stack>
    );
};

const postDefaultValue = () => {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    return {
        transactionDate: today,
        yearMonth: today.slice(0, 7), // "YYYY-MM"
    };
};

const postFilters = [
    <SingleFetchAutocomplete reference="assets/recurrents" source="recurrentId" targetField="id" label="Recurrent" />,

    <TextInput source="yearMonth" label="Year Month" />,
    <TextInput source="description" label="Description" />,
];

export const RecurrenttransactionList = () => (
    <List filters={postFilters} title="Recurrent Transactions" aside={<SumFooter />}>
        <DataTable>
            <DataTable.Col source="recurrentId">
                <ReferenceField source="recurrentId" reference="assets/recurrents" />
            </DataTable.Col>
            <DataTable.Col source="yearMonth" />
            <DataTable.Col source="description" />
            <DataTable.NumberCol
                source="amount"
                options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }}
            />
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
            <NumberField source="amount" options={numberFieldOptions} />
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
            <ReferenceInput
                source="paidWithAssetId"
                reference="assets/assets"
                filter={{ liquid: true }}
                sort={{ field: 'id', order: 'ASC' }}
            />
            <TextInput source="id" disabled />
            <DateInput source="createDate" disabled />
        </SimpleForm>
    </Edit>
);

export const RecurrenttransactionCreate = () => (
    <Create>
        <SimpleForm defaultValues={postDefaultValue}>
            <SingleFetchAutocomplete reference="assets/recurrents" source="recurrentId" targetField="id" label="Recurrent" />
            <TextInput source="yearMonth" />
            <TextInput source="description" />
            <NumberInput source="amount" />
            <DateInput source="transactionDate" />

            <ReferenceInput
                source="paidWithAssetId"
                reference="assets/assets"
                filter={{ liquid: true }}
                sort={{ field: 'id', order: 'ASC' }}
            />
        </SimpleForm>
    </Create>
);