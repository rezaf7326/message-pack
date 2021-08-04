import { SupportedTypes as Types, SerialTypeEnum } from "./data-interface/types";
import Serializer from "./serializer";
import Deserializer from './deserializer';


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

    
    private getType(obj: Types) : SerialTypeEnum {
        if(this.isNumber(obj)) return SerialTypeEnum.Number;
        if(this.isString(obj)) return SerialTypeEnum.String;
        if(this.isBoolean(obj)) return SerialTypeEnum.Boolean;
        
        TypeSystem.unSuppotedTypeExcpt(obj);
    }

    private isNumber(obj: Types): boolean {
        return obj instanceof Number;
    }
    
    private isString(obj: Types): boolean {
        return obj instanceof String;
    }
    
    private isBoolean(obj: Types): boolean {
        return obj instanceof Boolean;
    }


    static unSuppotedTypeExcpt(obj: any) {
        throw new Error(`the type of the value of this object is not supported. object: ${obj}`)
    }
}

export default TypeSystem;
