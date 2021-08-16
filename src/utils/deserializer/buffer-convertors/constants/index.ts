import { 
    Formats, isFixedStr, isNegFixedInt, isPosFixedInt 
} from "../../../data-interface/formats";

type ConvertorType = { convert: (buff: Buffer) => any | any[] };

function getBufferFirstElementLength(buff: Buffer): number {
    const dataLength = {
        [Formats.nil]: 1,
        [Formats.bool_true]: 1,
        [Formats.bool_false]: 1,
        [Formats.positive_fixint]: 1,
        [Formats.negative_fixint]: 1,
        [Formats.uint_8]: 2,
        [Formats.int_8]: 2,
        [Formats.uint_16]: 3,
        [Formats.int_16]: 3,
        [Formats.uint_32]: 5,
        [Formats.int_32]: 5,
        [Formats.float_32]: 5,
        [Formats.uint_64]: 9,
        [Formats.int_64]: 9,
        [Formats.float_64]: 9,
        [Formats.fixstr]: buff[0] - Formats.fixstr + 1,
        [Formats.str_8]: (() => {
            if(buff.length > 1) return buff.readUInt8(1) + 2;
        })(),
        [Formats.str_16]: (function() {
            if(buff.length > 2) return buff.readUInt16BE(1) + 3;
        })(),
        [Formats.str_32]: (function() {
            if(buff.length > 4) return buff.readUInt32BE(1) + 5;
        })(),

        // array-of-maps & array-of-arrays are not supported yet
        // [Formats.fixarray]: ,
        // [Formats.array_16]: ,
        // [Formats.array_32]: ,
        // [Formats.fixmap]: ,
        // [Formats.map_32]: ,
        // [Formats.map_16]: ,
    }

    function getFormat(): Formats {
        if(isPosFixedInt(buff[0])) return Formats.positive_fixint;
        if(isNegFixedInt(buff[0])) return Formats.negative_fixint;
        if(isFixedStr(buff[0])) return Formats.fixstr;
        // if(isFixedArray(buff[0])) return Formats.fixarray;
    
        return buff[0];
    }
    
    return dataLength[getFormat()];
}

export {
    ConvertorType, getBufferFirstElementLength
}
