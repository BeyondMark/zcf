# 发布指南

本项目使用 [Changesets](https://github.com/changesets/changesets) 进行版本管理和自动发布。

## 🚀 快速开始

### 1. 添加变更记录

完成功能开发或修复后，创建变更记录：

```bash
pnpm changeset
```

按照提示选择：
- 变更类型（patch/minor/major）
- 输入变更描述（支持 Markdown）

### 2. 自动发布流程（推荐）

1. **创建 PR**：将你的代码推送到分支，创建 PR 到 main
2. **合并 PR**：代码审查通过后合并
3. **自动创建发布 PR**：Changesets bot 会自动创建 "Version Packages" PR
4. **合并发布 PR**：合并后自动发布到 npm

## 📦 发布流程详解

### 自动化流程

当代码合并到 main 分支后：

1. GitHub Actions 检测到新的 changesets
2. 自动创建/更新 "Version Packages" PR，包含：
   - 版本号更新
   - CHANGELOG 生成
   - changeset 文件清理
3. 合并该 PR 触发自动发布

### 本地发布（备选）

```bash
# 1. 添加变更记录
pnpm changeset

# 2. 更新版本
pnpm changeset version

# 3. 构建并发布
pnpm release

# 4. 推送代码
git push origin main --follow-tags
```

## 🏷️ 版本规范

遵循语义化版本（Semantic Versioning）：

| 类型 | 版本变化 | 适用场景 |
|------|---------|---------|
| **patch** | x.x.1 | Bug 修复、文档更新、依赖更新 |
| **minor** | x.1.0 | 新增功能、向后兼容的改进 |
| **major** | 1.0.0 | 破坏性更改、架构调整、API 变更 |

## 🔧 配置要求

### GitHub Secrets

在仓库设置中配置：
- `NPM_TOKEN`: npm 发布令牌
  1. 访问 https://www.npmjs.com/settings/[username]/tokens
  2. 创建 "Automation" 类型的 token
  3. 添加到 GitHub Secrets

### 权限设置

确保 GitHub Actions 有以下权限：
- `contents: write` - 创建发布
- `pull-requests: write` - 创建 PR
- `id-token: write` - npm provenance

## 📋 CI/CD 工作流

### CI 工作流（ci.yml）
- **触发**：Push 到 main 或 PR
- **测试矩阵**：
  - OS: Ubuntu, macOS, Windows
  - Node: 18, 20
- **步骤**：依赖安装 → 类型检查 → 构建 → 测试

### Release 工作流（release.yml）
- **触发**：Push 到 main
- **功能**：
  - 检测 changesets
  - 创建版本 PR
  - 自动发布到 npm
  - 支持 npm provenance

## 💡 最佳实践

1. **每个 PR 一个 changeset**：确保每个功能都有变更记录
2. **描述要清晰**：changeset 描述会出现在 CHANGELOG 中
3. **选择正确的版本类型**：参考版本规范
4. **不要手动修改版本号**：让 changesets 管理版本

## 🔍 常见问题

### Q: 忘记添加 changeset 怎么办？
A: 可以在 PR 中补充，运行 `pnpm changeset` 并提交

### Q: 如何发布预发布版本？
A: 使用 `pnpm changeset pre enter <tag>` 进入预发布模式

### Q: 如何撤销发布？
A: npm 不支持撤销，只能发布新版本修复

## 📚 相关链接

- [Changesets 文档](https://github.com/changesets/changesets)
- [语义化版本规范](https://semver.org/lang/zh-CN/)
- [npm 发布文档](https://docs.npmjs.com/cli/v8/commands/npm-publish)