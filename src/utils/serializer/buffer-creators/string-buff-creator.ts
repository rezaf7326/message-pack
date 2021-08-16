import { Formats, isFixedStr } from "src/utils/data-interface/formats";
import Serializer from "../serializer";
import { BufferCreatorType, formatBuffer } from "./constants";


// number of bytes for each format is less than it's limit: (num - 1)
const fixstr_bytes_limit: number = 32;
const str8_bytes_limit: number = Math.pow(2, 8);
const str16_bytes_limit: number = Math.pow(2, 16);
const str32_bytes_limit: number = Math.pow(2, 32);


function getStrFormatFamily(strLength: number): { format: Formats } {
    if(isFixStr()) return { format: Formats.fixstr + strLength };
    if(isStr8()) return { format: Formats.str_8 };
    if(isStr16()) return { format: Formats.str_16 };
    if(isStr32()) return { format: Formats.str_32 };
    Serializer.stringSizeOutOfRange(strLength);

    function isFixStr(): boolean {
        return strLength < fixstr_bytes_limit;
    }
    function isStr8(): boolean {
        return strLength < str8_bytes_limit;
    }
    function isStr16(): boolean {
        return strLength < str16_bytes_limit;
    }
    function isStr32(): boolean {
        return strLength < str32_bytes_limit;
    }
}


function formatedStrBufferCreator(str: string): BufferCreatorType {
    // here I'm assuming utf8-encoding and 1-byte per character
    // an alternative to Buffer.byteLength(str, 'utf8')
    let { format } = getStrFormatFamily(str.length);
    let nChars: Buffer;

    switch(format) {
        case Formats.str_8:
            nChars = Buffer.allocUnsafe(1);
            nChars.writeUInt8(str.length);
            break;
        case Formats.str_16:
            nChars = Buffer.allocUnsafe(2);
            nChars.writeUInt16BE(str.length);
            break;
        case Formats.str_32:
            nChars = Buffer.allocUnsafe(4);
            nChars.writeUInt32BE(str.length);
    }

    const creator = {
        create: function(): Buffer {
            // an extra byte for the format
            const strBuf = Buffer.from(str, 'utf8');
            
            return isFixedStr(format) ?
                Buffer.concat([formatBuffer(format), strBuf]) :
                Buffer.concat([formatBuffer(format), nChars, strBuf]);
        }
    };

    return creator;
}

export { formatedStrBufferCreator };
