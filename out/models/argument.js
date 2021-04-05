"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const string_extension_1 = require("../utils/string_extension");
class Argument {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
    static fromString(input) {
        const splitted = input.trim().split(' ');
        const type = splitted[0];
        const name = string_extension_1.toLowerFirstCase(splitted[1]);
        return new Argument(name, type);
    }
    toDartCode() {
        const dartCode = `${this.type} ${this.name}`;
        return dartCode;
    }
    toPropertyDartCode() {
        const dartCode = `final ${this.type} ${this.name};`;
        return dartCode;
    }
    toVariableDartCode() {
        const dartCode = `${this.name}`;
        return dartCode;
    }
    toThisVariableDartCode() {
        const dartCode = `this.${this.name}`;
        return dartCode;
    }
}
exports.default = Argument;
//# sourceMappingURL=argument.js.map