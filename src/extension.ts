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
                if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
                    vscode.window.showErrorMessage('请在工作区中使用此命令');
                    return;
                }
                const workspaceFolder = vscode.workspace.workspaceFolders[0];
                const docTitle = `trae-prompt-${titleKeywords}-${timestamp}.md`;
                const uri = vscode.Uri.joinPath(workspaceFolder.uri, docTitle);
                await vscode.workspace.fs.writeFile(uri, Buffer.from(''));
                const doc = await vscode.workspace.openTextDocument(uri);
                await vscode.window.showTextDocument(doc);

                let content = '';
                const techStack = config.get<string>('techStack', '');
                const techStackPrompt = techStack ? `，在存在同类技术选择时优先使用以下技术栈：${techStack}，但不要为使用而使用` : '';

                // 获取提示词模板
                const systemPromptTemplate = config.get<string>('systemPromptTemplate', '');
                const userPromptTemplate = config.get<string>('userPromptTemplate', '');

                // 替换模板变量
                const systemPrompt = systemPromptTemplate.replace('{{techStackPrompt}}', techStackPrompt);
                const userPrompt = userPromptTemplate.replace('{{requirement}}', requirement);

                const stream = await openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{
                        role: "system",
                        content: systemPrompt
                    }, {
                        role: "user",
                        content: userPrompt
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
