import { Formats } from "../data-interface/formats";


type Convertor = { convert: (buff: Buffer) => any, byteLength: number };


const numberConvertor = new Map();
const stringConvertor = new Map();
const arrayConvertor = new Map();


numberConvertor.set(Formats.positive_fixint, {
        convert: function(buff: Buffer) {
            return buff.readUInt8(0);
        },
        byteLength: 1
    }
);

numberConvertor.set(Formats.negative_fixint, {
        convert: function(buff: Buffer) {
            return buff.readInt8(0);
        },
        byteLength: 1
    }
);

numberConvertor.set(Formats.uint_8, {
        convert: function(buff: Buffer) {
            return buff.readUInt8(1);
        },
        byteLength: 2
    }
);

numberConvertor.set(Formats.int_8, {
        convert: function(buff: Buffer) {
            return buff.readInt8(1);
        },
        byteLength: 2
    }
);

numberConvertor.set(Formats.uint_16, {
        convert: function(buff: Buffer) {
            return buff.readUInt16BE(1);
        },
        byteLength: 3
    }
);

numberConvertor.set(Formats.int_16, {
        convert: function(buff: Buffer) {
            return buff.readInt16BE(1);
        },
        byteLength: 3
    }
);

numberConvertor.set(Formats.uint_32, {
        convert: function(buff: Buffer) {
            return buff.readUInt32BE(1);
        },
        byteLength: 5
    }
);

numberConvertor.set(Formats.int_32, {
        convert: function(buff: Buffer) {
            return buff.readInt32BE(1);
        },
        byteLength: 5
    }
);

numberConvertor.set(Formats.float_32, {
        convert: function(buff: Buffer) {
            return buff.readFloatBE(1);
        },
        byteLength: 5
    }
);

numberConvertor.set(Formats.uint_64, {
        convert: function(buff: Buffer) {
            return Number(buff.readBigUInt64BE(1));
        },
        byteLength: 9
    }
);

numberConvertor.set(Formats.int_64, {
        convert: function(buff: Buffer) {
            return Number(buff.readBigInt64BE(1));
        },
        byteLength: 9
    }
);

numberConvertor.set(Formats.float_64, {
        convert: function(buff: Buffer) {
            return buff.readDoubleBE(1);
        },
        byteLength: 9
    }
);






stringConvertor.set(Formats.fixstr, (function() {
    let str = { length: 0 };

    return { 
        convert: function(buff: Buffer) {
            let outputStr = buff.subarray(1).toString();
            str.length = outputStr.length;
            return outputStr;
        }, 
        byteLength: str.length
    }
})());


stringConvertor.set(Formats.str_8, (function() {
    let str = { length: 0 };

    return { 
        convert: function(buff: Buffer) {
            str.length = buff.readUInt8(1);
            return buff.subarray(2, str.length + 2).toString();
        }, 
        byteLength: str.length
    }
})());


stringConvertor.set(Formats.str_16, (function() {
    let str = { length: 0 };

    return { 
        convert: function(buff: Buffer) {
            str.length = buff.readUInt16BE(1);
            return buff.subarray(3, str.length + 3).toString();
        }, 
        byteLength: str.length
    }
})());


stringConvertor.set(Formats.str_32, (function() {
    let str = { length: 0 };

    return { 
        convert: function(buff: Buffer) {
            str.length = buff.readUInt32BE(1);
            return buff.subarray(5, str.length + 5).toString();
        }, 
        byteLength: str.length
    }
})());







arrayConvertor.set(Formats.fixarray, {
        convert: function(buff: Buffer) {
            const numbOfElements = buff.readUInt8(1);
            const dataLength = buff.length - 2; // starts at index 2

        },
        byteLength: 0
    }
);

arrayConvertor.set(Formats.array_16, {
        convert: function(buff: Buffer) {
            
        },
        byteLength: 0
    }
);

arrayConvertor.set(Formats.array_32, {
        convert: function(buff: Buffer) {
            
        },
        byteLength: 0
    }
);





export {
    Convertor,
    numberConvertor,
    stringConvertor,
    arrayConvertor
}
