/* Copyright (C) 2016 NooBaa */

import template from './edit-bucket-quota-modal.html';
import ConnectableViewModel from 'components/connectable';
import { deepFreeze, mapValues } from 'utils/core-utils';
import { getDataBreakdown, getQuotaSizeValue } from 'utils/bucket-utils';
import ko from 'knockout';
import { updateBucketQuotaPolicy, closeModal } from 'action-creators';
import {
    formatSize,
    toBytes,
    toBigInteger,
    fromBigInteger,
    unitsInBytes,
    isSizeZero
} from 'utils/size-utils';

const unitOptions = deepFreeze([
    {
        label: 'GB',
        value: 'GIGABYTE'
    },
    {
        label: 'TB',
        value: 'TERABYTE'
    },
    {
        label: 'PB',
        value: 'PETABYTE'
    }
]);

function _findMaxQuotaPossible(data) {
    const { PETABYTE, TERABYTE, GIGABYTE } = unitsInBytes;

    const { size, availableForUpload } = data;
    const total = toBigInteger(size).add(toBigInteger(availableForUpload));

    if (total.greaterOrEquals(PETABYTE)) {
        return {
            size: {
                value: fromBigInteger(total.divide(PETABYTE)),
                unit: 'PETABYTE'
            }
        };

    } else if (total.greaterOrEquals(TERABYTE)) {
        return {
            size: {
                value: fromBigInteger(total.divide(TERABYTE)),
                unit: 'TERABYTE'
            }
        };
    } else if (total.greaterOrEquals(GIGABYTE)) {
        return {
            size: {
                value: fromBigInteger(total.divide(GIGABYTE)),
                unit: 'GIGABYTE'
            }
        };

    } else {
        return {
            size: {
                value: 1,
                unit: 'GIGABYTE'
            }
        };
    }
}

function _getQuota(formValues, bucket) {
    if (formValues) {
        const size_value = Number.isInteger(formValues.size) ? Math.max(formValues.size, 0) : 0;
        const unit = formValues.unit;
        return { 
            size: {
                value: size_value, 
                unit: unit 
            }
        };

    } else {
        return bucket.quota && bucket.quota.size ? bucket.quota : _findMaxQuotaPossible(bucket.data);
    }
}

class EditBucketQuotaModalViewModel extends ConnectableViewModel {
    formName = this.constructor.name;
    unitOptions = unitOptions;
    bucketName = '';
    prevQuota = null;
    fields = ko.observable();
    bar = {
        values: [
            {
                label: 'Used Data',
                color: 'rgb(var(--color20))',
                value: ko.observable()
            },
            {
                label: 'Available',
                color: 'rgb(var(--color07))',
                value: ko.observable()
            },
            {
                label: 'Overallocated',
                color: 'rgb(var(--color31))',
                value: ko.observable(),
                visible: ko.observable()
            },
            {
                label: 'Overused',
                color: 'rgb(var(--color26))',
                value: ko.observable(),
                visible: ko.observable()
            },
            {
                label: 'Potential',
                color: 'rgb(var(--color07))',
                value: ko.observable(),
                visible: ko.observable()
            }
        ],
        markers: [
            {
                visible: ko.observable(),
                text: ko.observable(),
                position: 3
            }
        ]
    };

    selectState(state, params) {
        const { buckets, forms } = state;
        return [
            buckets && buckets[params.bucketName],
            forms[this.formName]
        ];
    }

    mapStateToProps(bucket, form) {
        if (!bucket) {
            return;
        }

        const formValues = form && mapValues(form.fields, field => field.value);
        const enabled = formValues ? formValues.enabled : Boolean(bucket.quota) && Boolean(bucket.quota.size);
        const quota = _getQuota(formValues, bucket);
        const breakdown = getDataBreakdown(bucket.data, enabled ? quota : undefined);

        ko.assignToProps(this, {
            bucketName: bucket.name,
            prevQuota: bucket.quota,
            bar: {
                values: [
                    {
                        value: toBytes(breakdown.used)
                    },
                    {
                        value: toBytes(breakdown.availableForUpload)
                    },
                    {
                        value: toBytes(breakdown.overallocated),
                        visible: !isSizeZero(breakdown.overallocated)
                    },
                    {
                        value: toBytes(breakdown.overused),
                        visible: !isSizeZero(breakdown.overused)
                    },
                    {
                        value: toBytes(breakdown.potentialForUpload),
                        visible: !isSizeZero(breakdown.potentialForUpload)
                    }
                ],
                markers: [
                    {
                        visible: enabled,
                        text: enabled ? `Quota: ${formatSize(getQuotaSizeValue(quota))}` : ''
                    }
                ]
            },
            fields: !form ? {
                enabled: enabled,
                unit: quota.size.unit,
                size: quota.size.value
            } : undefined
        });
    }

    onValidate(values) {
        const errors = {};
        const { size, enabled } = values;

        if (enabled && (!Number.isInteger(size) || size < 1)) {
            errors.size = 'Please enter an integer bigger or equal to 1';
        }

        return errors;
    }

    onSubmit(values) {
        const quota = values.enabled ?
            {
                size: {value: Number(values.size), unit: values.unit},
                quantity: this.prevQuota ? this.prevQuota.quantity : null
            } : null;

        this.dispatch(
            closeModal(),
            updateBucketQuotaPolicy(this.bucketName, quota)
        );
    }

    onCancel() {
        this.dispatch(closeModal());
    }
}

export default {
    viewModel: EditBucketQuotaModalViewModel,
    template: template
};
