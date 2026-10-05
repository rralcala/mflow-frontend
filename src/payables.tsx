import {
  BooleanField,
  BooleanInput,
  Create,
  DataTable,
  DateField,
  DateInput,
  Edit,
  EditButton,
  List,
  NumberField,
  NumberInput,
  ReferenceField,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
} from "react-admin";
import { Stack, Typography } from "@mui/material";
import { FlowFilters, TargetAssetsInput } from "./lib";

export const PayableList = () => (
  <List filters={FlowFilters} title="Single Payables">
    <DataTable>
      <DataTable.Col source="country" />
      <DataTable.Col source="description" />
      <DataTable.Col source="dueDate">
        <DateField source="dueDate" />
      </DataTable.Col>

      <DataTable.NumberCol source="amount" />
      <DataTable.NumberCol source="balance" />
      <DataTable.Col source="currency" />

      <DataTable.Col source="commited">
        <BooleanField source="commited" />
      </DataTable.Col>
      <DataTable.Col source="oneOff">
        <BooleanField source="oneOff" />
      </DataTable.Col>
      <DataTable.Col source="flowClass" />
      <DataTable.Col source="targetAssetId">
        <ReferenceField
          source="targetAssetId"
          reference="assets/assets"
          link="show"
        />
      </DataTable.Col>
      <DataTable.Col>
        <EditButton />
      </DataTable.Col>
    </DataTable>
  </List>
);

export const PayableShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="description" />
      <DateField source="dueDate" />
      <Typography color="textSecondary">{"Amount"}</Typography>
      <Stack direction="row" sx={{ alignItems: "flex-start" }} spacing={1}>
        <NumberField
          source="amount"
          options={{
            style: "decimal",
            useGrouping: true,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }}
        />
        <TextField source="currency" />
      </Stack>
      <Typography color="textSecondary">{"Balance"}</Typography>
      <Stack direction="row" sx={{ alignItems: "flex-start" }} spacing={1}>
        <NumberField
          source="balance"
          options={{
            style: "decimal",
            useGrouping: true,
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }}
        />
        <TextField source="currency" />
      </Stack>
      <TextField source="country" />
      <BooleanField source="commited" />
      <BooleanField source="oneOff" />
      <TextField source="flowClass" />
      <ReferenceField
        source="targetAssetId"
        reference="assets/assets"
        label="Target Asset"
      />
    </SimpleShowLayout>
  </Show>
);

export const PayableEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="country" />
      <TextInput source="description" />
      <NumberInput source="amount" />
      <NumberInput source="balance" />
      <TextInput source="currency" />
      <DateInput source="dueDate" />
      <BooleanInput source="commited" />
      <BooleanInput source="oneOff" />
      <TextInput source="flowClass" />
      <TargetAssetsInput source="targetAssetId" />
      <TextInput source="id" disabled />
    </SimpleForm>
  </Edit>
);

export const PayableCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="country" />
      <TextInput source="description" />
      <NumberInput source="amount" />
      <NumberInput source="balance" />
      <TextInput source="currency" />
      <DateInput source="dueDate" />
      <BooleanInput source="commited" />
      <BooleanInput source="oneOff" />
      <TextInput source="flowClass" />
      <TargetAssetsInput source="targetAssetId" />
    </SimpleForm>
  </Create>
);
