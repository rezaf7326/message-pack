const { default: MessagePack } = require("./src/lib/msgpack");

const mp = new MessagePack();

let packedMsg = mp.pack("this is my goddamn message and i want it serialized immediately!");
console.log(packedMsg);

let orgMsg = mp.unpack(packedMsg);
console.log(orgMsg);
