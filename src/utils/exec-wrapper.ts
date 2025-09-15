import { spawn } from 'node:child_process'
import process from 'node:process'
import ansis from 'ansis'
import { exec } from 'tinyexec'
import { ensureI18nInitialized, i18n } from '../i18n'
import { getNpmPermissionStrategy, hasSudoCommand, isWindows } from './platform'

export interface ExecNpmOptions {
  silent?: boolean
  timeout?: number
}

/**
 * Execute npm command with automatic permission handling
 */
export async function execNpmCommand(
  args: string[],
  options: ExecNpmOptions = {},
): Promise<{ stdout: string, stderr: string, exitCode: number | undefined }> {
  ensureI18nInitialized()

  const strategy = await getNpmPermissionStrategy()

  switch (strategy) {
    case 'direct':
      return await execDirect(args, options)

    case 'sudo':
      return await execWithSudo(args, options)

    case 'elevation':
      return await execWithElevation(args, options)

    default:
      return await execDirect(args, options)
  }
}

/**
 * Execute npm command directly without elevation
 */
async function execDirect(
  args: string[],
  options: ExecNpmOptions,
): Promise<{ stdout: string, stderr: string, exitCode: number | undefined }> {
  try {
    const result = await exec('npm', args, {
      timeout: options.timeout,
    })

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
    }
  }
  catch (error: any) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message,
      exitCode: error.exitCode ?? 1,
    }
  }
}

/**
 * Execute npm command with sudo (Unix-like systems)
 */
async function execWithSudo(
  args: string[],
  options: ExecNpmOptions,
): Promise<{ stdout: string, stderr: string, exitCode: number | undefined }> {
  ensureI18nInitialized()

  // Check if sudo is available
  const hasSudo = await hasSudoCommand()
  if (!hasSudo) {
    console.error(ansis.red(`✖ ${i18n.t('npm:sudoNotAvailable')}`))
    return await execDirect(args, options)
  }

  // Check if we're in an interactive terminal
  const isInteractive = process.stdin.isTTY && process.stdout.isTTY

  if (!isInteractive) {
    console.error(ansis.yellow(`⚠ ${i18n.t('npm:nonInteractiveMode')}`))
    console.error(ansis.gray(i18n.t('npm:tryUserInstall')))
    // Try without sudo and let it fail with permission error
    return await execDirect(args, options)
  }

  // Inform user about sudo requirement
  if (!options.silent) {
    console.log(ansis.yellow(`ℹ ${i18n.t('npm:sudoRequired')}`))
    console.log(ansis.gray(i18n.t('npm:sudoReason')))
  }

  return new Promise((resolve) => {
    // Use spawn for interactive sudo
    const npmPath = isWindows() ? 'npm.cmd' : 'npm'

    // Use -k to always prompt for password (ignore cached credentials)
    // This ensures user is aware that elevated privileges are being used
    const sudoArgs = process.env.ZCF_SUDO_NO_RESET ? [npmPath, ...args] : ['-k', npmPath, ...args]

    const child = spawn('sudo', sudoArgs, {
      stdio: 'inherit',
      shell: false,
    })

    const stdout = ''
    let stderr = ''

    child.on('error', (error) => {
      stderr = error.message
      resolve({
        stdout,
        stderr,
        exitCode: 1,
      })
    })

    child.on('exit', (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 0,
      })
    })
  })
}

/**
 * Execute npm command with Windows elevation
 */
async function execWithElevation(
  args: string[],
  options: ExecNpmOptions,
): Promise<{ stdout: string, stderr: string, exitCode: number | undefined }> {
  ensureI18nInitialized()

  // On Windows, we'll try to run directly first
  // If it fails with permission error, inform the user
  try {
    return await execDirect(args, options)
  }
  catch (error: any) {
    if (error.stderr?.includes('EACCES') || error.stderr?.includes('EPERM')) {
      if (!options.silent) {
        console.log(ansis.yellow(`ℹ ${i18n.t('npm:elevationRequired')}`))
        console.log(ansis.gray(i18n.t('npm:runAsAdmin')))
      }
    }
    throw error
  }
}

/**
 * Execute npm command with automatic retry on permission errors
 */
export async function execNpmWithRetry(
  args: string[],
  options: ExecNpmOptions = {},
): Promise<{ stdout: string, stderr: string, exitCode: number | undefined }> {
  try {
    // First try without elevation
    const result = await execDirect(args, options)

    // Check if we got a permission error
    if (result.stderr?.includes('EACCES') || result.stderr?.includes('EPERM')) {
      // Retry with appropriate permission strategy
      return await execNpmCommand(args, options)
    }

    return result
  }
  catch (error: any) {
    // If first attempt fails, try with permissions
    if (error.stderr?.includes('EACCES') || error.stderr?.includes('EPERM')) {
      return await execNpmCommand(args, options)
    }
    throw error
  }
}
