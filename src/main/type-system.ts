import { SupportedTypes as Types } from "../utils/data-interface/types";
import Serializer from "../utils/serializer/serializer";
import Deserializer from '../utils/deserializer/deserializer';

class TypeSystem {
    serialize(message: Types): Buffer {
        let serializer = new Serializer();
        serializer.serialize(message);
        return serializer.get();
    }

    deserialize(packedMsg: Buffer): Types {
        let deserializer = new Deserializer();
        deserializer.deserialize(packedMsg);
        return deserializer.get();
    }
}

export default TypeSystem;
