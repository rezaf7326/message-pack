// const { default: MessagePack } = require("./src/lib/msgpack");

// const mp = new MessagePack();

// let packedMsg = mp.pack("this is my goddamn message and i want it serialized immediately!");
// console.log(packedMsg);

// let orgMsg = mp.unpack(packedMsg);
// console.log(orgMsg);

let obj = new String("sdh ash", 'utf16')
// let obj = new Number(3)
// console.log(typeof obj)
// console.log(obj instanceof String)
// console.log(obj instanceof Number)
// console.log(obj instanceof Symbol)
// console.log(obj instanceof Boolean)
// console.log(typeof obj.valueOf(), obj.valueOf(), Buffer.byteLength(obj.valueOf(), 'utf8'))

console.log(Buffer.from(obj));
// console.log(Buffer.byteLength(obj.charCodeAt(1)));
// console.log(Buffer.byteLength(obj.charAt(1)));
