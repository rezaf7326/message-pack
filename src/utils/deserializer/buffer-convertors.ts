import { 
    Formats, isFixedStr, isNegFixedInt, isPosFixedInt 
} from "../data-interface/formats";
import Deserializer from './deserializer';


type Convertor = { convert: (buff: Buffer) => any | any[] };


const numberConvertor = new Map();
const stringConvertor = new Map();
const arrayConvertor = new Map();
const mapConvertor = new Map();


numberConvertor.set(Formats.positive_fixint, {
        convert: function(buff: Buffer) {
            return buff.readUInt8(0);
        },
    }
);

numberConvertor.set(Formats.negative_fixint, {
        convert: function(buff: Buffer) {
            return buff.readInt8(0);
        },
    }
);

numberConvertor.set(Formats.uint_8, {
        convert: function(buff: Buffer) {
            return buff.readUInt8(1);
        },
    }
);

numberConvertor.set(Formats.int_8, {
        convert: function(buff: Buffer) {
            return buff.readInt8(1);
        },
    }
);

numberConvertor.set(Formats.uint_16, {
        convert: function(buff: Buffer) {
            return buff.readUInt16BE(1);
        },
    }
);

numberConvertor.set(Formats.int_16, {
        convert: function(buff: Buffer) {
            return buff.readInt16BE(1);
        },
    }
);

numberConvertor.set(Formats.uint_32, {
        convert: function(buff: Buffer) {
            return buff.readUInt32BE(1);
        },
    }
);

numberConvertor.set(Formats.int_32, {
        convert: function(buff: Buffer) {
            return buff.readInt32BE(1);
        },
    }
);

numberConvertor.set(Formats.float_32, {
        convert: function(buff: Buffer) {
            return buff.readFloatBE(1);
        },
    }
);

numberConvertor.set(Formats.uint_64, {
        convert: function(buff: Buffer) {
            return Number(buff.readBigUInt64BE(1));
        },
    }
);

numberConvertor.set(Formats.int_64, {
        convert: function(buff: Buffer) {
            return Number(buff.readBigInt64BE(1));
        },
    }
);

numberConvertor.set(Formats.float_64, {
        convert: function(buff: Buffer) {
            return buff.readDoubleBE(1);
        },
    }
);






stringConvertor.set(Formats.fixstr, { 
        convert: function(buff: Buffer) {
            let outputStr = buff.subarray(1).toString();
            return outputStr;
        }, 
    }
);


stringConvertor.set(Formats.str_8, { 
        convert: function(buff: Buffer) {
            const strlength = buff.readUInt8(1);
            return buff.subarray(2, strlength + 2).toString();
        }, 
    }
);


stringConvertor.set(Formats.str_16, { 
        convert: function(buff: Buffer) {
            const strlength = buff.readUInt16BE(1);
            return buff.subarray(3, strlength + 3).toString();
        }, 
    }
);


stringConvertor.set(Formats.str_32, { 
        convert: function(buff: Buffer) {
            const strlength = buff.readUInt32BE(1);
            return buff.subarray(5, strlength + 5).toString();
        }, 
    }
);







function getNextElementLength(buff: Buffer): number {
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


function extractArray(buff: Buffer, nOfElements: number, offset: number = 1): any [] {
    let elements = [];
    let start = offset;
    while(nOfElements-- > 0) {
        let deserializer = new Deserializer();
        let next = start + getNextElementLength(buff.subarray(start));;
        let element = buff.subarray(start, next);
        
        deserializer.deserialize(element);
        elements.push(deserializer.get());
        start = next;
    }

    return elements;
}


arrayConvertor.set(Formats.fixarray, {
        convert: function(buff: Buffer) {
            let nOfElements = buff[0] - Formats.fixarray;
            let start = 1; // the first byte of the 'data'
            
            return extractArray(buff, nOfElements, start);
        },
    }
);

arrayConvertor.set(Formats.array_16, {
        convert: function(buff: Buffer) {
            let nOfElements = buff.readUInt16BE(1);
            let start = 3; // the first byte of the 'data'
            
            return extractArray(buff, nOfElements, start);
        },
    }
);

arrayConvertor.set(Formats.array_32, {
        convert: function(buff: Buffer) {
            let nOfElements = buff.readUInt32BE(1);;
            let start = 5; // the first byte of the 'data'
            
            return extractArray(buff, nOfElements, start);
        },
    }
);



export {
    Convertor,
    numberConvertor,
    stringConvertor,
    arrayConvertor
}
