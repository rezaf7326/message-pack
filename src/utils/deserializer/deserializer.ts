import Formats from "../data-interface/formats";
import {
    SupportedTypes,
    type_bool_formats,
    type_null_formats,
    type_str_formats,
} from "../data-interface/types";


class Deserializer {
    private output: SupportedTypes;

    deserialize(buff: Buffer): void {
        const format = buff[0];

        if(type_str_formats.includes(format)) this.deserToStr(buff);
        if(type_bool_formats.includes(format)) this.deserToBool(buff);
        if(type_null_formats.includes(format)) this.set(null);
    }

    get(): SupportedTypes {
        return this.output;
    }

    private set(value: SupportedTypes): void {
        this.output = value;
    }

    private deserToStr(buff: Buffer): void {
        this.set(buff.subarray(1).toString());
    }

    private deserToBool(buff: Buffer): void {
        this.set(buff[0] === Formats.bool_true ? true : false);
    }

}


export default Deserializer;
