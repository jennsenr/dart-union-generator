import * as vscode from 'vscode';
import { UnionGenerator } from './models/union_generator';



export function activate(context: vscode.ExtensionContext) {

  const actions = vscode.languages.registerCodeActionsProvider({
    language: 'dart',
    scheme: 'file'
  }, new UnionGenerator(), {
    providedCodeActionKinds: UnionGenerator.providedCodeActionKinds,
  })
  
	context.subscriptions.push(actions);
}

