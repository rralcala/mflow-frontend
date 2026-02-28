import { DataTable, List, NumberField, Pagination, Show, SimpleShowLayout, TextField  } from 'react-admin';

const PostPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 200]} />;

export const AssetList = () => (
    <List perPage={200} pagination={<PostPagination />}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="type" />
            <DataTable.NumberCol source="currentValue" />
            <DataTable.Col source="currency" />
        </DataTable>
    </List>
);

export const AssetShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id"/>
            <TextField source="type" />
            <TextField source="currency" />
            <NumberField source="currentValue" />
        </SimpleShowLayout>
    </Show>
);