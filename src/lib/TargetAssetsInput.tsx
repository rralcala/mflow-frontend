import { ReactNode } from 'react';
import {
    ReferenceInput
} from 'react-admin';

interface TargetAssetsInputProps {
    reference?: string;
    source: string;
    label?: string;
}

export const TargetAssetsInput = ({ 
    reference,
    source,
    label 
}: TargetAssetsInputProps ): ReactNode => {
    return <ReferenceInput
        label={label || "Target Asset"}
        source={source}
        reference={reference || "assets/assets"}
        filter={{ liquid: true }}
        sort={{ field: 'id', order: 'ASC' }}
    />;
}