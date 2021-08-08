enum Formats {
    positive_fixint = 0x00, // 0x00 to 0x7f
    fixmap = 0x80, // 0x80 to 0x8f
    fixarray = 0x90, // 0x90 - 0x9f
    nil	= 0xc0,
    // (never used)	= 0xc1,
    bool_false = 0xc2,
    bool_true = 0xc3,
    // bin_8 = 0xc4,
    // bin_16 = 0xc5,
    // bin_32 = 0xc6,
    // ext_8 = 0xc7,
    // ext_16 = 0xc8,
    // ext_32 = 0xc9,
    float_32 = 0xca,
    float_64 = 0xcb,
    uint_8 = 0xcc,
    uint_16 = 0xcd,
    uint_32 = 0xce,
    uint_64 = 0xcf,
    int_8 = 0xd0,
    int_16 = 0xd1,
    int_32 = 0xd2,
    int_64 = 0xd3,
    // fixext_1 = 0xd4,
    // fixext_2 = 0xd5,
    // fixext_4 = 0xd6,
    // fixext_8 = 0xd7,
    // fixext_16 = 0xd8,
    fixstr = 0xa0, // 0xa0 to 0xbf
    str_8 = 0xd9,
    str_16 = 0xda,
    str_32 = 0xdb,
    array_16 = 0xdc,
    array_32 = 0xdd,
    map_16 = 0xde,
    map_32 = 0xdf,
    negative_fixint = 0xe0, // 0xe0 to 0xff
}


function isFixedStr(format: Formats): boolean {
    return isIn(format, 0xa0, 0xbf);
}

function isPosFixedInt(format: Formats): boolean {
    return isIn(format, 0x00, 0x7f);
}

function isNegFixedInt(format: Formats): boolean {
    return isIn(format, 0xe0, 0xff);
}

function isFixedArray(format: Formats): boolean {
    return isIn(format, 0x90, 0x9f);
}

function isFixedMap(format: Formats): boolean {
    return isIn(format, 0x80, 0x8f);
}

function isIn(format: Formats, min: number, max: number): boolean {
    return min <= format && format <= max;
}


export {
    Formats,
    isFixedStr,
    isPosFixedInt,
    isNegFixedInt,
    isFixedArray
};
