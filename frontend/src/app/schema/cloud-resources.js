/* Copyright (C) 2016 NooBaa */

export default {
    type: 'object',
    additionalProperties: {
        type: 'object',
        required: [
            'name',
            'mode',
            'type',
            'endpoint',
            'target',
            'storage',
            'usedBy',
            'associatedAccounts',
            'createdBy',
            'creationTime',
            'internalHost',
            'io'
        ],
        properties: {
            name: {
                type: 'string'
            },
            mode: {
                type: 'string',
                enum: [
                    'OPTIMAL',
                    'INITIALIZING',
                    'IO_ERRORS',
                    'ALL_NODES_OFFLINE',
                    'STORAGE_NOT_EXIST',
                    'AUTH_FAILED'
                ]
            },
            type: {
                type: 'string',
                enum: [
                    //TODO Without AWSSTS option noobaa management console won't work
                    'AWSSTS',
                    'AWS',
                    'AZURE',
                    'S3_COMPATIBLE',
                    'GOOGLE',
                    'FLASHBLADE',
                    'NET_STORAGE',
                    'IBM_COS'
                ]
            },
            endpoint: {
                type: 'string'
            },
            target: {
                type: 'string'
            },
            storage: {
                $ref: '#/def/common/storage'
            },
            region: {
                type: 'string'
            },
            undeletable: {
                type: 'string',
                enum: [
                    'NOT_EMPTY',
                    'IN_USE',
                    'DEFAULT_RESOURCE',
                    'CONNECTED_BUCKET_DELETING',
                    'IS_BACKINGSTORE'
                ]
            },
            usedBy: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            associatedAccounts: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            createdBy: {
                type: 'string'
            },
            creationTime: {
                type: 'integer'
            },
            'internalHost': {
                type: 'string'
            },
            io: {
                type: 'object',
                requires: [
                    'readCount',
                    'readSize',
                    'writeCount',
                    'writeSize'
                ],
                properties: {
                    readCount: {
                        type: 'integer'
                    },
                    readSize: {
                        $ref: '#/def/common/size'
                    },
                    writeCount: {
                        type: 'integer'
                    },
                    writeSize: {
                        $ref: '#/def/common/size'
                    }
                }
            }
        }
    }
};
