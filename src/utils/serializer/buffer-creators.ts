import { 
    Formats, isFixedArray, isFixedStr, isNegFixedInt 
} from "../data-interface/formats";
import Serializer from "./serializer";

type BufferCreator = { create: () => Buffer };


// number of bytes for each format is less than it's limit: (num - 1)
const fixstr_bytes_limit: number = 32;
const str8_bytes_limit: number = Math.pow(2, 8);
const str16_bytes_limit: number = Math.pow(2, 16);
const str32_bytes_limit: number = Math.pow(2, 32);


function getStrFormatFamily(byteLength: number): { format: Formats } {
    if(isFixStr()) return { format: Formats.fixstr };
    if(isStr8()) return { format: Formats.str_8 };
    if(isStr16()) return { format: Formats.str_16 };
    if(isStr32()) return { format: Formats.str_32 };
    Serializer.stringSizeOutOfRange(byteLength);

    function isFixStr(): boolean {
        return byteLength < fixstr_bytes_limit;
    }
    function isStr8(): boolean {
        return byteLength < str8_bytes_limit;
    }
    function isStr16(): boolean {
        return byteLength < str16_bytes_limit;
    }
    function isStr32(): boolean {
        return byteLength < str32_bytes_limit;
    }
}


function formatedStrBufferCreator(str: string): BufferCreator {
    // here I'm assuming utf8-encoding and 1-byte per character
    // an alternative to Buffer.byteLength(str, 'utf8')
    let { format } = getStrFormatFamily(str.length);
    let nChars: Buffer;

    switch(format) {
        case Formats.fixstr:
            format = format + str.length;
            break;
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
            const formatBuf = Buffer.allocUnsafe(1);
            formatBuf.writeUInt8(format);
            
            return isFixedStr(format) ?
                Buffer.concat([formatBuf, strBuf]) :
                Buffer.concat([formatBuf, nChars, strBuf]);
        }
    };

    return creator;
}





function getNumberFormatFamily(num: number): { format: Formats, bytes: number, isSigned?: boolean, isFloat?: boolean } {
    if(!isValid()) Serializer.invalidNumberExcpt(num);
    if(isPositiveFix()) return { format: Formats.positive_fixint, bytes: 1 };
    if(isNegativeFix()) return { format: Formats.negative_fixint, bytes: 1 };
    if(is8bitUint()) return { format: Formats.uint_8, bytes: 2 };
    if(is8bitInt()) return { format: Formats.int_8, bytes: 2 , isSigned: true };
    if(is16bitUint()) return { format: Formats.uint_16, bytes: 3 };
    if(is16bitInt()) return { format: Formats.int_16, bytes: 3 , isSigned: true };
    if(isFloat32()) return { format: Formats.float_32, bytes: 5, isFloat: true };
    if(is32bitUint()) return { format: Formats.uint_32, bytes: 5 };
    if(is32bitInt()) return { format: Formats.int_32, bytes: 5 , isSigned: true };
    if(isFloat64()) return { format: Formats.float_64, bytes: 9, isFloat: true };
    if(is64bitUint()) return { format: Formats.uint_64, bytes: 9 };
    if(is64bitInt()) return { format: Formats.int_64, bytes: 9 , isSigned: true };
    Serializer.unSupportedNumberExcpt(num);


    function isPositiveFix(): boolean {
        return !isNegative() && bitLength() < 8; // -1 < num < 128;
    }
    function isNegativeFix(): boolean {
        return isNegative() && bitLength() < 6; // -32 < num < 0
    }
    function is8bitUint(): boolean {
        return !isNegative() && bitLength() === 8;
    }
    function is8bitInt(): boolean {
        return isNegative() && bitLength() === 8;
    }
    function is16bitUint(): boolean {
        return !isNegative() && isBitLengthIn(9, 16);
    }
    function is16bitInt(): boolean {
        return isNegative() && isBitLengthIn(9, 16);
    }
    function isFloat32(): boolean {
        return isFloat() && isFinite(Math.fround(num));
    }    
    function is32bitUint(): boolean {
        return !isNegative() && isBitLengthIn(17, 32);
    }
    function is32bitInt(): boolean {
        return isNegative() && isBitLengthIn(17, 32);
    }
    function isFloat64(): boolean {
        return isFloat() && !isFinite(Math.fround(num));
    }
    function is64bitUint(): boolean {
        return !isNegative() && 32 < bitLength();
    }
    function is64bitInt(): boolean {
        return isNegative() && 32 < bitLength();
    }

    function bitLength(): number {
        // length of a binary string of the number: 2 -> "10", -7 -> "-111"
        return !isNegative() ? num.toString(2).length : num.toString(2).length - 1;
    }
    function isBitLengthIn(min: number, max: number): boolean {
        let bits = bitLength();
        return min <= bits && bits <= max;
    }
    function isNegative(): boolean {
        return num < 0;
    }
    function isFloat(): boolean {
        return !!(num % 1);
    }
    function isValid(): boolean {
        return !isNaN(num) && isFinite(num);
    }
}


