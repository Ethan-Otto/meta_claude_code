# Claude Code Setup Guide

This guide covers the complete setup of Claude Code on Windows, including plugins and recommended settings.

## Prerequisites

- Windows 10/11
- Terminal/PowerShell (included with Windows)
- Git ([Download](https://git-scm.com/download/win))
- A Claude account with API access

---

## 1. Install Claude Code

Open Terminal/PowerShell and run:

```powershell
irm https://claude.ai/install.ps1 | iex
```

Verify installation:

```powershell
claude --version
```

Launch Claude Code:

```powershell
claude
```

On first launch, you'll be prompted to authenticate with your Anthropic account.

> If you encounter issues during installation, see the [Claude Code Quickstart Guide](https://code.claude.com/docs/en/quickstart).

---

## 2. Verify Claude Code Setup

Run the following to verify your installation:

```powershell
claude --version
```

To verify the installation is working:
- Type `/plugin` to see available plugins and LSPs

---

## 3. Disable Training Data Collection

To prevent your conversations from being used for model training:

### If Using API Access (Anthropic Console)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to **Settings** > **Privacy**
3. Toggle **OFF** the option: "Allow Anthropic to use my data for training"

### If Using a Personal Account (claude.ai)

1. Go to [claude.ai/settings](https://claude.ai/settings)
2. Click **Privacy**
3. Toggle **OFF** the option: "Improve Claude for everyone"

> **Note:** Disabling this setting ensures your code and conversations remain private and are not used to improve future models.

---

## 4. Install uv (Python Package Manager)

[uv](https://github.com/astral-sh/uv) is a fast Python package manager that Claude Code can use for Python projects.

### Install uv

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Verify Installation

```powershell
uv --version
```

---

## 5. Install Plugins

Plugins extend Claude Code's capabilities, including LSP (Language Server Protocol) support for intelligent code completion.

### Step 1: Open the Plugin Manager

1. In Claude Code, type `/plugin` and press **Enter**
2. The plugin manager opens with multiple tabs

![Opening Plugins](./images/plugins-open.png)

### Step 2: Navigate the Plugin Manager

Use the **Tab** key to cycle through tabs:
- **Discover** — Browse available plugins from all marketplaces
- **Installed** — View and manage installed plugins
- **Marketplaces** — Manage added marketplaces

### Step 3: Install a Plugin

1. Go to the **Discover** tab
2. Use arrow keys to select a plugin
3. Press **Enter** to view details
4. Choose installation scope:
   - **User scope** — Install for yourself across all projects (default)
   - **Project scope** — Install for all collaborators
5. Press **Enter** to confirm installation

![Plugin Install](./images/plugin-install.png)

Alternatively, install directly via command:
```
/plugin install plugin-name@marketplace-name
```

### Recommended Plugins

#### Superpowers
Adds enhanced workflows for debugging, TDD, code review, brainstorming, and more.
```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

#### Document Skills (Excel, Word, PowerPoint, PDF)
Create, edit, and analyze Office documents and PDFs.
```
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
```

#### Frontend Design
Enables high-quality frontend/UI generation with distinctive aesthetics.
```
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-code-plugins
```

#### LSP Plugins (Language Server Protocol)
LSPs provide intelligent code completion, diagnostics, and refactoring support.

First, add the LSP marketplace:
```
/plugin marketplace add Piebald-AI/claude-code-lsps
```

Then install the language servers you need:

| Language | Install Command |
|----------|-----------------|
| Python | `/plugin install pyright@claude-code-lsps` |
| JavaScript (optional) | `/plugin install vtsls@claude-code-lsps` |

> **Note:** For JavaScript/TypeScript, you also need to install the language server globally: `npm install -g @vtsls/language-server typescript`

### Managing Plugins

**Disable a plugin:**
```
/plugin disable plugin-name@marketplace-name
```

**Re-enable a plugin:**
```
/plugin enable plugin-name@marketplace-name
```

**Uninstall a plugin:**
```
/plugin uninstall plugin-name@marketplace-name
```

---

## Troubleshooting

### Claude Code won't start
- Re-run the installer: `irm https://claude.ai/install.ps1 | iex`
- Check that your PATH includes the Claude Code installation directory

### Plugins not loading
- Run `/plugin` and check the **Installed** tab
- Restart Claude Code after installing plugins
- Clear plugin cache: `rm -rf ~/.claude/plugins/cache` and reinstall

### LSP not working
- Verify the required language server binary is installed on your system
- Run `/plugin` and check the **Installed** tab for LSP plugins
- Restart Claude Code after installing LSP plugins

---

## Quick Reference

| Task | How To |
|------|--------|
| Start Claude Code | Run `claude` in terminal |
| Install plugins & LSPs | `/plugin` |
| Update Claude Code | `irm https://claude.ai/install.ps1 \| iex` |

---

## Additional Resources

- [Claude Code Quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Anthropic Console](https://console.anthropic.com)
- [uv Documentation](https://github.com/astral-sh/uv)
