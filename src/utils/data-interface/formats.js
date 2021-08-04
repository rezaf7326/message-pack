"use strict";
exports.__esModule = true;
var Formats;
(function (Formats) {
    Formats[Formats["positive_fixint"] = 0] = "positive_fixint";
    Formats[Formats["fixmap"] = 128] = "fixmap";
    Formats[Formats["nil"] = 192] = "nil";
    // (never used)	= 0xc1,
    Formats[Formats["false"] = 194] = "false";
    Formats[Formats["true"] = 195] = "true";
    // bin_8 = 0xc4,
    // bin_16 = 0xc5,
    // bin_32 = 0xc6,
    // ext_8 = 0xc7,
    // ext_16 = 0xc8,
    // ext_32 = 0xc9,
    Formats[Formats["float_32"] = 202] = "float_32";
    Formats[Formats["float_64"] = 203] = "float_64";
    Formats[Formats["uint_8"] = 204] = "uint_8";
    Formats[Formats["uint_16"] = 205] = "uint_16";
    Formats[Formats["uint_32"] = 206] = "uint_32";
    Formats[Formats["uint_64"] = 207] = "uint_64";
    Formats[Formats["int_8"] = 208] = "int_8";
    Formats[Formats["int_16"] = 209] = "int_16";
    Formats[Formats["int_32"] = 210] = "int_32";
    Formats[Formats["int_64"] = 211] = "int_64";
    // fixext_1 = 0xd4,
    // fixext_2 = 0xd5,
    // fixext_4 = 0xd6,
    // fixext_8 = 0xd7,
    // fixext_16 = 0xd8,
    Formats[Formats["fixstr"] = 160] = "fixstr";
    Formats[Formats["str_8"] = 217] = "str_8";
    Formats[Formats["str_16"] = 218] = "str_16";
    Formats[Formats["str_32"] = 219] = "str_32";
    // array_16 = 0xdc,
    // array_32 = 0xdd,
    // map_16 = 0xde,
    // map_32 = 0xdf
    Formats[Formats["negative_fixint"] = 224] = "negative_fixint";
})(Formats || (Formats = {}));
exports["default"] = Formats;
