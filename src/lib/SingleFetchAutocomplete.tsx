import { 
    useGetList, 
    AutocompleteInput, 
    RaRecord 
} from 'react-admin';

interface SingleFetchAutocompleteProps {
    reference: string;
    source: string;
    targetField?: string;
    label?: string;
}

export const SingleFetchAutocomplete = ({
    reference,
    source,
    targetField,
    label,
}: SingleFetchAutocompleteProps) => {
    const target = targetField || 'id';
    // Fetches the list once when the component mounts
    const { data: choices, isPending, error } = useGetList<RaRecord>(reference, {
        pagination: { page: 1, perPage: 1000 }, // Adjust perPage as needed
        sort: { field: target, order: 'ASC' },
    });

    if (isPending) 
        return <span>Loading choices...</span>;
    if (error) 
        return <span>Error loading options</span>;

    return <AutocompleteInput
            source={source}
            label={label}
            choices={choices}
            optionText={target}
            optionValue={target}
        />;
};