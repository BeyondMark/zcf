import { homedir } from 'node:os';
import { join } from 'pathe';
import type { McpService } from './types';

export const CLAUDE_DIR = join(homedir(), '.claude');
export const SETTINGS_FILE = join(CLAUDE_DIR, 'settings.json');
export const CLAUDE_MD_FILE = join(CLAUDE_DIR, 'CLAUDE.md');
export const MCP_CONFIG_FILE = join(homedir(), '.claude.json');
export const ZCF_CONFIG_FILE = join(homedir(), '.zcf.json');

export const SUPPORTED_LANGS = ['zh-CN', 'en'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export const LANG_LABELS = {
  'zh-CN': '简体中文',
  en: 'English',
} as const;

export const AI_OUTPUT_LANGUAGES = {
  'zh-CN': { label: '简体中文', directive: 'Always respond in Chinese-simplified' },
  en: { label: 'English', directive: 'Always respond in English' },
  custom: { label: 'Custom', directive: '' },
} as const;

export type AiOutputLanguage = keyof typeof AI_OUTPUT_LANGUAGES;

export const I18N = {
  'zh-CN': {
    selectScriptLang: '选择脚本语言',
    selectConfigLang: '选择 Claude Code 配置语言',
    selectAiOutputLang: '选择 AI 输出语言',
    aiOutputLangHint: 'AI 将使用此语言回复你的问题',
    enterCustomLanguage: '请输入自定义语言（例如：Japanese, French 等）',
    configLangHint: {
      'zh-CN': '中文版（便于中文用户自定义）',
      en: '英文版（推荐，token 消耗更低）',
    },
    installPrompt: '检测到 Claude Code 未安装，是否自动安装？',
    installing: '正在安装 Claude Code...',
    installSuccess: 'Claude Code 安装成功',
    installFailed: 'Claude Code 安装失败',
    npmNotFound: 'npm 未安装。请先安装 Node.js 和 npm。',
    configureApi: '是否配置 API？',
    customApi: '配置 API',
    skipApi: '跳过（稍后在 claude 命令中自行配置，如 OAuth）',
    enterApiUrl: '请输入 API URL',
    enterApiKey: '请输入 API Key',
    existingConfig: '检测到已有配置文件，如何处理？',
    backupAndOverwrite: '备份并覆盖全部',
    updateDocsOnly: '仅更新工作流相关md并备份旧配置',
    mergeConfig: '合并配置',
    skip: '跳过',
    backupSuccess: '已备份所有配置文件到',
    copying: '正在复制配置文件...',
    configSuccess: '配置文件已复制到',
    apiConfigSuccess: 'API 配置完成',
    mcpConfigSuccess: 'MCP 服务已配置',
    selectMcpServices: '选择要安装的 MCP 服务（空格选择，回车确认）',
    allServices: '全部安装',
    mcpServiceInstalled: '已选择的 MCP 服务',
    enterExaApiKey: '请输入 Exa API Key（可从 https://dashboard.exa.ai/api-keys 获取）',
    skipMcp: '跳过 MCP 配置',
    configureMcp: '是否配置 MCP 服务？',
    mcpBackupSuccess: '已备份原有 MCP 配置',
    complete: "🎉 配置完成！使用 'claude' 命令开始体验。",
    error: '错误',
    yes: '是',
    no: '否',
    cancelled: '操作已取消',
    noExistingConfig: '未找到现有配置。请先运行 `zcf`。',
    updatingPrompts: '正在更新 Claude Code Prompt 文档...',
    updateConfigLangPrompt: '选择配置语言',
    updateConfigLangChoice: {
      'zh-CN': '中文版配置',
      en: '英文版配置',
    },
  },
  en: {
    selectScriptLang: 'Select script language',
    selectConfigLang: 'Select Claude Code configuration language',
    selectAiOutputLang: 'Select AI output language',
    aiOutputLangHint: 'AI will respond to you in this language',
    enterCustomLanguage: 'Enter custom language (e.g., Japanese, French, etc.)',
    configLangHint: {
      'zh-CN': 'Chinese (easier for Chinese users to customize)',
      en: 'English (recommended, lower token consumption)',
    },
    installPrompt: 'Claude Code not found. Install automatically?',
    installing: 'Installing Claude Code...',
    installSuccess: 'Claude Code installed successfully',
    installFailed: 'Failed to install Claude Code',
    npmNotFound: 'npm is not installed. Please install Node.js and npm first.',
    configureApi: 'Configure API?',
    customApi: 'Configure API',
    skipApi: 'Skip (configure later in claude command, e.g., OAuth)',
    enterApiUrl: 'Enter API URL',
    enterApiKey: 'Enter API Key',
    existingConfig: 'Existing config detected. How to proceed?',
    backupAndOverwrite: 'Backup and overwrite all',
    updateDocsOnly: 'Update workflow-related md files only with backup',
    mergeConfig: 'Merge config',
    skip: 'Skip',
    backupSuccess: 'All config files backed up to',
    copying: 'Copying configuration files...',
    configSuccess: 'Config files copied to',
    apiConfigSuccess: 'API configured',
    mcpConfigSuccess: 'MCP services configured',
    selectMcpServices: 'Select MCP services to install (space to select, enter to confirm)',
    allServices: 'Install all',
    mcpServiceInstalled: 'Selected MCP services',
    enterExaApiKey: 'Enter Exa API Key (get from https://dashboard.exa.ai/api-keys)',
    skipMcp: 'Skip MCP configuration',
    configureMcp: 'Configure MCP services?',
    mcpBackupSuccess: 'Original MCP config backed up',
    complete: "🎉 Setup complete! Use 'claude' command to start.",
    error: 'Error',
    yes: 'Yes',
    no: 'No',
    cancelled: 'Operation cancelled',
    noExistingConfig: 'No existing configuration found. Please run `zcf` first.',
    updatingPrompts: 'Updating Claude Code prompt documents...',
    updateConfigLangPrompt: 'Select configuration language',
    updateConfigLangChoice: {
      'zh-CN': 'Chinese configuration',
      en: 'English configuration',
    },
  },
};

export const MCP_SERVICES: McpService[] = [
  {
    id: 'context7',
    name: { 'zh-CN': 'Context7 文档查询', en: 'Context7 Docs' },
    description: {
      'zh-CN': '查询最新的库文档和代码示例',
      en: 'Query latest library documentation and code examples',
    },
    requiresApiKey: false,
    config: {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@upstash/context7-mcp'],
      env: {},
    },
  },
  {
    id: 'mcp-deepwiki',
    name: { 'zh-CN': 'DeepWiki', en: 'DeepWiki' },
    description: {
      'zh-CN': '查询 GitHub 仓库文档和示例',
      en: 'Query GitHub repository documentation and examples',
    },
    requiresApiKey: false,
    config: {
      type: 'stdio',
      command: 'npx',
      args: ['-y', 'mcp-deepwiki@latest'],
      env: {},
    },
  },
  {
    id: 'Playwright',
    name: { 'zh-CN': 'Playwright 浏览器控制', en: 'Playwright Browser Control' },
    description: {
      'zh-CN': '直接控制浏览器进行自动化操作',
      en: 'Direct browser control for automation',
    },
    requiresApiKey: false,
    config: {
      type: 'stdio',
      command: 'npx',
      args: ['-y', '@playwright/mcp@latest'],
      env: {},
    },
  },
  {
    id: 'exa',
    name: { 'zh-CN': 'Exa AI 搜索', en: 'Exa AI Search' },
    description: {
      'zh-CN': '使用 Exa AI 进行网页搜索',
      en: 'Web search using Exa AI',
    },
    requiresApiKey: true,
    apiKeyPrompt: {
      'zh-CN': '请输入 Exa API Key',
      en: 'Enter Exa API Key',
    },
    apiKeyPlaceholder: 'YOUR_EXA_API_KEY',
    config: {
      type: 'stdio',
      command: 'npx',
      args: ['-y', 'mcp-remote', 'https://mcp.exa.ai/mcp?exaApiKey=YOUR_EXA_API_KEY'],
      env: {},
    },
  },
];
