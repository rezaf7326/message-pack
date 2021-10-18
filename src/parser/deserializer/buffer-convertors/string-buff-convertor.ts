import { Formats  } from "../../data-interface/formats";

const stringConvertor = new Map();


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


export { stringConvertor };
