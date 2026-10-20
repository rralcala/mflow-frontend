import { SelectInput } from "ra-ui-materialui";
import { FLOW_CLASS_CHOICES } from "./flowClasses";

export const FlowFilters = [
  <SelectInput
    key="flowClassFilter"
    label="Flow Class"
    source="flowClass"
    choices={FLOW_CLASS_CHOICES}
  />,
];
