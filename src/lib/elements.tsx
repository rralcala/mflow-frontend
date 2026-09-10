import { ReactNode } from 'react';
import {
    ReferenceInput
} from 'react-admin';

export function targetAssetsInput(): ReactNode {
    return <ReferenceInput
        label="Target Asset"
        source="targetAssetId"
        reference="assets/assets"
        filter={{ liquid: true }}
        sort={{ field: 'id', order: 'ASC' }}
    />
}