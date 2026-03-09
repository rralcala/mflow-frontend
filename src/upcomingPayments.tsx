import { 
    BooleanField,
    DataTable,
    DateField,
    List,
    NumberField,
    ReferenceField,
    Show,
    SimpleShowLayout,
    TextField
} from 'react-admin';

export const UpcomingpaymentList = () => (
    <List  sort={{ field: 'date', order: 'ASC' }}  perPage={25}>
        <DataTable>
            <DataTable.Col source="date">
                <DateField source="date" />
            </DataTable.Col>
            <DataTable.Col source="country" />
            
            <DataTable.Col source="assetId">
                <ReferenceField source="assetId" reference="assets" />
            </DataTable.Col>
            <DataTable.NumberCol source="amount" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }}/>
            <DataTable.Col source="currency" />
        </DataTable>
    </List>
);

export const UpcomingpaymentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="country" />
            <ReferenceField source="assetId" reference="assets" />
            <NumberField source="amount" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }}/>
            <BooleanField source="capital" />
            <TextField source="currency" />
            <DateField source="date" />
        </SimpleShowLayout>
    </Show>
);