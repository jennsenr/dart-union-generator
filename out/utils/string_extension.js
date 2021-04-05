"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLowerFirstCase = exports.toUpperFirstCase = void 0;
function toUpperFirstCase(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
}
exports.toUpperFirstCase = toUpperFirstCase;
function toLowerFirstCase(input) {
    return input.charAt(0).toLowerCase() + input.slice(1);
}
exports.toLowerFirstCase = toLowerFirstCase;
//# sourceMappingURL=string_extension.js.map