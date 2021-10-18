import { Formats, isFixedArray } from "src/utils/data-interface/formats";
import Serializer from "../serializer";
import { BufferCreatorType, formatBuffer } from "./constants";


function getArrayFormatFamily(arrLength: number): { format: Formats, nByteLength: number } {
    if(isFixArray()) return { format: Formats.fixarray + arrLength, nByteLength: 0 };
    if(is16Array()) return { format: Formats.array_16, nByteLength: 2 };
    if(is32Array()) return { format: Formats.array_32, nByteLength: 4 };
    Serializer.arrayLengthOutOfRange(arrLength);

    function isFixArray(): boolean {
        return arrLength < 16;
    }
    function is16Array(): boolean {
        return arrLength < Math.pow(2, 16);
    }
    function is32Array(): boolean {
        return arrLength < Math.pow(2, 32);
    }
}



function formatedArrayBufferCreator(array: any[]): BufferCreatorType {
    const creator = {
        create: function (): Buffer {
            let buffers: Buffer[] = [];
            let { format, nByteLength: nBytes } = getArrayFormatFamily(array.length);
            
            buffers.push(formatBuffer(format));
            if(!isFixedArray(format)) 
                buffers.push(nOfElementsBuffer(format, nBytes));

            for(let element of array) {
                let serializer = new Serializer();
                serializer.serialize(element);
                buffers.push(serializer.get());
            }

            return Buffer.concat(buffers);
        }
    }

    return creator;

    function nOfElementsBuffer(format: Formats, numByteLength: number): Buffer {
        let nOfElements = Buffer.allocUnsafe(numByteLength);
        
        if(format === Formats.array_16)
            nOfElements.writeUInt16BE(array.length);
        else
            if(format === Formats.array_32)
                nOfElements.writeUInt32BE(array.length);

        return nOfElements;
    }
}



export { formatedArrayBufferCreator };
