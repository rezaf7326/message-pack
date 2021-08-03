import { SerializedData } from "./data-interface/message";

class Serializer {

    serialize(message: any): SerializedData {

        let packedMsg: SerializedData = {
            data: new ArrayBuffer(4) //fixme:
        } 

        return packedMsg;
    }
}

export default Serializer;
