import { Formats } from "../data-interface/formats";
import { TypesEnum, SupportedTypes } from "../data-interface/types";
import { 
    formatedArrayBufferCreator, 
    formatedNumberBufferCreator, 
    formatedStrBufferCreator 
} from "./buffer-creators";


class Serializer {
    private output: Buffer;

    serialize(data: any): void {
        switch(this.getType(data)) {
            case TypesEnum.String:
                this.serializeString(data);
                break;
            case TypesEnum.Boolean:
                this.serializeBool(data);
                break;
            case TypesEnum.Null:
                this.serializeNull();    
                break;
            case TypesEnum.Number:
                this.serializeNumber(data);
                break;
            case TypesEnum.Array:
                this.serializeArray(data);
        }
    }
    
    get(): Buffer {
        return this.output;
    }

    private set(output: Buffer): void {
        this.output = output;
    }



    private serializeString(str: string): void {
        let buffCreator = formatedStrBufferCreator(str);

        this.set(buffCreator.create());
    }


    private serializeBool(bool: boolean): void {
        let buff = Buffer.allocUnsafe(1);
        bool ? buff.writeUInt8(Formats.bool_true) : buff.writeUInt8(Formats.bool_false);

        this.set(buff);
    }


    private serializeNull(): void {
        let buff = Buffer.allocUnsafe(1);
        buff.writeUInt8(Formats.nil);

        this.set(buff);
    }


    private serializeNumber(num: number): void {
        let buffCreator = formatedNumberBufferCreator(num);

        this.set(buffCreator.create());
    }


    private serializeArray(array: any[]): void {
        let buffCreator = formatedArrayBufferCreator(array);

        this.set(buffCreator.create());
    }


    private getType(obj: SupportedTypes) : TypesEnum {
        if(this.isNumber(obj)) return TypesEnum.Number;
        if(this.isString(obj)) return TypesEnum.String;
        if(this.isBoolean(obj)) return TypesEnum.Boolean;
        if(obj === null) return TypesEnum.Null;
        if(Array.isArray(obj)) return TypesEnum.Array;

        Serializer.unSuppotedTypeExcpt(obj);
    }

    private isNumber(value: SupportedTypes): boolean {
        return (typeof value === "object" ? value instanceof Number : typeof value === "number");
    }
    
    private isString(value: SupportedTypes): boolean {
        return (typeof value === "object" ? value instanceof String : typeof value === "string");
    }
    
    private isBoolean(value: SupportedTypes): boolean {
        return (typeof value === "object" ? value instanceof Boolean : typeof value === "boolean");
    }



    static unSuppotedTypeExcpt(obj: any) {
        throw new Error(`the type of the value of this object is not supported. object ${obj}`)
    }

    static stringSizeOutOfRange(size: number) {
        throw new Error(`the string size ${size} is out of the supported range(upto 2^32 - 1).`);
    }

    static unSupportedNumberExcpt(num: number) {
        throw new Error(
            `cannot serialize the number ${num}. it is because either the number
            is biger than 53 bits(max safe int) or the format is not supported.
            the only supported formats are:
            [float_32, float_64, positive_fixint, negative_fixint, uint_8, int_8,
            uint_16, int_16, uint_32, int_32, uint_64, int_64]`
        );
    }

    static invalidNumberExcpt(num: number) {
        throw new Error(`number ${num} is not valid. a NaN or an Infinity value is not allowed`);
    }

    static arrayLengthOutOfRange(arrayLength: number) {
        throw new Error(`array length ${arrayLength} is out of range`);
    }
}

export default Serializer;
