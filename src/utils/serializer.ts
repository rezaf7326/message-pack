import Formats from "./data-interface/formats";
import { SupportedTypes as Types, SerialTypeEnum } from "./data-interface/types";

// number of bytes for each format is less than it's limit: (num - 1)
const fixstr_bytes_limit: number = 32;
const str8_bytes_limit: number = Math.pow(2, 8);
const str16_bytes_limit: number = Math.pow(2, 16);
const str32_bytes_limit: number = Math.pow(2, 32);


function strByteLength(str: string): number {
    // here I'm assuming utf8-encoding and 1-byte per character
    return str.length;
    // return Buffer.byteLength(str, 'utf8');
} 


function getStrFormat(byteLength: number): Formats {
    if(isFixStr()) return Formats.fixstr;
    if(isStr8()) return Formats.str_8;
    if(isStr16()) return Formats.str_16;
    if(isStr32()) return Formats.str_32;
    else Serializer.stringSizeOutOfRange(byteLength);

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


function strToFormatedBuffer(str: string, format: Formats, length: number): Buffer {
    // alloc an extra byte for the format
    let formatedBuf = Buffer.allocUnsafe(length + 1);
    const strBuf = Buffer.from(str, 'utf8');
    formatedBuf[0] = format;
    strBuf.copy(formatedBuf, 1); // first byte keeps the format
    
    return formatedBuf;
}



class Serializer {
    private output: Buffer;

    serialize(data: any, type: SerialTypeEnum): void {
        switch(type) {
            case SerialTypeEnum.String:
                this.serializeString(data);
                break;
            case SerialTypeEnum.Boolean:
                this.serializeBool(data);
                break;
            case SerialTypeEnum.Null:
                this.serializeNull(data);    
                break;
            case SerialTypeEnum.Number:
                this.serializeNumber(data);
                break;
            default:
                Serializer.implementationMissingExcpt(type); 
        }
    }

    get(): Buffer {
        return this.output;
    }

    private set(output: Buffer): void {
        this.output = output;
    } 

    private serializeString(str: string): void {
        const length = strByteLength(str);
        const format = getStrFormat(length); // 

        this.set(strToFormatedBuffer(str, format, length));
    }


    private serializeBool(bool: boolean): void {
        let buff = Buffer.allocUnsafe(1);
        bool ? buff.writeUInt8(Formats.true) : buff.writeUInt8(Formats.false);

        this.set(buff);
    }


    private serializeNull(nil: null): void {
        let buff = Buffer.allocUnsafe(1);
        buff.writeUInt8(Formats.nil);

        this.set(buff);
    }


    private serializeNumber(num: number): void {
        let buff = Buffer.allocUnsafe(1);
        

        this.set(buff);

        function isUint8(num: number): boolean {
            
            return ;
        }
    } 


    static implementationMissingExcpt(type: never) {
        throw new Error(`serialization case for type ${type} is not implemented.`);
    }

    static stringSizeOutOfRange(size: number) {
        throw new Error(`the string size ${size} is out of the supported range(upto 2^32 - 1).`);
    }
}

export default Serializer;
