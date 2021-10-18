import { Formats } from "../../data-interface/formats";
import Deserializer from '../deserializer';
import { getBufferFirstElementLength } from "./constants";

const mapConvertor = new Map();


function extractMap(buff:Buffer, nOfPairs: number, offset: number): Map<any, any> {
    let map = new Map();
    let keyStart = offset;

    while(nOfPairs-- > 0) {
        let keyDeserializer = new Deserializer();
        let valDeserializer = new Deserializer();

        let valueStart = keyStart + getBufferFirstElementLength(buff.subarray(keyStart));
        let nextPair = valueStart + getBufferFirstElementLength(buff.subarray(valueStart));
        let key = buff.subarray(keyStart, valueStart);
        let value = buff.subarray(valueStart, nextPair);

        keyDeserializer.deserialize(key);
        valDeserializer.deserialize(value);
        map.set(keyDeserializer.get(), valDeserializer.get());

        keyStart = nextPair;
    }

    return map;
}


mapConvertor.set(Formats.fixmap, {
    convert: function(buff: Buffer) {
        let nOfPairs = buff[0] - Formats.fixmap;
        let start = 1;

        return extractMap(buff, nOfPairs, start);
    }
})

mapConvertor.set(Formats.map_16, {
    convert: function(buff: Buffer) {
        let nOfPairs = buff.readUInt16BE(1);
        let start = 3;

        return extractMap(buff, nOfPairs, start);
    }
})

mapConvertor.set(Formats.map_32, {
    convert: function(buff: Buffer) {
        let nOfPairs = buff.readUInt32BE(1);
        let start = 5;

        return extractMap(buff, nOfPairs, start);
    }
})



export { mapConvertor }
