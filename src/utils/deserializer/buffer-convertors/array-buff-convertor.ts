import Deserializer from '../deserializer';
import { Formats } from "../../data-interface/formats";
import { getBufferFirstElementLength } from "./constants";

const arrayConvertor = new Map();


function extractArray(buff: Buffer, nOfElements: number, offset: number = 1): any [] {
    let elements = [];
    let start = offset;
    while(nOfElements-- > 0) {
        let deserializer = new Deserializer();
        let next = start + getBufferFirstElementLength(buff.subarray(start));;
        let element = buff.subarray(start, next);
        
        deserializer.deserialize(element);
        elements.push(deserializer.get());
        start = next;
    }

    return elements;
}


arrayConvertor.set(Formats.fixarray, {
        convert: function(buff: Buffer) {
            let nOfElements = buff[0] - Formats.fixarray;
            let start = 1; // the first byte of the 'data'
            
            return extractArray(buff, nOfElements, start);
        },
    }
);

arrayConvertor.set(Formats.array_16, {
        convert: function(buff: Buffer) {
            let nOfElements = buff.readUInt16BE(1);
            let start = 3; // the first byte of the 'data'
            
            return extractArray(buff, nOfElements, start);
        },
    }
);

arrayConvertor.set(Formats.array_32, {
        convert: function(buff: Buffer) {
            let nOfElements = buff.readUInt32BE(1);
            let start = 5; // the first byte of the 'data'
            
            return extractArray(buff, nOfElements, start);
        },
    }
);


export { arrayConvertor };
