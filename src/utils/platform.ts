import { existsSync, readFileSync, statSync } from 'node:fs'
import { platform } from 'node:os'
import process from 'node:process'
import { exec } from 'tinyexec'

export function getPlatform(): 'windows' | 'macos' | 'linux' {
  const p = platform()
  if (p === 'win32')
    return 'windows'
  if (p === 'darwin')
    return 'macos'
  return 'linux'
}

export function isTermux(): boolean {
  return !!(process.env.PREFIX && process.env.PREFIX.includes('com.termux'))
    || !!process.env.TERMUX_VERSION
    || existsSync('/data/data/com.termux/files/usr')
}

export function getTermuxPrefix(): string {
  return process.env.PREFIX || '/data/data/com.termux/files/usr'
}

export function isWindows(): boolean {
  return getPlatform() === 'windows'
}

export interface WSLInfo {
  isWSL: true
  distro: string | null
  version: string | null
}

export function isWSL(): boolean {
  // Check WSL_DISTRO_NAME environment variable (most reliable method)
  if (process.env.WSL_DISTRO_NAME) {
    return true
  }

  // Check /proc/version for Microsoft or WSL indicators
  if (existsSync('/proc/version')) {
    try {
      const version = readFileSync('/proc/version', 'utf8')
      if (version.includes('Microsoft') || version.includes('WSL')) {
        return true
      }
    }
    catch {
      // Ignore read errors
    }
  }

  // Check for Windows mount points as fallback
  if (existsSync('/mnt/c')) {
    return true
  }

  return false
}

export function getWSLDistro(): string | null {
  // Priority 1: WSL_DISTRO_NAME environment variable
  if (process.env.WSL_DISTRO_NAME) {
    return process.env.WSL_DISTRO_NAME
  }

  // Priority 2: Read from /etc/os-release
  if (existsSync('/etc/os-release')) {
    try {
      const osRelease = readFileSync('/etc/os-release', 'utf8')
      const nameMatch = osRelease.match(/^PRETTY_NAME="(.+)"$/m)
      if (nameMatch) {
        return nameMatch[1]
      }
    }
    catch {
      // Ignore read errors
    }
  }

  return null
}

export function getWSLInfo(): WSLInfo | null {
  if (!isWSL()) {
    return null
  }

  let version: string | null = null
  if (existsSync('/proc/version')) {
    try {
      version = readFileSync('/proc/version', 'utf8').trim()
    }
    catch {
      // Ignore read errors
    }
  }

  return {
    isWSL: true,
    distro: getWSLDistro(),
    version,
  }
}

export function getMcpCommand(): string[] {
  if (isWindows()) {
    return ['cmd', '/c', 'npx']
  }
  return ['npx']
}

export async function commandExists(command: string): Promise<boolean> {
  try {
    // First try standard which/where command
    const cmd = getPlatform() === 'windows' ? 'where' : 'which'
    const res = await exec(cmd, [command])
    if (res.exitCode === 0) {
      return true
    }
  }
  catch {
    // Continue to fallback checks
  }

  // For Termux environment, check specific paths
  if (isTermux()) {
    const termuxPrefix = getTermuxPrefix()
    const possiblePaths = [
      `${termuxPrefix}/bin/${command}`,
      `${termuxPrefix}/usr/bin/${command}`,
      `/data/data/com.termux/files/usr/bin/${command}`,
    ]

    for (const path of possiblePaths) {
      if (existsSync(path)) {
        return true
      }
    }
  }

  // Final fallback: check common paths on Linux/Mac
  if (getPlatform() !== 'windows') {
    const commonPaths = [
      `/usr/local/bin/${command}`,
      `/usr/bin/${command}`,
      `/bin/${command}`,
      `${process.env.HOME}/.local/bin/${command}`,
    ]

    for (const path of commonPaths) {
      if (existsSync(path)) {
        return true
      }
    }
  }

  return false
}

/**
 * Get npm global prefix path
 */
export async function getNpmPrefix(): Promise<string> {
  try {
    const result = await exec('npm', ['config', 'get', 'prefix'])
    return result.stdout.trim()
  }
  catch {
    // Fallback to default paths
    if (isWindows()) {
      return process.env.APPDATA ? `${process.env.APPDATA}\\npm` : 'C:\\Program Files\\nodejs'
    }
    if (isTermux()) {
      return getTermuxPrefix()
    }
    return '/usr/local'
  }
}

/**
 * Check if current user can write to npm global directory
 */
export async function canWriteToNpmPrefix(): Promise<boolean> {
  try {
    const prefix = await getNpmPrefix()
    const nodeModulesPath = isWindows()
      ? `${prefix}\\node_modules`
      : `${prefix}/lib/node_modules`

    if (!existsSync(nodeModulesPath)) {
      // If directory doesn't exist, check parent directory
      return canWriteToPath(prefix)
    }

    return canWriteToPath(nodeModulesPath)
  }
  catch {
    return false
  }
}

/**
 * Check if a path is writable by current user
 */
function canWriteToPath(path: string): boolean {
  try {
    const stats = statSync(path)
    const uid = process.getuid?.() ?? -1
    const gid = process.getgid?.() ?? -1

    // On Windows, we can't reliably check permissions this way
    if (isWindows()) {
      // Windows doesn't have getuid/getgid, assume we need elevation if in Program Files
      return !path.includes('Program Files')
    }

    // Check if we own the directory
    if (stats.uid === uid) {
      // Check owner write permission
      return (stats.mode & 0o200) !== 0
    }

    // Check if we're in the group
    if (stats.gid === gid) {
      // Check group write permission
      return (stats.mode & 0o020) !== 0
    }

    // Check other write permission
    return (stats.mode & 0o002) !== 0
  }
  catch {
    return false
  }
}

/**
 * Check if npm commands need sudo/elevation
 */
export async function needsSudoForNpm(): Promise<boolean> {
  // Windows doesn't use sudo (but may need elevation)
  // Termux never needs sudo
  if (isTermux()) {
    return false
  }

  // On Windows, check if npm prefix is in Program Files
  if (isWindows()) {
    const prefix = await getNpmPrefix()
    return prefix.includes('Program Files')
  }

  // For Unix-like systems (macOS, Linux, WSL), check write permissions
  return !(await canWriteToNpmPrefix())
}

/**
 * Get platform-specific npm permission strategy
 */
export async function getNpmPermissionStrategy(): Promise<'direct' | 'sudo' | 'elevation'> {
  if (isTermux()) {
    return 'direct'
  }

  if (isWindows()) {
    const needsElevation = await needsSudoForNpm()
    return needsElevation ? 'elevation' : 'direct'
  }

  // Unix-like systems
  const needsSudo = await needsSudoForNpm()
  return needsSudo ? 'sudo' : 'direct'
}

/**
 * Check if sudo command is available
 */
export async function hasSudoCommand(): Promise<boolean> {
  if (isWindows() || isTermux()) {
    return false
  }

  return await commandExists('sudo')
}
