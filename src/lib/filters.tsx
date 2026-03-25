import { SelectInput } from "ra-ui-materialui";

export const FlowFilters = [
    <SelectInput label="Flow Class" source="flowClass" choices={[
        { id: 'expense', name: 'expense' },
        { id: 'income', name: 'income' },
        { id: 'loan', name: 'loan' },
        { id: 'repayment', name: 'repayment' },
    ]} />
];