import { DeserializedData, SerializedData } from "../utils/data-interface/message";
import { TypeSystem, TypeSysCommands as commands } from "../utils/type-system";


class MessagePack {
    private typesystem: TypeSystem;
    constructor() {
        this.typesystem = new TypeSystem();
    }

    pack(message: any): SerializedData {
        this.typesystem.handle(message, commands.pack);
        return this.typesystem.output;
    }

    unpack(packedMsg: SerializedData): DeserializedData {
        this.typesystem.handle(packedMsg, commands.unpack);
        return this.typesystem.output;
    }
}


export default MessagePack;
