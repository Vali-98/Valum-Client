export enum AppSettings {
    DevMode = 'settings-devmode',
}

/**
 * Default settings on first install
 */
export const AppSettingsDefault: Record<AppSettings, boolean> = {
    [AppSettings.DevMode]: false,
}

export const CLAUDE_VERSION = '2023-06-01'

