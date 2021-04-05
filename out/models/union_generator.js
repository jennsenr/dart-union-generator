"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionGenerator = void 0;
const vscode = require("vscode");
const union_1 = require("./union");
class UnionGenerator {
    provideCodeActions(document, range, context, token) {
        const unionClassGenerate = this.createFix(document, range);
        return [
            unionClassGenerate,
        ];
    }
    createFix(document, range) {
        var _a, _b;
        const fix = new vscode.CodeAction(`Generate Union Class`, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        const dartCode = (_b = (_a = union_1.default.fromString(document.getText())) === null || _a === void 0 ? void 0 : _a.toDartCode()) !== null && _b !== void 0 ? _b : document.getText();
        fix.edit.replace(document.uri, new vscode.Range(new vscode.Position((0), 0), new vscode.Position((100), 0)), dartCode);
        return fix;
    }
}
exports.UnionGenerator = UnionGenerator;
UnionGenerator.providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
];
//# sourceMappingURL=union_generator.js.map