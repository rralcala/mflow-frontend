import {
    DataTable,
    List,
    ReferenceField,
    NumberField,
    Show,
    SimpleShowLayout,
    TextField
} from 'react-admin';

export const MonthlytransactionList = () => (
    <List sort={{ field: 'yearMonth', order: 'ASC' }} perPage={25}>
        <DataTable>
            <DataTable.Col source="yearMonth" />

            <DataTable.Col source="assetId">
                <ReferenceField source="assetId" reference="assets" />
            </DataTable.Col>
            <DataTable.NumberCol source="amount" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            }} />

            <DataTable.Col source="currency" />
        </DataTable>
    </List>
);

export const MonthlytransactionShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="yearMonth" />
            <ReferenceField source="assetId" reference="assets" />
            <NumberField source="amount" options={{
                style: 'decimal',
                useGrouping: true,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
            }} />
            <TextField source="currency" />
        </SimpleShowLayout>
    </Show>
);