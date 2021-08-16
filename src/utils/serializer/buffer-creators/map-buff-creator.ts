import { Formats, isFixedMap } from "../../data-interface/formats";
import { BufferCreatorType, formatBuffer } from "./constants";
import Serializer from "./../serializer";


function getMapFormatFamily(mapSize: number): { format: Formats, sizeByteLength: number } {
    if(isFixMap()) return { format: Formats.fixmap + mapSize, sizeByteLength: 0 };
    if(is16Map()) return { format: Formats.map_16, sizeByteLength: 2 };
    if(is32Map()) return { format: Formats.map_32, sizeByteLength: 4 };
    Serializer.mapSizeOutOfRange(mapSize);

    function isFixMap(): boolean {
        return mapSize < 16;
    }
    function is16Map(): boolean {
        return mapSize < Math.pow(2, 16);
    }
    function is32Map(): boolean {
        return mapSize < Math.pow(2, 32);
    }
}


function formatedMapBufferCreator(map: Map<any, any>): BufferCreatorType {
    const creator = {
        create: function() {
            let buffers: Buffer[] = [];
            let { format, sizeByteLength } = getMapFormatFamily(map.size);
            
            buffers.push(formatBuffer(format));
            if(!isFixedMap(format))
                buffers.push(numOfPairsBuffer(format, sizeByteLength));

            for(let [key, value] of map) {
                let keySerializer = new Serializer();
                let valSerializer = new Serializer();

                keySerializer.serialize(key);
                valSerializer.serialize(value);

                buffers.push(keySerializer.get());
                buffers.push(valSerializer.get());
            }

            return Buffer.concat(buffers);
        }
    }

    return creator;


    function numOfPairsBuffer(format: Formats, numByteLength: number): Buffer {
        let numOfPairs = Buffer.allocUnsafe(numByteLength);

        if(format === Formats.map_16)
            numOfPairs.writeUInt16BE(map.size);
        else
            if(format === Formats.map_32)
                numOfPairs.writeUInt32BE(map.size);

        return numOfPairs;
    }
}



export { formatedMapBufferCreator };
