import { 
    Formats, isFixedArray, isFixedMap, isFixedStr, isNegFixedInt, isPosFixedInt 
} from "../data-interface/formats";
import Serializer from "./serializer";

type BufferCreator = { create: () => Buffer };


// number of bytes for each format is less than it's limit: (num - 1)
const fixstr_bytes_limit: number = 32;
const str8_bytes_limit: number = Math.pow(2, 8);
const str16_bytes_limit: number = Math.pow(2, 16);
const str32_bytes_limit: number = Math.pow(2, 32);


function formatBuffer(format: Formats) {
    let formatBuff = Buffer.allocUnsafe(1);
    formatBuff.writeUInt8(format);

    return formatBuff;
}




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


function formatedStrBufferCreator(str: string): BufferCreator {
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





function getNumberFormatFamily(num: number): { format: Formats, bytes: number, 
        isSigned?: boolean, isFloat?: boolean } {

    if(!isValid()) Serializer.invalidNumberExcpt(num);
    if(isFixPos()) return { format: Formats.positive_fixint, bytes: 1 };
    if(isFixNeg()) return { format: Formats.negative_fixint, bytes: 1 };
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


    function isFixPos(): boolean {
        return !isFloat() && isPosFixedInt(num);
    }
    function isFixNeg(): boolean {
        return !isFloat() && isNegFixedInt(num);
    }
    function is8bitUint(): boolean {
        return !isNegative() && bitLength() <= 8;
    }
    function is8bitInt(): boolean {
        return isNegative() && bitLength() <= 8;
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
        return isFloat() && !isFloat32();
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




function getArrayFormatFamily(arrLength: number): { format: Formats, nByteLength: number } {
    if(isFixArray()) return { format: Formats.fixarray + arrLength, nByteLength: 0 };
    if(is16Array()) return { format: Formats.array_16, nByteLength: 2 };
    if(is32Array()) return { format: Formats.array_32, nByteLength: 4 };
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
    const creator = {
        create: function (): Buffer {
            let buffers: Buffer[] = [];
            let { format, nByteLength: nBytes } = getArrayFormatFamily(array.length);
            
            buffers.push(formatBuffer(format));
            if(!isFixedArray(format)) 
                buffers.push(nOfElementsBuffer(format, nBytes));

            for(let element of array) {
                let serializer = new Serializer();
                serializer.serialize(element);
                buffers.push(serializer.get());
            }

            return Buffer.concat(buffers);
        }
    }

    return creator;


    function nOfElementsBuffer(format: Formats, numByteLength: number): Buffer {
        let nOfElements = Buffer.allocUnsafe(numByteLength);
        
        if(format === Formats.array_16)
            nOfElements.writeUInt16BE(array.length);
        else
            if(format === Formats.array_32)
                nOfElements.writeUInt32BE(array.length);

        return nOfElements;
    }
}




function getMapFormatFamily(mapSize: number): { format: Formats, sizeByteLength: number } {
    if(isFixMap()) return { format: Formats.fixmap + mapSize, sizeByteLength: 0 };
    if(is16Map()) return { format: Formats.map_16, sizeByteLength: 2 };
    if(is32Map()) return { format: Formats.map_32, sizeByteLength: 4 };
    Serializer.mapSizeOutOfRange(mapSize);

    function isFixMap(): boolean {
        return mapSize < 16;
    }
    function is16Map(): boolean {
        return mapSize < Math.pow(2, 16);
    }
    function is32Map(): boolean {
        return mapSize < Math.pow(2, 32);
    }
}


function formatedMapBufferCreator(map: Map<any, any>): BufferCreator {
    const creator = {
        create: function() {
            let buffers: Buffer[] = [];
            let { format, sizeByteLength } = getMapFormatFamily(map.size);
            
            buffers.push(formatBuffer(format));
            if(!isFixedMap(format))
                buffers.push(numOfPairsBuffer(format, sizeByteLength));

            for(let [key, value] of map) {
                let keySerializer = new Serializer();
                let valSerializer = new Serializer();

                keySerializer.serialize(key);
                valSerializer.serialize(value);

                buffers.push(keySerializer.get());
                buffers.push(valSerializer.get());
            }

            return Buffer.concat(buffers);
        }
    }

    return creator;


    function numOfPairsBuffer(format: Formats, numByteLength: number): Buffer {
        let numOfPairs = Buffer.allocUnsafe(numByteLength);

        if(format === Formats.map_16)
            numOfPairs.writeUInt16BE(map.size);
        else
            if(format === Formats.map_32)
                numOfPairs.writeUInt32BE(map.size);

        return numOfPairs;
    }
}



export {
    formatedStrBufferCreator,
    formatedNumberBufferCreator,
    formatedArrayBufferCreator,
    formatedMapBufferCreator
}
