import { DataTable, List } from 'react-admin';

export const ExchangerateList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.NumberCol source="rate" 
                options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                }}/>
        </DataTable>
    </List>
);