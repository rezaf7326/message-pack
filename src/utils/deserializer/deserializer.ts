import { Formats, isFixedArray, isFixedStr, isNegFixedInt, isPosFixedInt } from "../data-interface/formats";
import {
    SupportedTypes,
    type_array_formats,
    type_bool_formats,
    type_null_formats,
    type_number_formats,
    type_str_formats,
} from "../data-interface/types";
import { arrayConvertor, Convertor, numberConvertor, stringConvertor } from "./buffer-convertors";


class Deserializer {
    private output: SupportedTypes;


    deserialize(buff: Buffer): void {
        const format = buff[0];

        switch(true) {
            case type_str_formats.includes(format)
                    || isFixedStr(format):
                this.deserToStr(buff);
                break;

            case type_bool_formats.includes(format):
                this.deserToBool(buff);
                break;

            case type_null_formats.includes(format):
                this.set(null);
                break;

            case type_number_formats.includes(format) 
                    || isPosFixedInt(format)
                    || isNegFixedInt(format):
                this.deserNumber(buff);
                break;

            case type_array_formats.includes(format)
                    || isFixedArray(format):
                this.deserArray(buff);
        }
    }


    get(): SupportedTypes {
        return this.output;
    }


    private set(value: SupportedTypes): void {
        this.output = value;
    }


    private deserToStr(buff: Buffer): void {
        let convertor: Convertor;

        isFixedStr(buff[0]) ?
            convertor = stringConvertor.get(Formats.fixstr) :
            convertor = stringConvertor.get(buff[0]);

        this.set(convertor.convert(buff));
    }


    private deserToBool(buff: Buffer): void {
        this.set(buff[0] === Formats.bool_true ? true : false);
    }


    private deserNumber(buff: Buffer): void {
        let format = buff[0];
        let convertor: Convertor;

        isPosFixedInt(format) ? 
            convertor = numberConvertor.get(Formats.positive_fixint) :
            isNegFixedInt(format) ? 
                convertor = numberConvertor.get(Formats.negative_fixint) :
                convertor = numberConvertor.get(format);

        this.set(convertor.convert(buff));
    }


    // deserialization of *Array-of-Arrays* is NOT supported
    private deserArray(buff: Buffer): void {
        let format = buff[0];
        let convertor: Convertor;
        
        isFixedArray(format) ? 
            convertor = arrayConvertor.get(Formats.fixarray) :
            convertor = arrayConvertor.get(format);
        
        this.set(convertor.convert(buff));
    }
}

export default Deserializer;
