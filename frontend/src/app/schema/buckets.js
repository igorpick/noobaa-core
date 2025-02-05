/* Copyright (C) 2016 NooBaa */

const resiliencyMode = {
    type: 'string',
    enum: [
        'NOT_ENOUGH_RESOURCES',
        'POLICY_PARTIALLY_APPLIED',
        'RISKY_TOLERANCE',
        'DATA_ACTIVITY',
        'OPTIMAL'
    ]
};

const tierMode = {
    type: 'string',
    enum: [
        'NO_RESOURCES',
        'NOT_ENOUGH_RESOURCES',
        'NOT_ENOUGH_HEALTHY_RESOURCES',
        'INTERNAL_STORAGE_ISSUES',
        'NO_CAPACITY',
        'LOW_CAPACITY',
        'OPTIMAL'
    ]
};

export default {
    type: 'object',
    additionalProperties: {
        type: 'object',
        required: [
            'name',
            'mode',
            'storage',
            'data',
            'objects',
            'placement',
            'resiliency',
            'versioning',
            'io',
            'usageDistribution',
            'failureTolerance',
            'usageDistribution',
            'statsByDataType'
        ],
        properties: {
            name: {
                type: 'string'
            },
            mode: {
                type: 'string',
                enum: [
                    'NO_RESOURCES',
                    'NOT_ENOUGH_RESOURCES',
                    'NOT_ENOUGH_HEALTHY_RESOURCES',
                    'NO_CAPACITY',
                    'ALL_TIERS_HAVE_ISSUES',
                    'EXCEEDING_QUOTA',
                    'TIER_NO_RESOURCES',
                    'TIER_NOT_ENOUGH_RESOURCES',
                    'TIER_NOT_ENOUGH_HEALTHY_RESOURCES',
                    'TIER_NO_CAPACITY',
                    'LOW_CAPACITY',
                    'TIER_LOW_CAPACITY',
                    'NO_RESOURCES_INTERNAL',
                    'RISKY_TOLERANCE',
                    'APPROUCHING_QUOTA',
                    'DATA_ACTIVITY',
                    'OPTIMAL'
                ]
            },
            storage: {
                $ref: '#/def/common/storage'
            },
            data: {
                type: 'object',
                properties: {
                    lastUpdate: {
                        type: 'integer'
                    },
                    size: {
                        $ref: '#/def/common/size'
                    },
                    sizeReduced: {
                        $ref: '#/def/common/size'
                    },
                    availableForUpload: {
                        $ref: '#/def/common/size'
                    }
                }
            },
            objects: {
                type: 'object',
                properties: {
                    count: {
                        type: 'integer'
                    },
                    lastUpdate: {
                        type: 'integer'
                    }
                }
            },
            placement: {
                type: 'object',
                required: [
                    'tiers'
                ],
                properties: {
                    tiers: {
                        oneOf: [
                            {
                                type: 'array',
                                minItems: 1,
                                maxItems: 1,
                                items: {
                                    type: 'object',
                                    required: [
                                        'name',
                                        'mode',
                                        'policyType'
                                    ],
                                    properties: {
                                        name: {
                                            type: 'string'
                                        },
                                        mode: tierMode,
                                        policyType: {
                                            type: 'string',
                                            enum: [
                                                'INTERNAL_STORAGE'
                                            ]
                                        }
                                    }
                                }
                            },
                            {
                                type: 'array',
                                minItems: 1,
                                maxItems: 2,
                                items: {
                                    type: 'object',
                                    required: [
                                        'name',
                                        'mode',
                                        'policyType'
                                    ],
                                    properties: {
                                        name: {
                                            type: 'string'
                                        },
                                        mode: tierMode,
                                        policyType: {
                                            type: 'string',
                                            enum: [
                                                'MIRROR',
                                                'SPREAD'
                                            ]
                                        },
                                        mirrorSets: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                required: [
                                                    'name',
                                                    'resources'
                                                ],
                                                properties: {
                                                    name: {
                                                        type: 'string'
                                                    },
                                                    resources: {
                                                        type: 'array',
                                                        items: {
                                                            type: 'object',
                                                            required: [
                                                                'type',
                                                                'name'
                                                            ],
                                                            properties: {
                                                                type: {
                                                                    type: 'string',
                                                                    enum: [
                                                                        'HOSTS',
                                                                        'CLOUD'
                                                                    ]
                                                                },
                                                                name: {
                                                                    type: 'string'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            resiliency: {
                oneOf: [
                    {
                        type: 'object',
                        required: [
                            'mode',
                            'kind',
                            'replicas'
                        ],
                        properties: {
                            mode: resiliencyMode,
                            kind: {
                                const: 'REPLICATION'
                            },
                            replicas: {
                                type: 'integer'
                            }
                        }
                    },
                    {
                        type: 'object',
                        required: [
                            'mode',
                            'kind',
                            'dataFrags',
                            'parityFrags'
                        ],
                        properties: {
                            mode: resiliencyMode,
                            kind: {
                                const: 'ERASURE_CODING'
                            },
                            dataFrags: {
                                type: 'integer'
                            },
                            parityFrags: {
                                type: 'integer'
                            }
                        }
                    }
                ]
            },
            versioning: {
                type: 'object',
                required: [
                    'mode'
                ],
                properties: {
                    mode: {
                        type: 'string',
                        enum: [
                            'DISABLED',
                            'SUSPENDED',
                            'ENABLED'
                        ]
                    }
                }
            },
            io: {
                type: 'object',
                required: [
                    'readCount',
                    'writeCount',
                    'lastRead',
                    'lastWrite'
                ],
                properties: {
                    readCount: {
                        type: 'integer'
                    },
                    lastRead: {
                        type: 'integer'
                    },
                    writeCount: {
                        type: 'integer'
                    },
                    lastWrite: {
                        type: 'integer'
                    }
                }
            },
            quota: {
                type: 'object',
                required: [
                    'mode'
                ],
                properties: {
                    mode: {
                        type: 'string',
                        enum: [
                            'EXCEEDING_QUOTA',
                            'APPROUCHING_QUOTA',
                            'OPTIMAL'
                        ]
                    },
                    size: {
                        type: 'object',
                        required: ['value', 'unit'],
                        properties: {
                            value: {
                                type: 'integer'
                            },
                            unit: {
                                type: 'string',
                                //Based on https://github.com/kubernetes/apimachinery/blob/master/pkg/api/resource/quantity.go
                                enum: ['G', 'T', 'P', 'Gi', 'Ti', 'Pi']
                            }
                        }
                    },
                    quantity: {
                        type: 'object',
                        required: ['value'],
                        properties: {
                            value: {
                                type: 'integer'
                            }
                        }
                    }
                }
            },
            failureTolerance: {
                type: 'object',
                required: [
                    'hosts',
                    'nodes'
                ],
                properties: {
                    hosts: {
                        type: 'integer'
                    },
                    nodes: {
                        type: 'integer'
                    }
                }
            },
            usageDistribution: {
                type: 'object',
                required: [
                    'lastUpdate',
                    'resources'
                ],
                properties: {
                    lastUpdate: {
                        type: 'integer'
                    },
                    resources: {
                        type: 'object',
                        additionalProperties: {
                            type: 'integer'
                        }
                    }
                }
            },
            statsByDataType: {
                type: 'object',
                additionalProperties: {
                    type: 'object',
                    required: [
                        'reads',
                        'writes',
                        'size',
                        'count'
                    ],
                    properties: {
                        reads: {
                            type: 'integer'
                        },
                        writes: {
                            type: 'integer'
                        },
                        size: {
                            $ref: '#/def/common/size'
                        },
                        count: {
                            type: 'integer'
                        }
                    }
                }
            },
            undeletable: {
                type: 'string',
                enum: [
                    'NOT_EMPTY'
                ]
            }
        }
    }
};
