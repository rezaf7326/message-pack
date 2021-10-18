import { Formats } from "../../../data-interface/formats";

type BufferCreatorType = { create: () => Buffer };

function formatBuffer(format: Formats): Buffer {
    let formatBuff = Buffer.allocUnsafe(1);
    formatBuff.writeUInt8(format);

    return formatBuff;
}


export {
    formatBuffer,
    BufferCreatorType,
}