function formatedNumberBufferCreator(num: number): BufferCreator {
    const { format, bytes, isSigned, isFloat } = getNumberFormatFamily(num);
    let buff = Buffer.allocUnsafe(bytes);

    if(bytes > 1) buff[0] = format;

    switch(bytes) {
        case 1: 
            isNegFixedInt(format) ? buff.writeInt8(num) : buff.writeUInt8(num);
            break;
        case 2:
            isSigned ? buff.writeInt8(num, 1) : buff.writeUInt8(num, 1);
            break;
        case 3:
            isSigned ? buff.writeInt16BE(num, 1) : buff.writeUInt16BE(num, 1);
            break;
        case 5:
            isFloat ? buff.writeFloatBE(num, 1) :
                isSigned ? buff.writeInt32BE(num, 1) : 
                    buff.writeUInt32BE(num, 1);
            break;
        case 9:
            let bigInt = BigInt(num);
            isFloat ? buff.writeDoubleBE(num, 1) : 
                isSigned ? buff.writeBigInt64BE(bigInt, 1) :
                    buff.writeBigUInt64BE(bigInt, 1);
            break;
    }
    
    const creator = {
        create: function (): Buffer {
            return buff;
        }
    }

    return creator;
}




function getArrayFormatFamily(arrLength: number): { format: Formats } {
    if(isFixArray()) return { format: Formats.fixarray };
    if(is16Array()) return { format: Formats.array_16 };
    if(is32Array()) return { format: Formats.array_32 };
    Serializer.arrayLengthOutOfRange(arrLength);

    function isFixArray(): boolean {
        return arrLength < 16;
    }
    function is16Array(): boolean {
        return arrLength < Math.pow(2, 16);
    }
    function is32Array(): boolean {
        return arrLength < Math.pow(2, 32);
    }
}


function formatedArrayBufferCreator(array: any[]): BufferCreator {
    let { format } = getArrayFormatFamily(array.length);
    let numOfElements: Buffer;

    switch(format) {
        case Formats.fixarray:
            format = format + array.length;
            break;
        case Formats.array_16:
            numOfElements = Buffer.allocUnsafe(2);
            numOfElements.writeUInt16BE(array.length);
            break;    
        case Formats.array_32:        
            numOfElements = Buffer.allocUnsafe(4);
            numOfElements.writeUInt32BE(array.length);
    }


    const creator = {
        create: function (): Buffer {
            let buffFormat = Buffer.allocUnsafe(1);
            buffFormat.writeUInt8(format);
            
            let buffers: Buffer[] = [];
            buffers.push(buffFormat);
            if(!isFixedArray(format)) buffers.push(numOfElements);

            for(let element of array) {
                let serializer = new Serializer();
                serializer.serialize(element);
                buffers.push(serializer.get());
            }

            return Buffer.concat(buffers);
        }
    }

    return creator;
}




export {
    formatedStrBufferCreator,
    formatedNumberBufferCreator,
    formatedArrayBufferCreator
}
