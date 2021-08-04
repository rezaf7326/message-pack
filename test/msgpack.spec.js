const MessagePack = require('../src/lib/msgpack');


describe('string packing/unpacking tests', () => {
    
    let msgpack;

    beforeEach(() => msgpack = new MessagePack());

    it('packs a string and expects a buffer with the same length', () => {
        // each character is assumed to be 1 byte
        let str = 'this is a string who wants to be packed into a byte array!';
        let buffer = msgpack.pack(str);
        expect(buffer.length).to.eq(str.length);
    });
});
