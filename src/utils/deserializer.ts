import { SupportedTypes } from "./data-interface/types";

class Deserializer {
    private output: SupportedTypes;

    deserialize(packedMsg: Buffer): void {
        
    }

    get(): SupportedTypes {
        return this.output;
    }

    private convertFormatToType(): void {
        
    }
}


export default Deserializer;
