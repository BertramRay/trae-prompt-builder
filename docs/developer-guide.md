# Trae Prompt Builder 开发者文档

## 开发脚本

项目提供以下npm脚本：

- `vscode:prepublish`: 执行编译
- `compile`: 编译TypeScript代码
- `watch`: 以监视模式编译TypeScript代码
- `pretest`: 运行编译和代码检查
- `lint`: 运行ESLint检查
- `test`: 运行VSCode测试
- `package`: 打包扩展
- `publish:vscode`: 发布到VSCode市场（需要VSCE_PAT环境变量）
- `publish:ovsx`: 发布到Open VSX Registry（需要OVSX_PAT环境变量）
- `publish:all`: 同时发布到VSCode市场和Open VSX Registry

## 代码贡献指南

我们欢迎所有开发者为Trae Prompt Builder贡献代码。以下是参与项目开发的基本流程：

1. Fork项目
   - 访问[项目GitHub仓库](https://github.com/bertramray/trae-prompt-builder)
   - 点击右上角的"Fork"按钮创建自己的仓库副本

2. 克隆仓库
   ```bash
   git clone https://github.com/你的用户名/trae-prompt-builder.git
   cd trae-prompt-builder
   npm install
   ```

3. 创建功能分支
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. 开发和提交
   - 进行代码修改
   - 遵循项目的代码规范
   - 添加必要的测试用例
   ```bash
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

5. 推送分支
   ```bash
   git push origin feature/your-feature-name
   ```

6. 创建Pull Request
   - 返回GitHub仓库页面
   - 点击"Pull Request"按钮
   - 选择你的功能分支
   - 填写PR描述，说明改动内容和原因

## 插件调试指南

### 环境准备

1. 安装依赖
   ```bash
   npm install
   ```

2. 编译代码
   ```bash
   npm run compile
   # 或使用监视模式
   npm run watch
   ```

### 调试配置

1. 在VSCode中打开项目
2. 按F5或点击调试面板中的"运行和调试"按钮
3. 选择"运行扩展"配置

### 调试技巧

1. 设置断点
   - 在代码编辑器左侧边栏点击设置断点
   - 使用`debugger`语句

2. 查看变量和调用栈
   - 使用调试面板的变量窗口查看变量值
   - 在调用栈窗口中跟踪代码执行路径

3. 控制台输出
   - 使用`console.log()`输出调试信息
   - 在调试控制台查看输出

4. 运行测试
   ```bash
   npm run test
   ```

### 常见问题解决

1. 扩展无法激活
   - 检查`package.json`中的`activationEvents`配置
   - 查看VSCode输出面板中的扩展日志

2. 命令未注册
   - 确认`package.json`中的`contributes.commands`配置正确
   - 检查命令ID是否匹配

## 许可证

本项目采用MIT许可证。详细信息请参阅LICENSE文件。