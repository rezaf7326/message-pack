import { SupportedTypes as Types, TypesEnum } from "../utils/data-interface/types";
import Serializer from "../utils/serializer/serializer";
import Deserializer from '../utils/deserializer/deserializer';


class TypeSystem {

    serialize(message: Types): Buffer {
        let serializer = new Serializer();
        serializer.serialize(message, this.getType(message));
        return serializer.get();
    }

    deserialize(packedMsg: Buffer): Types {
        let deserializer = new Deserializer();
        deserializer.deserialize(packedMsg);
        return deserializer.get();
    }

    
    private getType(obj: Types) : TypesEnum {
        if(this.isNumber(obj)) return TypesEnum.Number;
        if(this.isString(obj)) return TypesEnum.String;
        if(this.isBoolean(obj)) return TypesEnum.Boolean;
        if(obj === null) return TypesEnum.Null;

        TypeSystem.unSuppotedTypeExcpt(obj);
    }

    private isNumber(value: Types): boolean {
        return (typeof value === "object" ? value instanceof Number : typeof value === "number");
    }
    
    private isString(value: Types): boolean {
        return (typeof value === "object" ? value instanceof String : typeof value === "string");
    }
    
    private isBoolean(value: Types): boolean {
        return (typeof value === "object" ? value instanceof Boolean : typeof value === "boolean");
    }

    
    static unSuppotedTypeExcpt(obj: any) {
        throw new Error(`the type of the value of this object is not supported. object type: ${typeof obj}`)
    }
}

export default TypeSystem;
