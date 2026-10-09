import {
  BooleanField,
  BooleanInput,
  Create,
  DataTable,
  DateField,
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
import { ClearableDateInput, TargetAssetsInput } from "./lib";

const TransferInputs = () => (
  <>
    <ClearableDateInput
      source="transferBy"
      label="Transfer By"
      helperText="Simulations move the whole balance into the target pool on this date."
    />
    <TargetAssetsInput source="targetAssetId" label="Target Pool" />
  </>
);

export const AccountList = () => (
  <List perPage={25} title="Cash Accounts">
    <DataTable>
      <DataTable.Col source="id" />
      <DataTable.Col source="accountType" />
      <DataTable.Col source="institution" />
      <DataTable.Col source="country" />

      <DataTable.NumberCol
        source="balance"
        options={{
          style: "decimal",
          useGrouping: true,
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }}
      />
      <DataTable.Col source="currency" />
      <DataTable.Col source="liquid">
        <BooleanField source="liquid" />
      </DataTable.Col>
      <DataTable.NumberCol source="factor" />
      <DataTable.Col source="transferBy" label="Transfer By">
        <DateField source="transferBy" />
      </DataTable.Col>
      <DataTable.Col source="targetAssetId" label="Target Pool">
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

export const AccountShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="accountType" />
      <TextField source="country" />
      <TextField source="institution" />
      <NumberField source="factor" />
      <Typography color="textSecondary">{"Value"}</Typography>
      <Stack direction="row" sx={{ alignItems: "flex-start" }} spacing={1}>
        <NumberField
          source="balance"
          options={{
            style: "decimal",
            useGrouping: true,
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }}
        />
        <TextField source="currency" />
      </Stack>
      <BooleanField source="liquid" />
      <DateField source="transferBy" label="Transfer By" />
      <ReferenceField
        source="targetAssetId"
        reference="assets/assets"
        label="Target Pool"
      />
    </SimpleShowLayout>
  </Show>
);

export const AccountEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <NumberInput source="balance" />
      <TextInput source="accountType" />
      <TextInput source="country" />
      <TextInput source="currency" />
      <TextInput source="institution" />
      <NumberInput source="factor" />
      <BooleanInput source="liquid" />
      <TransferInputs />
    </SimpleForm>
  </Edit>
);

export const AccountCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="country" />
      <TextInput source="institution" />
      <TextInput source="accountType" />
      <TextInput source="currency" />
      <NumberInput source="factor" />
      <NumberInput source="balance" />
      <BooleanInput source="liquid" />
      <TransferInputs />
    </SimpleForm>
  </Create>
);
