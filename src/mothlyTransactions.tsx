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
    <List sort={{ field: 'yearMonth', order: 'ASC' }} perPage={25} title="Monthly Costs">
        <DataTable>
            <DataTable.Col source="yearMonth" />

            <DataTable.Col source="assetId">
                <ReferenceField source="assetId" reference="assets/assets" />
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
            <ReferenceField source="assetId" reference="assets/assets" />
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