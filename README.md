# Trae Prompt Builder

一个简单而强大的Trae扩展插件，帮助你快速生成适用于Trae AI代码编辑器的提示词。
通过生成细化的PRD文档，指导Trae在项目初始化时生成高质量项目代码

Github仓库地址:https://github.com/bertramray/trae-prompt-builder.git, 欢迎共建！
开发文档：见docs/developer-guide.md


## 功能特点

- 通过简单的描述生成详细的AI提示词
- 自动优化提示词以获得最佳代码生成效果
- 完全集成到Trae环境中
- 支持设置个人技术偏好

## 使用方法

1. 在Trae中安装本扩展
2. 在设置中配置OpenAI API密钥
3. 使用快捷键或命令面板(Ctrl+Shift+P)调用"Trae: Generate AI Prompt"命令
4. 输入你的需求描述
5. 等待生成优化后的PRD文档，自动生成到工作区目录中

## 配置选项

本扩展提供以下配置选项：

* `trae-prompt-builder.openaiApiKey`: 设置OpenAI API密钥（必需）
* `trae-prompt-builder.techStack`: 设置偏好的技术栈（例如：React, TypeScript, Node.js）
* `trae-prompt-builder.systemPromptTemplate`: 设置生成AI提示词的系统提示模板，使用{{techStackPrompt}}作为技术栈信息的占位符
* `trae-prompt-builder.userPromptTemplate`: 设置生成AI提示词的用户提示模板，使用{{requirement}}作为用户需求的占位符

## 注意事项

- 请确保您有有效的OpenAI API密钥
- 生成的提示词将以Markdown格式文档打开
- 建议使用简洁明了的需求描述以获得最佳效果

## 许可证

MIT
