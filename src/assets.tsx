import { BooleanField, DataTable, List, NumberField, Pagination, Show, SimpleShowLayout, TextField  } from 'react-admin';
import { Stack, Typography } from '@mui/material';

const PostPagination = () => <Pagination rowsPerPageOptions={[10, 25, 50, 100, 200]} />;

export const AssetList = () => (
    <List perPage={200} pagination={<PostPagination />}>
        <DataTable>
            <DataTable.Col source="id" />
            <DataTable.Col source="type" />
            <DataTable.NumberCol source="currentValue" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                }}/>
            <DataTable.Col source="currency" />
            <DataTable.Col source="liquid">
                <BooleanField source="liquid" />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const AssetShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id"/>
            <TextField source="type" />
            <TextField source="currency" />
            <Typography color="textSecondary">{'Value'}</Typography>
            <Stack direction="row" alignItems="left" spacing={1}>
                <NumberField source="currentValue" options={{
                    style: 'decimal',
                    useGrouping: true,
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2,
                }}/>
                <TextField source="currency" />
            </Stack>
            <BooleanField source="liquid" />
            <TextField source="details" />
        </SimpleShowLayout>
    </Show>
);