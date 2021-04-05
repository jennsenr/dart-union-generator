"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const union_generator_1 = require("./models/union_generator");
function activate(context) {
    const actions = vscode.languages.registerCodeActionsProvider({
        language: 'dart',
        scheme: 'file'
    }, new union_generator_1.UnionGenerator(), {
        providedCodeActionKinds: union_generator_1.UnionGenerator.providedCodeActionKinds,
    });
    context.subscriptions.push(actions);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map