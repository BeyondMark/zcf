import ansis from 'ansis'
import { ensureI18nInitialized, i18n } from '../../i18n'
import { addCCometixLineConfig, hasCCometixLineConfig } from '../ccometixline-config'
import { execNpmCommand } from '../exec-wrapper'
import { COMETIX_PACKAGE_NAME } from './common'

export async function isCometixLineInstalled(): Promise<boolean> {
  try {
    const result = await execNpmCommand(['list', '-g', COMETIX_PACKAGE_NAME], { silent: true })
    return result.exitCode === 0
  }
  catch {
    return false
  }
}

export async function installCometixLine(): Promise<void> {
  ensureI18nInitialized()

  // Check if already installed
  const isInstalled = await isCometixLineInstalled()
  if (isInstalled) {
    console.log(ansis.green(`✔ ${i18n.t('cometix:cometixAlreadyInstalled')}`))

    // Update CCometixLine
    try {
      console.log(ansis.blue(`${i18n.t('cometix:installingOrUpdating')}`))
      const result = await execNpmCommand(['install', '-g', COMETIX_PACKAGE_NAME])
      if (result.exitCode === 0) {
        console.log(ansis.green(`✔ ${i18n.t('cometix:installUpdateSuccess')}`))
      }
      else {
        console.log(ansis.yellow(`⚠ ${i18n.t('cometix:installUpdateFailed')}: ${result.stderr || 'Update failed'}`))
      }
    }
    catch (error) {
      console.log(ansis.yellow(`⚠ ${i18n.t('cometix:installUpdateFailed')}: ${error}`))
    }

    // Check if statusLine config exists, add if missing
    if (!hasCCometixLineConfig()) {
      try {
        addCCometixLineConfig()
        console.log(ansis.green(`✔ ${i18n.t('cometix:statusLineConfigured') || 'Claude Code statusLine configured'}`))
      }
      catch (error) {
        console.log(ansis.yellow(`⚠ ${i18n.t('cometix:statusLineConfigFailed') || 'Failed to configure statusLine'}: ${error}`))
      }
    }
    else {
      console.log(ansis.blue(`ℹ ${i18n.t('cometix:statusLineAlreadyConfigured') || 'Claude Code statusLine already configured'}`))
    }
    return
  }

  try {
    console.log(ansis.blue(`${i18n.t('cometix:installingCometix')}`))
    const result = await execNpmCommand(['install', '-g', COMETIX_PACKAGE_NAME])
    if (result.exitCode === 0) {
      console.log(ansis.green(`✔ ${i18n.t('cometix:cometixInstallSuccess')}`))
    }
    else {
      throw new Error(result.stderr || 'Installation failed')
    }

    // Configure Claude Code statusLine after successful installation
    try {
      addCCometixLineConfig()
      console.log(ansis.green(`✔ ${i18n.t('cometix:statusLineConfigured') || 'Claude Code statusLine configured'}`))
    }
    catch (configError) {
      console.log(ansis.yellow(`⚠ ${i18n.t('cometix:statusLineConfigFailed') || 'Failed to configure statusLine'}: ${configError}`))
      console.log(ansis.blue(`💡 ${i18n.t('cometix:statusLineManualConfig') || 'Please manually add statusLine configuration to Claude Code settings'}`))
    }
  }
  catch (error) {
    console.error(ansis.red(`✗ ${i18n.t('cometix:cometixInstallFailed')}: ${error}`))
    throw error
  }
}
