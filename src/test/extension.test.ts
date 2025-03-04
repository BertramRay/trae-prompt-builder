import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

suite('Extension Test Suite', () => {
    let tempWorkspaceDir: string;

    suiteSetup(async () => {
        // 创建临时工作区
        tempWorkspaceDir = path.join(os.tmpdir(), `test-workspace-${Math.random().toString(36).substring(7)}`);
        fs.mkdirSync(tempWorkspaceDir, { recursive: true });
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(tempWorkspaceDir));
        
        // 等待扩展激活
        await vscode.extensions.getExtension('your-publisher.trae-prompt-builder')?.activate();
    });

    suiteTeardown(() => {
        // 清理临时工作区
        if (tempWorkspaceDir && fs.existsSync(tempWorkspaceDir)) {
            fs.rmSync(tempWorkspaceDir, { recursive: true, force: true });
        }
    });

    test('检查API密钥配置', async () => {
        const config = vscode.workspace.getConfiguration('trae-prompt-builder');
        await config.update('openaiApiKey', '', vscode.ConfigurationTarget.Global);
        const apiKey = config.get<string>('openaiApiKey');
        assert.strictEqual(apiKey, '');
    });

    test('生成提示词命令是否注册', async () => {
        const commands = await vscode.commands.getCommands(true);
        assert.ok(commands.includes('trae-prompt-builder.generatePrompt'), '命令未注册');
    });

    test('工作区文件操作', async () => {
        assert.ok(vscode.workspace.workspaceFolders, '没有打开的工作区');
        const workspaceFolder = vscode.workspace.workspaceFolders[0];
        const testFilePath = path.join(workspaceFolder.uri.fsPath, 'test-prompt.md');
        const testFileUri = vscode.Uri.file(testFilePath);

        try {
            await vscode.workspace.fs.writeFile(testFileUri, Buffer.from('test content'));
            const fileContent = await vscode.workspace.fs.readFile(testFileUri);
            assert.strictEqual(Buffer.from(fileContent).toString(), 'test content');
        } finally {
            try {
                await vscode.workspace.fs.delete(testFileUri);
            } catch (error) {
                console.error('清理测试文件失败:', error);
            }
        }
    });
});
