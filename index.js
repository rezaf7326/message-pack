import { msgpack } from './src/main/msgpack';

// let buf = Buffer.from('sasd');
// console.log(buf.toString('utf8'))

// console.log(Math.log2(127))
// console.log(Math.log2(128))
// console.log(Math.log2(10))
// console.log(Math.log2(7))
// console.log(Math.log2(-31))
// console.log(Math.log2(1))

// console.log((-31).toString(2).length - 1)
// console.log((3.234) % 1 === 0)
// console.log((3) % 1)

// var bigNum = 2 ** 150;
// console.log(Math.fround(bigNum * -1).toString())
// console.log(Math.fround(bigNum).toString().includes('Infinity'))

// console.log(typeof ('NaN' % 1), ('NaN' % 1).toString())
// console.log(typeof Math.fround(bigNum * -1), Math.fround(bigNum * -1).toString())
// console.log(typeof Math.fround(bigNum), Math.fround(bigNum).toString())
// console.log(typeof Math.fround(3.5), Math.fround(3.5).toString())
// console.log(typeof 4, (4).toString())

// console.log(Number(('NaN' % 1)) === ('NaN' % 1))
// console.log(Number(Math.fround(bigNum * -1)) === Math.fround(bigNum * -1))
// console.log(Number(Math.fround(bigNum)) === Math.fround(bigNum))


// console.log('is float', 3, !!(3 % 1))
// console.log('is float', 3.1, !!(3.1 % 1))
// console.log(Infinity instanceof Number)
// console.log((-0) < (0))



// console.log(isFinite(NaN))

// const buf = Buffer.allocUnsafe(2);

// buf.writeInt8(2, 0);
// buf.writeInt8(-2, 1);
// const b = Buffer.from([-31])

// console.log(b.readInt8(0));



// function A() {
//     let m = 'org';

//     function c() {
//         console.log('in c', m);
//     }
//     function b() {
//         c();
//         let a = new A();
//         a.c();
//         a.setM('new message');
//         a.c();
//         c();
//     }
//     function setM(message) {
//         m = message;
//     }

//     return {
//         b: b,
//         c: c,
//         setM: setM
//     }
// }


// let buff = Buffer.allocUnsafe(2);
// let format = Buffer.allocUnsafe(1);

// format.writeUInt8(2);
// buff.writeUInt16BE(260);

// console.log(Buffer.concat([format, buff]))

// let packedFixInt = msgpack.pack(18); // 00010010 (7-bit: 0xxxxxxx)
// console.log(packedFixInt);
// console.log('desers to:', msgpack.unpack(packedFixInt));
