import { Formats } from "../../data-interface/formats";

const numberConvertor = new Map();


numberConvertor.set(Formats.positive_fixint, {
    convert: function(buff: Buffer) {
        return buff.readUInt8(0);
    },
}
);

numberConvertor.set(Formats.negative_fixint, {
    convert: function(buff: Buffer) {
        return buff.readInt8(0);
    },
}
);

numberConvertor.set(Formats.uint_8, {
    convert: function(buff: Buffer) {
        return buff.readUInt8(1);
    },
}
);

numberConvertor.set(Formats.int_8, {
    convert: function(buff: Buffer) {
        return buff.readInt8(1);
    },
}
);

numberConvertor.set(Formats.uint_16, {
    convert: function(buff: Buffer) {
        return buff.readUInt16BE(1);
    },
}
);

numberConvertor.set(Formats.int_16, {
    convert: function(buff: Buffer) {
        return buff.readInt16BE(1);
    },
}
);

numberConvertor.set(Formats.uint_32, {
    convert: function(buff: Buffer) {
        return buff.readUInt32BE(1);
    },
}
);

numberConvertor.set(Formats.int_32, {
    convert: function(buff: Buffer) {
        return buff.readInt32BE(1);
    },
}
);

numberConvertor.set(Formats.float_32, {
    convert: function(buff: Buffer) {
        return buff.readFloatBE(1);
    },
}
);

numberConvertor.set(Formats.uint_64, {
    convert: function(buff: Buffer) {
        return Number(buff.readBigUInt64BE(1));
    },
}
);

numberConvertor.set(Formats.int_64, {
    convert: function(buff: Buffer) {
        return Number(buff.readBigInt64BE(1));
    },
}
);

numberConvertor.set(Formats.float_64, {
    convert: function(buff: Buffer) {
        return buff.readDoubleBE(1);
    },
}
);


export { numberConvertor }
