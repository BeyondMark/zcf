# ZCC - Zero-config Claude Code

[中文](README.md) | **English**

> Zero-config, one-click setup for Claude Code with bilingual support and intelligent agent system

## 🚀 Quick Start

```bash
npx zcc
```

The tool will automatically:
- Detect and install Claude Code
- Configure API keys
- Select and configure MCP services
- Set up all necessary configuration files

### Usage

After configuration:

   - **For first-time project use, strongly recommend running `/init` to generate CLAUDE.md for better AI understanding of project architecture**
   - `<task description>` - Execute directly without workflow, following SOLID, KISS, DRY, and YAGNI principles, suitable for small tasks like bug fixes
   - `/feat <task description>` - Start new feature development, divided into plan and UI phases
   - `/workflow <task description>` - Execute complete development workflow, not automated, starts with multiple solution options, asks for user feedback at each step, allows plan modifications, maximum control

   > **PS**:
   >
   > - Both feat and workflow have their advantages, try both to compare
   > - Generated documents are located by default at `.claude/xxx.md` in project root, you can add `.claude/` to your project's `.gitignore`

## ✨ ZCC Tool Features

### 🌏 Bilingual Support
- Script interaction language: Controls installation prompts language
- Configuration file language: Determines which configuration set to install (zh-CN/en)

### 🔧 Smart Installation
- Auto-detects Claude Code installation status
- Supports npm/yarn/pnpm package managers
- Cross-platform support (Windows/macOS/Linux)
- Automatic MCP service configuration (new feature)

### 📦 Complete Configuration
- CLAUDE.md system instructions
- settings.json configuration file
- commands custom commands
- agents AI agent configurations

### 🔐 API Configuration
- Custom API support
- Automatic API Key configuration
- Support for later configuration in claude command (e.g., OAuth)

### 💾 Configuration Management
- Smart backup of existing configurations (all backups saved in ~/.claude/backup/)
- Configuration merge option
- Safe overwrite mechanism
- Automatic backup before MCP configuration changes

## 📖 Usage Instructions

### Interactive Configuration Flow

```bash
$ npx zcc

? Select script language / 选择脚本语言:
  ❯ 简体中文
    English

? Select Claude Code configuration language:
  ❯ 简体中文 (zh-CN) - Chinese (easier for Chinese users to customize)
    English (en) - English (recommended, lower token consumption)

? Claude Code not found. Install automatically? (Y/n)

✔ Claude Code installed successfully

? Configure API?
  ❯ Configure API
    Skip (configure later in claude command, e.g., OAuth)

? Enter API URL: https://api.anthropic.com
? Enter API Key: sk-xxx

? Existing config detected. How to proceed?
  ❯ Backup and overwrite all
    Update Prompt documents only with backup
    Merge config
    Skip

✔ All config files backed up to ~/.claude/backup/xxx
✔ Config files copied to ~/.claude
✔ API configured

? Configure MCP services? (Y/n)

? Select MCP services to install (space to select, enter to confirm)
  ❯ ◯ Install all
    ◯ Context7 Documentation Query - Query latest library docs and code examples
    ◯ DeepWiki - Query GitHub repository docs and examples
    ◯ Playwright Browser Control - Direct browser automation control
    ◯ Exa AI Search - Web search using Exa AI

? Enter Exa API Key (get from https://dashboard.exa.ai/api-keys)

✔ MCP services configured

🎉 Setup complete! Use 'claude' command to start.
```

### Command Line Options

```bash
# Specify configuration language
npx zcc --config-lang zh-CN

# Force overwrite existing configuration
npx zcc --force

# Skip Claude Code installation check
npx zcc --skip-install

# Help information
npx zcc --help
```

## 📁 Project Structure

```
claude-code-config/
├── README.md              # Documentation
├── package.json           # npm package configuration
├── bin/
│   └── zcc.mjs           # CLI entry point
├── src/                  # Source code
│   ├── cli.ts           # CLI main logic
│   ├── commands/        # Command implementations
│   ├── utils/           # Utility functions
│   └── constants.ts     # Constant definitions
├── templates/            # Configuration templates
│   ├── en/              # English version
│   │   ├── CLAUDE.md    # Core principles
│   │   ├── settings.json
│   │   ├── agents/      # AI agents
│   │   └── commands/    # Command definitions
│   └── zh-CN/           # Chinese version
│       └── ... (same structure)
└── dist/                # Build output
```

## ✨ Core Features

### 🤖 Professional Agents

- **Task Planner**: Breaks down complex tasks into executable steps
- **UI/UX Designer**: Provides professional interface design guidance

### ⚡ Command System

- **Feature Development** (`/feat`): Structured new feature development
- **Workflow** (`/workflow`): Complete six-phase development workflow

### 🔧 Smart Configuration

- API key management
- Fine-grained permission control
- Multiple Claude model support

## 🎯 Development Workflow

### Six-Phase Workflow

1. **[Mode: Research]** - Understand requirements
2. **[Mode: Ideate]** - Design solutions
3. **[Mode: Plan]** - Create detailed plan
4. **[Mode: Execute]** - Implement development
5. **[Mode: Optimize]** - Improve quality
6. **[Mode: Review]** - Final assessment

## ⚙️ Supported Models

- **opus**: Most powerful, for complex tasks
- **sonnet**: Balanced performance and cost
- **haiku**: Fast lightweight model

## 🛠️ Development

```bash
# Clone the project
git clone https://github.com/UfoMiao/claude-code-config.git
cd claude-code-config

# Install dependencies (using pnpm)
pnpm install

# Build project
pnpm build

# Local testing
node bin/zcc.mjs
```

## 💡 Best Practices

1. **Task Breakdown**: Keep tasks independent and testable
2. **Code Quality**: Follow SOLID, KISS, DRY, and YAGNI principles
3. **Documentation Management**: Store plans in `.claude/` directory

## 🔧 Troubleshooting

If you encounter issues:

1. Re-run `npx zcc` to reconfigure
2. Check configuration files in `~/.claude/` directory
3. Ensure Claude Code is properly installed

## 🙏 Acknowledgments

Some prompts in this project are inspired by the following excellent works:

- [Linux.do - Share a universal Prompt for AI to generate only necessary code, welcome to optimize together~](https://linux.do/t/topic/830802)
- [Linux.do - Don't worry about claude code degradation, using agent and command combination to break down tasks in detail may help you](https://linux.do/t/topic/815230)
- [Linux.do - cursor rapid development rules](https://linux.do/t/topic/697566)

Thanks to these community contributors for sharing!

## 📄 License

MIT License

---

If this project helps you, please give me a ⭐️ Star!

[![Star History Chart](https://api.star-history.com/svg?repos=UfoMiao/claude-code-config&type=Date)](https://star-history.com/#UfoMiao/claude-code-config&Date)