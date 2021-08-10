import { msgpack } from '../src/main/msgpack.ts';

describe('string packing/unpacking', () => {
    it("packs a fix-string and a str-8 then expects it's packed buffer to be 1 and 2 bytes longer", () => {
        // each character is assumed to be 1 byte
        let fixstr = 'a fix-str';
        let str8 = 'a str8 has a length of more than 31 bytes.';
        let fixstrBuff = msgpack.pack(fixstr);
        let str8Buff = msgpack.pack(str8);
        expect(fixstrBuff.length).toBe(fixstr.length + 1); // format
        expect(str8Buff.length).toBe(str8.length + 2); // format & length
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

describe('number packing/unpacking', () => {
    it("packs an POSITIVE fixint then checks if it gets unpacked correctly", () => {
        let packedFixInt = msgpack.pack(18); // 00010010 (7-bit: 0xxxxxxx)
        
        expect(msgpack.unpack(packedFixInt)).toBe(18);
    });

    it("packs an NEGATIVE fixint then checks if it gets unpacked correctly", () => {
        let packedFixInt = msgpack.pack(-31); // 11100001 (5-bit: 111xxxxx)
        expect(msgpack.unpack(packedFixInt)).toBe(-31);
    });

    it("packs & unpacks a bunch of 8/16/32/64-bit uint/int numbers and then validates the results", () => {
        let uint8 = 53;
        let int8 = -40;
        let uint16 = 457;
        let int16 = -360;
        let uint32 = 4294967290;
        let int32 = -2147483647;
        let uint64 = Number.MAX_SAFE_INTEGER;
        let int64 = -9496729554131;

        let numbers = [uint8, int8, uint16, int16, uint32, int32, uint64, int64];

        for(let number of numbers) {
            let packed = msgpack.pack(number);
            expect(msgpack.unpack(packed)).toBe(number);
        }
    });

    it("packs & unpacks a float 32 and a float 64 and asserts on the results", () => {
        let float32 = Math.fround(2.354);
        let float64 = 741123.1234624; //34624
        let packedF32 = msgpack.pack(float32);
        let packedF64 = msgpack.pack(float64);

        expect(msgpack.unpack(packedF32)).toBe(Math.fround(float32));
        expect(msgpack.unpack(packedF64)).toBe(Math.fround(float64));
    });
});


describe('array packing/unpacking', () => {
    it.only("pack & unpacks a fix-array of integers then asserts on the results", () => {
        let fixarray = [12, 2, 3, 4, 1738, -3, -256];
        let unpackedArr = msgpack.unpack(msgpack.pack(fixarray));
        
        for(let num of fixarray) 
            expect(unpackedArr).toContain(num);
    });

    // it("pack & unpacks --- then asserts on the results", () => {

    // });

    // it("pack & unpacks --- then asserts on the results", () => {

    // });
});
