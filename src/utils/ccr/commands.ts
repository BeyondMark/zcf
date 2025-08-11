import { exec } from 'child_process';
import { promisify } from 'util';
import ansis from 'ansis';
import type { SupportedLang } from '../../constants';
import { I18N } from '../../constants';

const execAsync = promisify(exec);

export async function runCcrUi(scriptLang: SupportedLang, apiKey?: string): Promise<void> {
  const i18n = I18N[scriptLang];
  console.log(ansis.cyan(`\n🖥️  ${i18n.ccr.startingCcrUi}`));
  
  // Show API key tip if available
  if (apiKey) {
    console.log(ansis.bold.green(`\n🔑 ${i18n.ccr.ccrUiApiKey || 'CCR UI API Key'}: ${apiKey}`));
    console.log(ansis.gray(`   ${i18n.ccr.ccrUiApiKeyHint || 'Use this API key to login to CCR UI'}\n`));
  }
  
  try {
    const { stdout, stderr } = await execAsync('ccr ui');
    if (stdout) console.log(stdout);
    if (stderr) console.error(ansis.yellow(stderr));
    console.log(ansis.green(`✔ ${i18n.ccr.ccrUiStarted}`));
  } catch (error) {
    console.error(ansis.red(`✖ ${i18n.ccr.ccrCommandFailed}: ${error instanceof Error ? error.message : String(error)}`));
    throw error;
  }
}

export async function runCcrStatus(scriptLang: SupportedLang): Promise<void> {
  const i18n = I18N[scriptLang];
  console.log(ansis.cyan(`\n📊 ${i18n.ccr.checkingCcrStatus}`));
  
  try {
    const { stdout, stderr } = await execAsync('ccr status');
    if (stdout) {
      console.log('\n' + ansis.bold(i18n.ccr.ccrStatusTitle));
      console.log(stdout);
    }
    if (stderr) console.error(ansis.yellow(stderr));
  } catch (error) {
    console.error(ansis.red(`✖ ${i18n.ccr.ccrCommandFailed}: ${error instanceof Error ? error.message : String(error)}`));
    throw error;
  }
}

export async function runCcrRestart(scriptLang: SupportedLang): Promise<void> {
  const i18n = I18N[scriptLang];
  console.log(ansis.cyan(`\n🔄 ${i18n.ccr.restartingCcr}`));
  
  try {
    const { stdout, stderr } = await execAsync('ccr restart');
    if (stdout) console.log(stdout);
    if (stderr) console.error(ansis.yellow(stderr));
    console.log(ansis.green(`✔ ${i18n.ccr.ccrRestarted}`));
  } catch (error) {
    console.error(ansis.red(`✖ ${i18n.ccr.ccrCommandFailed}: ${error instanceof Error ? error.message : String(error)}`));
    throw error;
  }
}

export async function runCcrStart(scriptLang: SupportedLang): Promise<void> {
  const i18n = I18N[scriptLang];
  console.log(ansis.cyan(`\n▶️  ${i18n.ccr.startingCcr}`));
  
  try {
    const { stdout, stderr } = await execAsync('ccr start');
    if (stdout) console.log(stdout);
    if (stderr) console.error(ansis.yellow(stderr));
    console.log(ansis.green(`✔ ${i18n.ccr.ccrStarted}`));
  } catch (error: any) {
    // CCR start command may return exit code 1 even when successful
    // Check if it's the expected output format (IP address and config loaded message)
    if (error.stdout && error.stdout.includes('Loaded JSON config from:')) {
      // This is normal CCR start behavior - show output and consider it successful
      console.log(error.stdout);
      if (error.stderr) console.error(ansis.yellow(error.stderr));
      console.log(ansis.green(`✔ ${i18n.ccr.ccrStarted}`));
    } else {
      // This is a real error
      console.error(ansis.red(`✖ ${i18n.ccr.ccrCommandFailed}: ${error instanceof Error ? error.message : String(error)}`));
      throw error;
    }
  }
}

export async function runCcrStop(scriptLang: SupportedLang): Promise<void> {
  const i18n = I18N[scriptLang];
  console.log(ansis.cyan(`\n⏹️  ${i18n.ccr.stoppingCcr}`));
  
  try {
    const { stdout, stderr } = await execAsync('ccr stop');
    if (stdout) console.log(stdout);
    if (stderr) console.error(ansis.yellow(stderr));
    console.log(ansis.green(`✔ ${i18n.ccr.ccrStopped}`));
  } catch (error) {
    console.error(ansis.red(`✖ ${i18n.ccr.ccrCommandFailed}: ${error instanceof Error ? error.message : String(error)}`));
    throw error;
  }
}