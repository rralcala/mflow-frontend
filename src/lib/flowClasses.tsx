import { SelectInput } from "react-admin";

// Mirrors FLOW_CLASSES in mflow/data/constants.py; the backend rejects others.
export const FLOW_CLASSES = [
  "expense",
  "income",
  "loan",
  "repayment",
  "transfer",
];

export const FLOW_CLASS_CHOICES = FLOW_CLASSES.map((value) => ({
  id: value,
  name: value,
}));

export const FlowClassInput = () => (
  <SelectInput source="flowClass" choices={FLOW_CLASS_CHOICES} />
);
