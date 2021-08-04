"use strict";
exports.__esModule = true;
var type_system_1 = require("../utils/type-system");
var MessagePack = /** @class */ (function () {
    function MessagePack() {
        this.typesystem = new type_system_1["default"]();
    }
    MessagePack.prototype.pack = function (message) {
        return this.typesystem.serialize(message);
    };
    MessagePack.prototype.unpack = function (packedMsg) {
        return this.typesystem.deserialize(packedMsg);
    };
    return MessagePack;
}());
exports["default"] = MessagePack;
