import { useEffect, useState } from "react";
import type { RuntimeSnapshot } from "@pi-gui/session-driver/runtime-types";
import type { ModelSettingsScopeMode } from "./desktop-state";
import { SettingsGroup, SettingsInfoRow, SettingsRow } from "./settings-utils";

interface SettingsGeneralSectionProps {
  readonly runtime?: RuntimeSnapshot;
  readonly modelSettingsScopeMode: ModelSettingsScopeMode;
  readonly integratedTerminalShell: string;
  readonly onSetModelSettingsScopeMode: (mode: ModelSettingsScopeMode) => void;
  readonly onSetIntegratedTerminalShell: (shellPath: string) => void;
  readonly onToggleSkillCommands: (enabled: boolean) => void;
}

export function SettingsGeneralSection({
  runtime,
  modelSettingsScopeMode,
  integratedTerminalShell,
  onSetModelSettingsScopeMode,
  onSetIntegratedTerminalShell,
  onToggleSkillCommands,
}: SettingsGeneralSectionProps) {
  const connectedCount = runtime?.providers.filter((p) => p.hasAuth).length ?? 0;
  const [terminalShellDraft, setTerminalShellDraft] = useState(integratedTerminalShell);
  const platform = window.piApp?.platform;
  const isMac = platform === "darwin";
  const shellPlaceholder = platform === "win32" ? "cmd.exe" : isMac ? "/bin/zsh" : "/bin/bash";
  const modLabel = isMac ? "Cmd+" : "Ctrl+";

  useEffect(() => {
    setTerminalShellDraft(integratedTerminalShell);
  }, [integratedTerminalShell]);

  const commitTerminalShellDraft = () => {
    if (terminalShellDraft !== integratedTerminalShell) {
      onSetIntegratedTerminalShell(terminalShellDraft);
    }
  };

  return (
    <>
      <SettingsGroup title="General">
        <SettingsInfoRow
          label="Connected providers"
          value={connectedCount > 0 ? String(connectedCount) : "None"}
        />
        <SettingsInfoRow label="Discovered skills" value={String(runtime?.skills.length ?? 0)} />
        <SettingsRow title="Model settings scope" description="Choose whether model defaults apply everywhere or per repo.">
          <div className="settings-pill-row">
            <button
              className={`settings-pill${modelSettingsScopeMode === "app-global" ? " settings-pill--active" : ""}`}
              type="button"
              aria-pressed={modelSettingsScopeMode === "app-global"}
              onClick={() => onSetModelSettingsScopeMode("app-global")}
            >
              App global
            </button>
            <button
              className={`settings-pill${modelSettingsScopeMode === "per-repo" ? " settings-pill--active" : ""}`}
              type="button"
              aria-pressed={modelSettingsScopeMode === "per-repo"}
              onClick={() => onSetModelSettingsScopeMode("per-repo")}
            >
              Per repo
            </button>
          </div>
        </SettingsRow>
        <SettingsRow title="Enable skill slash commands" description="Keep skill slash commands available in the composer.">
          <input
            aria-label="Enable skill slash commands"
            checked={runtime?.settings.enableSkillCommands ?? true}
            type="checkbox"
            onChange={(event) => onToggleSkillCommands(event.target.checked)}
          />
        </SettingsRow>
        <SettingsRow title="Shell of integrated terminal" description="Leave blank to use your default login shell.">
          <input
            aria-label="Shell of integrated terminal"
            className="settings-text-input"
            placeholder={shellPlaceholder}
            spellCheck={false}
            type="text"
            value={terminalShellDraft}
            onBlur={commitTerminalShellDraft}
            onChange={(event) => setTerminalShellDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup title="Shortcuts">
        <SettingsInfoRow label="New thread" value={`${modLabel}Shift+O`} />
        <SettingsInfoRow label="Open settings" value={`${modLabel},`} />
        <SettingsInfoRow label="Toggle terminal" value={`${modLabel}J`} />
        <SettingsInfoRow label="New terminal tab" value={`${modLabel}T`} />
        <SettingsInfoRow label="Send message" value="Enter" />
        <SettingsInfoRow label="New line" value="Shift+Enter" />
      </SettingsGroup>
    </>
  );
}
