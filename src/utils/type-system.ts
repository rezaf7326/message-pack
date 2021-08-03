import { DeserializedData, SerializedData } from "./data-interface/message";
import formats from "./data-interface/formats";
import types from "./data-interface/types";

enum TypeSysCommands {
    "pack", "unpack"
}

class TypeSystem {
    output: Readonly<DeserializedData | SerializedData>;

    handle(data: any, command: TypeSysCommands): void {
        
    }

    private convertTypeToFormat(): SerializedData {
        return ;
    }

    private convertFormatToType(): DeserializedData {
        
        return ;
    }

}

export {
    TypeSystem, 
    TypeSysCommands
};
