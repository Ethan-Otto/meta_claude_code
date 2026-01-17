# Claude Code Setup Guide

This guide covers the complete setup of Claude Code on Windows, including plugins, LSPs, and recommended settings.

## Prerequisites

- Windows 10/11
- PowerShell 5.1+ (included with Windows)
- Git ([Download](https://git-scm.com/download/win))
- A Claude account with API access

---

## 1. Install Claude Code

Open PowerShell and run:

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

---

## 2. Install uv (Python Package Manager)

[uv](https://github.com/astral-sh/uv) is a fast Python package manager that Claude Code can use for Python projects.

### Install uv

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Verify Installation

```powershell
uv --version
```

### Configure uv for Projects

Create a virtual environment:

```powershell
uv venv
```

Activate it:

```powershell
.venv\Scripts\activate
```

Install packages:

```powershell
uv pip install <package-name>
```

---

## 3. Install Plugins

Plugins extend Claude Code's capabilities. Install them through the Settings UI.

### Opening Plugin Settings

1. In Claude Code, press `Ctrl + ,` (or click the gear icon) to open **Settings**
2. Navigate to the **Plugins** tab

![Opening Settings](./images/settings-open.png)

### Recommended Plugins

Install the following plugins:

#### Frontend Design
Enables high-quality frontend/UI generation with distinctive aesthetics.

![Frontend Design Plugin](./images/plugin-frontend-design.png)

#### Superpowers
Adds enhanced workflows for debugging, TDD, code review, brainstorming, and more.

![Superpowers Plugin](./images/plugin-superpowers.png)

#### MS Office Suite (Excel, PowerPoint, Word)
Enables Claude to read and manipulate Microsoft Office documents.

![MS Office Plugin](./images/plugin-ms-office.png)

This adds MCP servers for:
- Excel spreadsheet analysis and creation
- PowerPoint presentation generation
- Word document processing

### Installing a Plugin

1. Find the plugin in the list
2. Click **Install**
3. Restart Claude Code if prompted

![Plugin Install](./images/plugin-install.png)

---

## 4. Configure LSPs (Language Server Protocol)

LSPs provide intelligent code completion, diagnostics, and refactoring support.

### Opening LSP Settings

1. In Claude Code, press `Ctrl + ,` (or click the gear icon) to open **Settings**
2. Navigate to the **LSP** tab

![LSP Settings](./images/lsp-settings.png)

### Enable LSP Integration

1. Toggle **Enable LSP** to ON
2. Claude Code will auto-detect installed language servers

![Enable LSP](./images/lsp-enable.png)

### Adding Language Servers

Click **Add Server** and configure for your languages:

![Add LSP Server](./images/lsp-add-server.png)

#### Recommended Language Servers

| Language | Server | How to Install |
|----------|--------|----------------|
| TypeScript/JavaScript | typescript-language-server | `npm install -g typescript-language-server typescript` |
| Python | pylsp | `uv pip install python-lsp-server` |
| Rust | rust-analyzer | `rustup component add rust-analyzer` |

### Verifying LSP Connection

Once configured, you'll see a green indicator next to each active language server.

![LSP Status](./images/lsp-status.png)

---

## 5. Disable Training Data Collection

To prevent your conversations from being used for model training:

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to **Settings** > **Privacy**
3. Toggle **OFF** the option: "Allow Anthropic to use my data for training"

Alternatively, in Claude Code settings:

```json
{
  "privacy": {
    "allowTrainingData": false
  }
}
```

> **Note:** Disabling this setting ensures your code and conversations remain private and are not used to improve future models.

---

## 6. Verify Setup

Run the following to verify your setup:

```powershell
# Check Claude Code
claude --version

# Check uv
uv --version
```

To verify plugins and LSPs, open Settings (`Ctrl + ,`) and check:
- **Plugins tab**: Installed plugins show a checkmark
- **LSP tab**: Connected servers show a green status indicator

---

## Troubleshooting

### Claude Code won't start
- Re-run the installer: `irm https://claude.ai/install.ps1 | iex`
- Check that your PATH includes the Claude Code installation directory

### Plugins not loading
- Open Settings → Plugins and verify the plugin shows as installed
- Restart Claude Code after installing plugins
- Check for plugin updates

### LSP not working
- Verify the LSP server is installed and in your PATH
- Open Settings → LSP and check the server status indicator
- Restart Claude Code after adding new language servers

---

## Quick Reference

| Task | How To |
|------|--------|
| Start Claude Code | Run `claude` in terminal |
| Open Settings | `Ctrl + ,` or click gear icon |
| Install plugins | Settings → Plugins → Install |
| Configure LSPs | Settings → LSP → Add Server |
| Update Claude Code | `irm https://claude.ai/install.ps1 \| iex` |

---

## Additional Resources

- [Claude Code Quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Anthropic Console](https://console.anthropic.com)
- [uv Documentation](https://github.com/astral-sh/uv)
