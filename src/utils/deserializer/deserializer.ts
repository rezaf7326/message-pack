import { Formats, isFixedStr } from "../data-interface/formats";
import {
    SupportedTypes,
    type_array_formats,
    type_bool_formats,
    type_null_formats,
    type_number_formats,
    type_str_formats,
} from "../data-interface/types";
import { Convertor, numberConvertor, stringConvertor } from "./buffer-convertors";


class Deserializer {
    private output: SupportedTypes;
    private dataByteLength = 0;

    deserialize(buff: Buffer): void {
        const format = buff[0];

        switch(true) {
            case type_str_formats.includes(format):
                this.deserToStr(buff);
                break;
            case type_bool_formats.includes(format):
                this.deserToBool(buff);
                break;
            case type_null_formats.includes(format):
                this.set(null);
                this.dataByteLength = 1;
                break;
            case type_number_formats.includes(format):
                this.deserNumber(buff);
                break;
            case type_array_formats.includes(format):
                this.deserArray(buff);
        }
    }

    get(): SupportedTypes {
        return this.output;
    }

    getDataByteLength(): number {
        return this.dataByteLength;
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
        this.dataByteLength = convertor.byteLength;
    }


    private deserToBool(buff: Buffer): void {
        this.set(buff[0] === Formats.bool_true ? true : false);
        this.dataByteLength = 1;
    }


    private deserNumber(buff: Buffer): void {
        let format = buff[0];
        let convertor: Convertor = numberConvertor.get(format);

        this.set(convertor.convert(buff));
        this.dataByteLength = convertor.byteLength;
    }


    private deserArray(buff: Buffer): void {
        
    }
}

export default Deserializer;
