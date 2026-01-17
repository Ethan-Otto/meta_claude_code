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

Plugins extend Claude Code's capabilities. Install them via the CLI or by editing your settings.

### Frontend Design Plugin

Enables high-quality frontend/UI generation with distinctive aesthetics.

```powershell
claude plugins:install frontend-design
```

Or add to your settings (`%APPDATA%\Claude\settings.json`):

```json
{
  "plugins": ["frontend-design"]
}
```

### Superpowers Plugin

Adds enhanced workflows for debugging, TDD, code review, brainstorming, and more.

```powershell
claude plugins:install superpowers
```

### MS Office Suite (Excel, PowerPoint, Word)

Enables Claude to read and manipulate Microsoft Office documents.

```powershell
claude mcp:install ms-office-suite
```

This adds MCP servers for:
- Excel spreadsheet analysis and creation
- PowerPoint presentation generation
- Word document processing

---

## 4. Configure LSPs (Language Server Protocol)

LSPs provide intelligent code completion, diagnostics, and refactoring support.

### Enable LSP Integration

Add to your settings file (`%APPDATA%\Claude\settings.json`):

```json
{
  "lsp": {
    "enabled": true,
    "servers": {
      "typescript": {
        "command": "typescript-language-server",
        "args": ["--stdio"]
      },
      "python": {
        "command": "pylsp",
        "args": []
      },
      "rust": {
        "command": "rust-analyzer",
        "args": []
      }
    }
  }
}
```

### Install LSP Servers

**TypeScript/JavaScript:**
```powershell
npm install -g typescript-language-server typescript
```

**Python:**
```powershell
uv pip install python-lsp-server
```

**Rust:**
```powershell
rustup component add rust-analyzer
```

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

# Check plugins
claude plugins:list

# Check MCP servers
claude mcp:list

# Check uv
uv --version
```

---

## Troubleshooting

### Claude Code won't start
- Ensure Node.js 18+ is installed
- Try running `npm cache clean --force` and reinstalling

### Plugins not loading
- Check your settings.json syntax (use a JSON validator)
- Restart Claude Code after installing plugins

### LSP not working
- Verify the LSP server is installed and in your PATH
- Check the LSP server logs in Claude Code's output

---

## Quick Reference

| Task | Command |
|------|---------|
| Start Claude Code | `claude` |
| Install plugin | `claude plugins:install <name>` |
| List plugins | `claude plugins:list` |
| Install MCP server | `claude mcp:install <name>` |
| List MCP servers | `claude mcp:list` |
| Update Claude Code | `irm https://claude.ai/install.ps1 \| iex` |

---

## Additional Resources

- [Claude Code Quickstart](https://docs.anthropic.com/en/docs/claude-code/quickstart)
- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Anthropic Console](https://console.anthropic.com)
- [uv Documentation](https://github.com/astral-sh/uv)
