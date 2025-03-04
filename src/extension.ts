import * as vscode from 'vscode';
import OpenAI from 'openai';

export function activate(context: vscode.ExtensionContext) {
    console.log('Trae Prompt Builder is now active!');

    const disposable = vscode.commands.registerCommand('trae-prompt-builder.generatePrompt', async () => {
        try {
            const config = vscode.workspace.getConfiguration('trae-prompt-builder');
            const apiKey = config.get<string>('openaiApiKey');

            if (!apiKey) {
                const setKey = 'Set API Key';
                const response = await vscode.window.showErrorMessage(
                    'OpenAI API Key is not configured. Please set it in settings.',
                    setKey
                );
                if (response === setKey) {
                    await vscode.commands.executeCommand('workbench.action.openSettings', 'trae-prompt-builder.openaiApiKey');
                }
                return;
            }

            const requirement = await vscode.window.showInputBox({
                prompt: '请输入您的需求描述 / Please enter your requirement description',
                placeHolder: '例如：开发一个Todo List应用 / e.g., Develop a Todo List application'
            });

            if (!requirement) {
                return;
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: '正在生成提示词 / Generating prompt...',
                cancellable: false
            }, async () => {
                const openai = new OpenAI({ apiKey });
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const titleKeywords = requirement.split(' ').slice(0, 3).join('-');
                const docTitle = `trae-prompt-${titleKeywords}-${timestamp}.md`;
                const uri = vscode.Uri.file(docTitle);
                await vscode.workspace.fs.writeFile(uri, Buffer.from(''));
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc);

                let content = '';
                const stream = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{
                        role: "system",
                        content: `请根据我的需求生成传递给AI编辑器的提示词，提示词需要清晰的扩展描述我的真实需求以及需求边界，确保AI编辑器能够根据提示词在无需提示的最大程度上自动生成整个项目的代码，提示词不宜过长也不宜出现具体的项目代码，以需求描述为主，不要涉及复杂高级的技术。`
                    }, {
                        role: "user",
                        content: requirement
                    }],
                    stream: true
                });

                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    return;
                }

                for await (const chunk of stream) {
                    const chunkContent = chunk.choices[0]?.delta?.content || '';
                    content += chunkContent;
                    await editor.edit(editBuilder => {
                        const document = editor.document;
                        const lastLine = document.lineAt(document.lineCount - 1);
                        const position = lastLine.range.end;
                        editBuilder.insert(position, chunkContent);
                    });
                }
            });

        } catch (error) {
            if (error instanceof Error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            } else {
                vscode.window.showErrorMessage('An unexpected error occurred');
            }
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
