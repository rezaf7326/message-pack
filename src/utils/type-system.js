"use strict";
exports.__esModule = true;
var types_1 = require("./data-interface/types");
var serializer_1 = require("./serializer");
var deserializer_1 = require("./deserializer");
var TypeSystem = /** @class */ (function () {
    function TypeSystem() {
    }
    TypeSystem.prototype.serialize = function (message) {
        var serializer = new serializer_1["default"]();
        serializer.serialize(message, this.getType(message));
        return serializer.get();
    };
    TypeSystem.prototype.deserialize = function (packedMsg) {
        var deserializer = new deserializer_1["default"]();
        deserializer.deserialize(packedMsg);
        return deserializer.get();
    };
    TypeSystem.prototype.getType = function (obj) {
        if (this.isNumber(obj))
            return types_1.SerialTypeEnum.Number;
        if (this.isString(obj))
            return types_1.SerialTypeEnum.String;
        if (this.isBoolean(obj))
            return types_1.SerialTypeEnum.Boolean;
        TypeSystem.unSuppotedTypeExcpt(obj);
    };
    TypeSystem.prototype.isNumber = function (obj) {
        return obj instanceof Number;
    };
    TypeSystem.prototype.isString = function (obj) {
        return obj instanceof String;
    };
    TypeSystem.prototype.isBoolean = function (obj) {
        return obj instanceof Boolean;
    };
    TypeSystem.unSuppotedTypeExcpt = function (obj) {
        throw new Error("the type of the value of this object is not supported. object: " + obj);
    };
    return TypeSystem;
}());
exports["default"] = TypeSystem;
