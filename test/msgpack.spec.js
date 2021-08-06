import { msgpack } from '../src/main/msgpack.ts';

describe('string packing/unpacking', () => {
    it("packs a string and expects it's packed buffer to be 1 byte longer", () => {
        // each character is assumed to be 1 byte
        let str = 'this is a string who wants to be packed into a byte array!';
        let buffer = msgpack.pack(str);
        expect(buffer.length).toBe(str.length + 1);
        // the buffer contains 1 more byte that keeps the format
    });

    it("packs a string, then unpacks it and expect to get the original string back", () => {
        let message = 'this is a string that is going to be packed and then unpacked.';
        let packedMsg =  msgpack.pack(message);
        let unpackedMsg = msgpack.unpack(packedMsg);
        expect(unpackedMsg).toMatch(message);
    });
});

describe('boolean packing/unpacking', () => {
    it('packs a "true" value and expects to get "true" when unpacks it', () => {
        let packedBool = msgpack.pack(true);
        expect(msgpack.unpack(packedBool)).toBe(true);
    });
    it('packs a "false" value and expects to get "false" when unpacks it', () => {
        let packedBool = msgpack.pack(false);
        expect(msgpack.unpack(packedBool)).toBe(false);
    });
});

describe('null packing/unpacking', () => {
    it('packs a null value and unpacks to get the null back', () => {
        let packedNil = msgpack.pack(null);
        expect(msgpack.unpack(packedNil)).toBe(null);
    })
})

describe.only('number packing/unpacking', () => {
    it.only("packs an POSITIVE fixint and checks if it gets unpacked correctly", () => {
        let packedFixInt = msgpack.pack(18); // 00010010 (7-bit: 0xxxxxxx)
        expect(msgpack.unpack(packedFixInt)).toBe(18);
    });

    it("packs an NEGATIVE fixint and checks if it gets unpacked correctly", () => {
        let packedFixInt = msgpack.pack(-31); // 11100001 (5-bit: 111xxxxx)
        expect(msgpack.unpack(packedFixInt)).toBe(-31);
    });
});
