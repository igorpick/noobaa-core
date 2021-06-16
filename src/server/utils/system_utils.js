/* Copyright (C) 2016 NooBaa */
'use strict';

const size_utils = require('../../util/size_utils');
const system_store = require('../system_services/system_store').get_instance();

function system_in_maintenance(system_id) {
    const system = system_store.data.get_by_id(system_id);

    if (!system) {
        // we don't want to throw here because callers will handle system deletion
        // on their own paths, and not as exception from here which.
        return false;
    }

    if (system.maintenance_mode &&
        system.maintenance_mode > Date.now()) {
        return true;
    }

    return false;
}


// returns the percent of quota used by the bucket
function get_bucket_quota_usage_percent(bucket, bucket_quota) {
    if (!bucket_quota) return 0;

    const bucket_used = bucket.storage_stats && size_utils.json_to_bigint(bucket.storage_stats.objects_size);
    const quota = size_utils.json_to_bigint(bucket_quota.size.raw_value);
    let used_percent = bucket_used.multiply(100).divide(quota);
    return used_percent.valueOf();
}

/* returns the percent of quantity quota used by the bucket. 
   FIXME: remove  get_bucket_quota_usage_percent method and improve implementation */
function get_bucket_quota_usages_percent(bucket, bucket_quota) {
    var usage = {
        size_used_percent: 0,
        quantity_used_percent: 0
    };
    if (!bucket_quota) return usage;

    const objects_size = bucket.storage_stats && size_utils.json_to_bigint(bucket.storage_stats.objects_size);
    const size_quota = size_utils.json_to_bigint(bucket_quota.get_quota_size_raw_value());
    if (size_quota > 0) {
        usage.size_used_percent = objects_size.multiply(100).divide(size_quota).valueOf();
    }

    const objects_count = bucket.storage_stats && size_utils.json_to_bigint(bucket.storage_stats.objects_count);
    const quantity_quota = size_utils.json_to_bigint(bucket_quota.get_quota_quantity_raw_value());
    if (quantity_quota > 0) {
        usage.quantity_used_percent = objects_count.multiply(100).divide(quantity_quota).valueOf();
    }

    return usage;
}


exports.system_in_maintenance = system_in_maintenance;
exports.get_bucket_quota_usage_percent = get_bucket_quota_usage_percent;
exports.get_bucket_quota_usages_percent = get_bucket_quota_usages_percent;
