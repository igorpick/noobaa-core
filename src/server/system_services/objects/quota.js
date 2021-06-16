/* Copyright (C) 2021 NooBaa */
/* eslint max-lines: ['error', 2500] */

/**
 * Quota wrapper class represents bucket quota configuration and related methods
 */
'use strict';

const size_utils = require('../../../util/size_utils');
const _ = require('lodash');


class Quota {
    //private parameter quota size config
    #size

    //private parameter quota quantity config
    #quantity

    /**
     * @param {any} quota_config - bucket quota configuration object
     */
    constructor(quota_config) {
        if (!quota_config) throw new Error('Quota config is null');

        this.#size = quota_config.size;
        if (this.#size && this.#size.raw_value == null) {
            this.#size.raw_value = size_utils.size_unit_to_bigint(this.#size.value, this.#size.unit).toJSON();
        }

        this.quantity = quota_config.quantity;
        if (this.#quantity && this.#quantity.raw_value == null) {
            this.#quantity.raw_value = size_utils.quantity_to_bigint(this.#quantity.value, this.#quantity.unit).toJSON();
        } 
    }

    /**
     * @returns size value getter
     */
    get size_value() {
        return this.#size == null ? 0 : this.#size.value;
    }

    /**
     * @returns size unit getter
     */
    get size_unit() {
        return this.#size == null ? null : this.#size.unit;
    }

    /**
     * @returns quantity value getter
     */
    get quantity_value() {
        return this.#quantity == null ? 0 : this.#quantity.value;
    }

    /**
     * @returns quantity unit getter
     */
     get quantity_unit() {
        return this.#quantity == null ? null : this.#quantity.unit;
    }

    /**
     * 
     * @returns calculated bigint size raw value of quota
     */
    get_quota_size_raw_value() {
        return this.#size == null ? 0 : this.#size.raw_value;
    }

    /**
     * 
     * @returns calculated bigint quantity raw value of quota
     */
    get_quota_quantity_raw_value() {
        return this.#quantity == null ? 0 : this.#quantity.raw_value;
    }

    /**
     * 
     * @returns - new quota config object without raw values
     */
    get_config() {
        const config = {}
        if (this.#size && this.#size !== null) {
            config.size = _.omit(this.#size, 'raw_value');
        }
        if (this.#quantity && this.#quantity !== null) {
            config.quatity = _.omit(this.#quantity, 'raw_value');
        }
        return config;
    }

}

module.exports = Quota