"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionGenerator = void 0;
const vscode = require("vscode");
const union_1 = require("./union");
class UnionGenerator {
    provideCodeActions(document, range, context, token) {
        const generateUnionClassAction = this.generateUnionClass(document, range);
        if (generateUnionClassAction == null) {
            return [];
        }
        return [
            generateUnionClassAction,
        ];
    }
    generateUnionClass(document, range) {
        var _a;
        const fix = new vscode.CodeAction(`Generate Union Class`, vscode.CodeActionKind.RefactorRewrite);
        fix.edit = new vscode.WorkspaceEdit();
        const dartCode = (_a = union_1.default.fromString(document.getText())) === null || _a === void 0 ? void 0 : _a.toDartCode();
        if (dartCode == null) {
            return null;
        }
        fix.edit.replace(document.uri, new vscode.Range(new vscode.Position((0), 0), new vscode.Position((document.lineCount + 1), 0)), dartCode);
        return fix;
    }
}
exports.UnionGenerator = UnionGenerator;
UnionGenerator.providedCodeActionKinds = [
    vscode.CodeActionKind.RefactorRewrite
];
//# sourceMappingURL=union_generator.js.map