import Formats from "../data-interface/formats";
import { TypesEnum } from "../data-interface/types";
import { formatedNumberBufferCreator, formatedStrBufferCreator } from "./buffer-creators";



class Serializer {
    private output: Buffer;

    serialize(data: any, type: TypesEnum): void {
        switch(type) {
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


    private serializeArray(arr: Array<any>): void {

    }



    static implementationMissingExcpt(type: never) {
        throw new Error(`serialization case for type ${type} is not implemented.`);
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
}

export default Serializer;
