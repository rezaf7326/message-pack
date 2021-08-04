import { SupportedTypes } from "../utils/data-interface/types";
import TypeSystem from "../utils/type-system";


class MessagePack {
    private typesystem: TypeSystem;
    constructor() {
        this.typesystem = new TypeSystem();
    }

    pack(message: SupportedTypes): Buffer {
        return this.typesystem.serialize(message);
    }

    unpack(packedMsg: Buffer): SupportedTypes {
        return this.typesystem.deserialize(packedMsg);
    }
}


export default MessagePack;
