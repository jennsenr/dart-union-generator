import * as vscode from 'vscode';
import Union from './union';

export class UnionGenerator implements vscode.CodeActionProvider {

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.CodeAction[]> {


    const generateUnionClassAction = this.generateUnionClass(document, range)

    if (generateUnionClassAction == null) {
      return []
    }

    return [
      generateUnionClassAction,
    ];
  }

  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.RefactorRewrite
  ];

  private generateUnionClass(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction | null {
    const fix = new vscode.CodeAction(`Generate Union Class`, vscode.CodeActionKind.RefactorRewrite)
    fix.edit = new vscode.WorkspaceEdit()
    const dartCode = Union.fromString(document.getText())?.toDartCode()

    if (dartCode == null) {
      return null
    }

    fix.edit.replace(document.uri, new vscode.Range(
      new vscode.Position((0), 0),
      new vscode.Position((document.lineCount + 1), 0),
    ), dartCode)

    return fix
  }

}
