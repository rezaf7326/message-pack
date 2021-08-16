import { Formats, isNegFixedInt, isPosFixedInt } from "src/utils/data-interface/formats";
import Serializer from "../serializer";
import { BufferCreatorType } from "./constants";


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



function formatedNumberBufferCreator(num: number): BufferCreatorType {
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



export { formatedNumberBufferCreator };
