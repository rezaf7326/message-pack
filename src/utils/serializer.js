"use strict";
exports.__esModule = true;
var formats_1 = require("./data-interface/formats");
var types_1 = require("./data-interface/types");
// number of bytes for each format is less than it's limit: (num - 1)
var fixstr_bytes_limit = 32;
var str8_bytes_limit = Math.pow(2, 8);
var str16_bytes_limit = Math.pow(2, 16);
var str32_bytes_limit = Math.pow(2, 32);
function strByteLength(str) {
    // here I'm assuming utf8-encoding and 1-byte per character
    return str.length;
    // return Buffer.byteLength(str, 'utf8');
}
function getStrFormat(byteLength) {
    if (isFixStr())
        return formats_1["default"].fixstr;
    if (isStr8())
        return formats_1["default"].str_8;
    if (isStr16())
        return formats_1["default"].str_16;
    if (isStr32())
        return formats_1["default"].str_32;
    else
        Serializer.stringSizeOutOfRange(byteLength);
    function isFixStr() {
        return byteLength < fixstr_bytes_limit;
    }
    function isStr8() {
        return byteLength < str8_bytes_limit;
    }
    function isStr16() {
        return byteLength < str16_bytes_limit;
    }
    function isStr32() {
        return byteLength < str32_bytes_limit;
    }
}
function strToFormatedBuffer(str, format, length) {
    // alloc an extra byte for the format
    var formatedBuf = Buffer.allocUnsafe(length + 1);
    var strBuf = Buffer.from(str, 'utf8');
    formatedBuf[0] = format;
    strBuf.copy(formatedBuf, 1); // first byte keeps the format
    return formatedBuf;
}
var Serializer = /** @class */ (function () {
    function Serializer() {
    }
    Serializer.prototype.serialize = function (data, type) {
        switch (type) {
            case types_1.SerialTypeEnum.String:
                this.serializeString(data);
                break;
            case types_1.SerialTypeEnum.Boolean:
                this.serializeBool(data);
                break;
            case types_1.SerialTypeEnum.Null:
                this.serializeNull(data);
                break;
            case types_1.SerialTypeEnum.Number:
                this.serializeNumber(data);
                break;
            default:
                Serializer.implementationMissingExcpt(type);
        }
    };
    Serializer.prototype.get = function () {
        return this.output;
    };
    Serializer.prototype.set = function (output) {
        this.output = output;
    };
    Serializer.prototype.serializeString = function (str) {
        var length = strByteLength(str);
        var format = getStrFormat(length); // 
        this.set(strToFormatedBuffer(str, format, length));
    };
    Serializer.prototype.serializeBool = function (bool) {
        var buff = Buffer.allocUnsafe(1);
        bool ? buff.writeUInt8(formats_1["default"]["true"]) : buff.writeUInt8(formats_1["default"]["false"]);
        this.set(buff);
    };
    Serializer.prototype.serializeNull = function (nil) {
        var buff = Buffer.allocUnsafe(1);
        buff.writeUInt8(formats_1["default"].nil);
        this.set(buff);
    };
    Serializer.prototype.serializeNumber = function (num) {
        var buff = Buffer.allocUnsafe(1);
        this.set(buff);
        function isUint8(num) {
            return;
        }
    };
    Serializer.implementationMissingExcpt = function (type) {
        throw new Error("serialization case for type " + type + " is not implemented.");
    };
    Serializer.stringSizeOutOfRange = function (size) {
        throw new Error("the string size " + size + " is out of the supported range(upto 2^32 - 1).");
    };
    return Serializer;
}());
exports["default"] = Serializer;
