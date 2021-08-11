import { 
    Formats, isFixedArray, isFixedMap, isFixedStr, isNegFixedInt, isPosFixedInt 
} from "../data-interface/formats";
import {
    SupportedTypes,
    type_array_formats,
    type_bool_formats,
    type_map_formats,
    type_null_formats,
    type_number_formats,
    type_str_formats,
} from "../data-interface/types";
import { 
    arrayConvertor, 
    Convertor, 
    mapConvertor, 
    numberConvertor, 
    stringConvertor 
} from "./buffer-convertors";


function isString(format: Formats): boolean {
    return type_str_formats.includes(format) || isFixedStr(format);
}

function isBool(format: Formats): boolean {
    return type_bool_formats.includes(format);
}

function isNull(format: Formats): boolean {
    return type_null_formats.includes(format)
}

function isNumber(format: Formats): boolean {
    return type_number_formats.includes(format) || isPosFixedInt(format) || isNegFixedInt(format);
}

function isArray(format: Formats): boolean {
    return type_array_formats.includes(format) || isFixedArray(format);
}

function isMap(format: Formats): boolean {
    return type_map_formats.includes(format) || isFixedMap(format);
}


class Deserializer {
    private output: SupportedTypes;

    deserialize(buff: Buffer): void {
        const format = buff[0];

        switch(true) {
            case isString(format):
                this.deserToStr(buff);
                break;
            case isBool(format):
                this.deserToBool(buff);
                break;
            case isNull(format):
                this.set(null);
                break;
            case isNumber(format):
                this.deserNumber(buff);
                break;
            case isArray(format):
                this.deserArray(buff);
                break;
            case isMap(format):
                this.deserMap(buff);
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


    // deserialization of *Array-of-Maps* or *Array-of-Arrays* is NOT supported yet
    private deserArray(buff: Buffer): void {
        let format = buff[0];
        let convertor: Convertor;
        
        isFixedArray(format) ? 
            convertor = arrayConvertor.get(Formats.fixarray) :
            convertor = arrayConvertor.get(format);
        
        this.set(convertor.convert(buff));
    }


    // deserialization of *Map-of-Arrays* or *Map-of-Maps* is NOT supported yet
    private deserMap(buff: Buffer): void {
        let format = buff[0];
        let convertor: Convertor;
        
        isFixedMap(format) ? 
            convertor = mapConvertor.get(Formats.fixmap) :
            convertor = mapConvertor.get(format);
        
        this.set(convertor.convert(buff));
    }
}

export default Deserializer;
