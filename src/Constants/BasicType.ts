export enum BasicType {
    BYTE           = 0x1400,
    UNSIGNED_BYTE  = 0x1401,
    SHORT          = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT            = 0x1404,
    UNSIGNED_INT   = 0x1405,
    FLOAT          = 0x1406
}

export enum AdvancedSingleTypes {
    UNSIGNED_SHORT_4_4_4_4         = 0x8033,
    UNSIGNED_SHORT_5_5_5_1         = 0x8034,
    UNSIGNED_SHORT_5_6_5           = 0x8363,
    HALF_FLOAT                     = 0x140B,
    UNSIGNED_INT_2_10_10_10_REV    = 0x8368,
    UNSIGNED_INT_10F_11F_11F_REV   = 0x8C3B,
    UNSIGNED_INT_5_9_9_9_REV       = 0x8C3E,
    FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD,
    UNSIGNED_INT_24_8              = 0x84FA
}

const componentTypeToTypedArrayMapping = new Map<BasicType, TypedArrayConstructor>([
    [BasicType.BYTE          , Int8Array   ],
    [BasicType.UNSIGNED_BYTE , Uint8Array  ],
    [BasicType.SHORT         , Int16Array  ],
    [BasicType.UNSIGNED_SHORT, Uint16Array ],
    [BasicType.INT           , Int32Array  ],
    [BasicType.UNSIGNED_INT  , Uint32Array ],
    [BasicType.FLOAT         , Float32Array]
]);

export function componentTypeToTypedArrayConstructor(type: BasicType): TypedArrayConstructor {
    return componentTypeToTypedArrayMapping.get(type);
}

const typedArrayToComponentTypeMapping = new Map<TypedArrayConstructor, BasicType>([
    [Int8Array   , BasicType.BYTE          ],
    [Uint8Array  , BasicType.UNSIGNED_BYTE ],
    [Int16Array  , BasicType.SHORT         ],
    [Uint16Array , BasicType.UNSIGNED_SHORT],
    [Int32Array  , BasicType.INT           ],
    [Uint32Array , BasicType.UNSIGNED_INT  ],
    [Float32Array, BasicType.FLOAT         ]
]);

export function typedArrayConstructorToComponentType(arrayConstructor: TypedArrayConstructor): BasicType {
    return typedArrayToComponentTypeMapping.get(arrayConstructor);
}

export function typedArrayToComponentType(array: TypedArray): BasicType {
    return typedArrayToComponentTypeMapping.get(array.constructor as TypedArrayConstructor);
}
