# Claude Code Best Practices & Templates

A collection of best practices, templates, and configuration patterns for getting the most out of Claude Code.

## Quick Start Principles

1. **Use mature tech stacks** - LLMs perform better with code patterns they've seen extensively in training data (React, FastAPI, Python, Express, etc.)
2. **Modularize aggressively** - Break code into small, focused modules that Claude can reason about independently
3. **Write SKILL files** - Document how to implement each "module" in your architecture
4. **Add file headers** - Include comments at the top of every file explaining what it does
5. **Use MCP for database access** - Give Claude read-only database access for autonomous debugging
6. **Plan before implementing** - Spend time on high-level design, then let Claude implement E2E
7. **Test-driven development** - Write tests first, run them in CI on every PR
8. **Use tmux for logs** - Run frontend/backend in tmux so Claude can tail logs when needed
9. **Parallel worktrees** - Use git worktrees to run 3-4 agents simultaneously

---

## Recommended Tooling

Modern, fast tools that work well with Claude Code.

### Python

Use **[uv](https://github.com/astral-sh/uv)** instead of pip/venv/pyenv. 10-100x faster, handles everything.

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create project
uv init myproject && cd myproject

# Add dependencies (replaces pip install)
uv add fastapi uvicorn

# Run scripts
uv run python app.py

# Sync from requirements.txt (migration)
uv pip sync requirements.txt
```

Use **[Ruff](https://github.com/astral-sh/ruff)** for linting/formatting (replaces black, flake8, isort):
```bash
uv add --dev ruff
uv run ruff check --fix .
uv run ruff format .
```

### Node/TypeScript

Use **[Bun](https://bun.sh/)** instead of npm/node. 20-30x faster installs, includes runtime + bundler + test runner.

```bash
# Install bun
curl -fsSL https://bun.sh/install | bash

# Create project
bun init

# Add dependencies (replaces npm install)
bun add react next

# Run scripts
bun run dev

# Run TypeScript directly (no build step)
bun run app.ts
```

Use **[Biome](https://biomejs.dev/)** for linting/formatting (replaces eslint, prettier):
```bash
bun add --dev @biomejs/biome
bunx biome check --write .
```

### Summary

| Language | Package Manager | Linter/Formatter | Why |
|----------|----------------|------------------|-----|
| Python | uv | Ruff | 10-100x faster, all-in-one |
| Node/TS | Bun | Biome | 20-30x faster, all-in-one |
| Rust | cargo | rustfmt + clippy | Built-in |
| Go | go mod | gofmt + golangci-lint | Built-in |

---

## Style

### Core Principles

Never use emojis.

### Commit Authorship

- Never add Claude as a commit author
- Always commit using default git settings

### Documentation Style

- Never create `.md` files unless explicitly instructed or tool calls for it.
- Be extremely concise - engineers scan, they don't read novels
- Only include essential information
- Prefer examples over prose - show the pattern, not the theory
- Assume technical competence - skip obvious explanations
- Front-load critical info - put warnings and key concepts first
- Delete verbose explanations - if it takes more than 3 sentences, it's probably too long
- Default to 1-2 sentence explanations. Only expand when complexity absolutely requires it.

---

## Security

### Secrets Handling

- Never read `.env`, `.secrets`, or credential files
- Never print/log secrets in code
- Never hardcode secrets in source files
- Validate secrets by checking length, not content:

```python
# Good
assert len(os.environ.get("API_KEY", "")) > 0, "API_KEY not set"

# Bad - exposes secret
print(f"API_KEY: {os.environ.get('API_KEY')}")
```

```javascript
// Good
if (!process.env.API_KEY?.length) throw new Error("API_KEY not set");

// Bad - exposes secret
console.log(`API_KEY: ${process.env.API_KEY}`);
```

### Files to Never Touch

- `.env`, `.env.*`, `.env.local`, `.env.production`
- `.secrets`, `.secrets/**`
- `**/credentials/**`, `**/secrets/**`
- `*.pem`, `*.key`, `*.p12`
- `.ssh/**`, `.aws/**`, `.gcloud/**`

### Sandbox Mode (Recommended)

Use `/sandbox` to define boundaries where Claude works without prompts. Reduces permission prompts by ~84%.

```
┌─────────────────────────────────────┐
│         SANDBOX BOUNDARY            │
│   (project dir + allowed domains)   │
│                                     │
│     Auto-approved, no prompts       │
└─────────────────────────────────────┘
                 │
                 ▼ exceeds boundary
              [PROMPT]
```

**Enable:**
```bash
/sandbox
```

**How it works:**
- Define allowed paths and network domains upfront
- Operations inside boundaries: auto-approved
- Operations outside boundaries: prompts for approval

**Without sandbox:**
- Every operation prompts (or needs allow list)
- Build permissions over time
- Bash scripts run with full user permissions

**With sandbox:**
- Most operations auto-approved immediately
- OS-level enforcement (Linux bubblewrap, macOS seatbelt)
- Bash scripts also sandboxed

**Auto-enable sandbox for a project:**

Add to `.claude/settings.json` (commit to git for team-wide enforcement):
```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true
  }
}
```

Sandbox activates automatically every time you open the project.

**Note:** `settings.json` deny rules have known reliability issues. `/sandbox` uses OS-level primitives and is more secure.

### Local Secrets with 1Password

Use 1Password CLI to inject secrets at runtime. No `.env` files for Claude to read.

**Install CLI:**
```bash
# macOS
brew install 1password-cli

# Linux
curl -sS https://downloads.1password.com/linux/keys/1password.asc | sudo gpg --dearmor --output /usr/share/keyrings/1password-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/$(dpkg --print-architecture) stable main" | sudo tee /etc/apt/sources.list.d/1password.list
sudo apt update && sudo apt install 1password-cli
```

**Sign in:**
```bash
op account add --address my.1password.com --email you@example.com
eval $(op signin)
```

**Create `op.env` (safe to commit - contains references only):**
```bash
DATABASE_URL="op://Development/MyApp/database_url"
API_SECRET="op://Development/MyApp/api_secret"
STRIPE_KEY="op://Development/Stripe/secret_key"
```

**Run your app:**
```bash
op run --env-file=op.env -- python app.py
op run --env-file=op.env -- npm start
```

Your code reads `os.environ['DATABASE_URL']` normally. Secrets are injected at runtime with no file on disk.

**CI/CD:** Use GitLab/GitHub secrets instead. Same env var names, different injection method:
```yaml
# .gitlab-ci.yml
variables:
  DATABASE_URL: $DATABASE_URL  # From GitLab CI/CD Variables

test:
  script:
    - python app.py  # No op run needed
```

---

## Common Project Structures

### Frontend/Backend Web App

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/    # React/Vue components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API clients
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── api/           # Route handlers
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── schemas/       # Pydantic/validation
│   │   └── utils/         # Helpers
│   ├── tests/
│   ├── requirements.txt
│   └── main.py
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
├── docker-compose.yml
└── README.md
```

### Statistical Analysis Workflow

```
project/
├── data/
│   ├── raw/               # Original, immutable
│   ├── processed/         # Cleaned, transformed
│   └── external/          # Third-party sources
├── src/
│   ├── data/              # Data handling
│   │   ├── loaders.py     # Read from sources
│   │   ├── cleaners.py    # Validation, cleaning
│   │   └── transforms.py  # Feature engineering
│   ├── experiments/       # Analysis code
│   │   ├── models.py      # Statistical models
│   │   ├── runners.py     # Experiment execution
│   │   └── metrics.py     # Evaluation functions
│   └── graphics/          # Visualization
│       ├── plots.py       # Plot generators
│       ├── themes.py      # Style configs
│       └── export.py      # Save to file
├── experiments/
│   └── 2025-01-15_analysis/
│       ├── config.yml
│       ├── results/
│       └── figures/
├── tests/
│   ├── data/
│   ├── experiments/
│   └── graphics/
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
├── pyproject.toml
└── README.md
```

### Data Pipeline / ETL

```
project/
├── pipelines/
│   ├── extract/           # Source connectors
│   ├── transform/         # Data transformations
│   └── load/              # Destination loaders
├── dags/                  # Airflow/orchestration DAGs
├── schemas/
│   ├── source/            # Source schemas
│   └── target/            # Target schemas
├── sql/
│   ├── staging/           # Staging table DDL
│   ├── transforms/        # SQL transformations
│   └── marts/             # Data mart definitions
├── tests/
│   ├── unit/              # Unit tests
│   └── integration/       # Pipeline integration tests
├── config/
│   ├── connections.yml    # Connection configs (no secrets)
│   └── pipelines.yml      # Pipeline definitions
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
├── docker-compose.yml
└── README.md
```

---

## CLAUDE.md Configuration

Create a `CLAUDE.md` file at your repository root. Claude automatically reads this file for context.

### Template Structure

```markdown
# Project: [Name]

## Overview
[1-2 sentence description of what this project does]

## Tech Stack
- Frontend: [e.g., React 18, TypeScript]
- Backend: [e.g., FastAPI, Python 3.11]
- Database: [e.g., PostgreSQL 15]
- Testing: [e.g., pytest, vitest]

## Project Structure
```
src/
├── api/          # API routes and handlers
├── components/   # React components
├── services/     # Business logic
├── models/       # Data models
└── utils/        # Shared utilities
```

## Development Commands
```bash
# Start development servers (run in tmux)
npm run dev          # Frontend on :3000
uvicorn main:app     # Backend on :8000

# Run tests
pytest               # Backend tests
npm test             # Frontend tests

# Build
npm run build
```

## Code Conventions
- Add a comment at the top of every new file explaining its purpose
- Use TypeScript strict mode
- Write unit tests for all new features
- Keep functions under 50 lines

## Testing Requirements
- All PRs must pass CI
- Write tests before implementation (TDD)
- Use testcontainers for database tests

## File Header Convention
Every new file should start with:
```python
"""
[filename].py
Purpose: [What this file does]
"""
```

## Important Notes
- [Any project-specific quirks or warnings]
- [Database access patterns]
- [Authentication flow notes]
```

### Placement Options

| Location | Scope |
|----------|-------|
| `./CLAUDE.md` | Project-specific instructions |
| `~/.claude/CLAUDE.md` | Global preferences (all projects) |
| `./subdir/CLAUDE.md` | Directory-specific context |

### Size Guidelines

| Lines | Action |
|-------|--------|
| < 300 | Ideal for most projects |
| 300-500 | Acceptable for complex projects |
| > 500 | Split into `.claude/rules/` files |

**Hard limit:** ~40,000 characters

**Why it matters:** Claude's system prompt already uses ~50 instructions. LLMs follow ~150-200 instructions consistently. Keep CLAUDE.md focused on universally applicable content.

### Organizing Large Instruction Sets

When CLAUDE.md exceeds 500 lines, two approaches:

| Approach | Loading | Best For |
|----------|---------|----------|
| `.claude/rules/` | Auto-loaded at startup | Universal rules you always want |
| `agent_docs/` | On-demand (progressive disclosure) | Task-specific docs, saves context |

**Option A: Rules (auto-loaded)**

```
.claude/
├── CLAUDE.md              # Main instructions
└── rules/
    ├── code-style.md      # Auto-loaded
    ├── testing.md         # Auto-loaded
    └── security.md        # Auto-loaded
```

Features: recursive discovery, symlinks, user-level rules (`~/.claude/rules/`), path-specific rules via YAML frontmatter.

**Option B: Agent Docs (progressive disclosure)**

```
.claude/
├── CLAUDE.md              # Reference agent_docs here
└── agent_docs/
    ├── api-migration.md
    ├── complex-refactor.md
    └── onboarding.md
```

In CLAUDE.md: "For complex tasks, check `.claude/agent_docs/` first."

**Option C: Both**

```
.claude/
├── CLAUDE.md
├── rules/                 # Always-on universal rules
└── agent_docs/            # On-demand task-specific docs
```

---

## Settings.json Configuration

Configure permissions and tool access. See [`examples/settings.json`](examples/settings.json) for full example.

### File Locations

| File | Scope | Git |
|------|-------|-----|
| `~/.claude/settings.json` | All projects | N/A |
| `.claude/settings.json` | Project (shared) | Commit |
| `.claude/settings.local.json` | Project (personal) | Ignore |

### Permission Patterns

```json
{
  "permissions": {
    "allow": [
      "Bash(git:*)",
      "Bash(npm:*)",
      "Read",
      "Edit",
      "Write"
    ],
    "deny": [
      "Read(.env)",
      "Read(**/.env.*)",
      "Read(**/secrets/**)",
      "Bash(sudo:*)",
      "Bash(rm -rf /)"
    ]
  }
}
```

### Always Deny (Security)

```json
"deny": [
  "Read(.env*)",
  "Read(**/secrets/**)",
  "Read(**/*.pem)",
  "Read(**/.ssh/**)",
  "Bash(sudo:*)",
  "Bash(rm -rf /)",
  "Bash(git push --force)",
  "Bash(curl:* | bash)"
]
```

**Warning:** Deny rules have known reliability issues. Don't store secrets in project directories.

---

## Slash Commands

Built-in commands you can run during a session. Type `/` to see all available commands.

### Core Commands

| Command | What It Does |
|---------|--------------|
| `/help` | List all commands (built-in + custom + MCP) |
| `/init` | Scan project and generate CLAUDE.md |
| `/compact` | Summarize conversation to free up context |
| `/clear` | Wipe conversation completely (fresh start) |
| `/context` | Show token usage (like disk space for your session) |
| `/rewind` | Roll back conversation and/or code to earlier state |
| `/hooks` | Configure hooks interactively |
| `/vim` | Toggle vim keybindings |
| `/theme` | Change appearance |

### /compact vs /clear

| | `/compact` | `/clear` |
|---|---|---|
| Keeps context | Yes (summarized) | No |
| Use when | Long session, need to continue | Starting unrelated task |

**Compact with focus:**
```
/compact Focus on the auth implementation and database schema decisions
```

### /rewind

Roll back mistakes. Press `Esc` twice or type `/rewind`.

**Options:**
- **Conversation only** - Undo Claude's responses, keep code changes
- **Code only** - Revert files, keep conversation
- **Both** - Full rollback to checkpoint

**Note:** Only tracks edits via Claude's tools. Bash commands (`rm`, `mv`), manual edits, and other sessions aren't tracked.

---

## Custom Slash Commands

Create reusable prompts as Markdown files.

### Locations

| Location | Scope | Shared |
|----------|-------|--------|
| `.claude/commands/` | Project | Yes (commit to git) |
| `~/.claude/commands/` | Personal | No |

### Create a Command

`.claude/commands/review.md`:
```markdown
Review the code I just wrote for:
- Security vulnerabilities
- Performance issues
- Edge cases not handled
- Missing error handling

Be concise and actionable.
```

**Use it:** Type `/review` in your session.

### With Arguments

`.claude/commands/test-file.md`:
```markdown
Write tests for $ARGUMENTS

Follow existing test patterns in the codebase.
Use pytest with descriptive test names.
```

**Use it:** `/test-file src/auth/login.py`

### Examples

| Command | Purpose |
|---------|---------|
| `/commit` | Generate commit message from staged changes |
| `/pr` | Create PR with summary |
| `/debug` | Systematic debugging workflow |
| `/refactor` | Analyze and improve code structure |
| `/explain` | Explain code to a junior dev |

Community commands: [wshobson/commands](https://github.com/wshobson/commands) (1.7k stars)

---

## Testing

### Test-Driven Development (TDD)

Always write tests first:

1. Write a failing test
2. Write minimal code to pass
3. Refactor
4. Repeat

### Mirror Folder Structure

Tests must mirror source structure exactly:

```
src/                          tests/
├── api/                      ├── api/
│   ├── routes/               │   ├── routes/
│   │   ├── users.py          │   │   ├── test_users.py
│   │   └── orders.py         │   │   └── test_orders.py
│   └── middleware.py         │   └── test_middleware.py
├── services/                 ├── services/
│   ├── auth.py               │   ├── test_auth.py
│   └── payments.py           │   └── test_payments.py
└── utils/                    └── utils/
    └── helpers.py                └── test_helpers.py
```

### Naming Convention

| Source File | Test File |
|-------------|-----------|
| `users.py` | `test_users.py` |
| `UserService.ts` | `UserService.test.ts` |
| `helpers.go` | `helpers_test.go` |

### Test File Template

```python
"""
test_[module].py
Purpose: Tests for [module] functionality
"""
import pytest
from src.[path].[module] import [function_or_class]


class TestFunctionName:
    """Tests for function_name."""

    def test_returns_expected_output(self):
        """It returns expected output for valid input."""
        result = function_name(valid_input)
        assert result == expected_output

    def test_handles_edge_case(self):
        """It handles edge case correctly."""
        result = function_name(edge_case_input)
        assert result == edge_case_output

    def test_raises_on_invalid_input(self):
        """It raises ValueError for invalid input."""
        with pytest.raises(ValueError):
            function_name(invalid_input)
```

### CI Requirements

- All PRs must pass tests
- Minimum 80% coverage
- No skipped tests without justification

---

## Skills System

Skills are reusable instruction sets for common patterns. Store them in `.claude/skills/`.

### Example: API Route Skill

`.claude/skills/api-route.md`:
```markdown
# Creating API Routes

When creating a new API route:

1. Create handler in `src/api/routes/`
2. Add request/response models in `src/models/`
3. Register route in `src/api/router.py`
4. Write tests in `tests/api/`

## File Structure
```
src/api/routes/[resource].py    # Route handlers
src/models/[resource].py        # Pydantic models
tests/api/test_[resource].py    # Route tests
```

## Template
```python
"""
[resource].py
Purpose: API endpoints for [resource] operations
"""
from fastapi import APIRouter, Depends
from src.models.[resource] import [Resource]Request, [Resource]Response

router = APIRouter(prefix="/[resource]", tags=["[resource]"])

@router.get("/")
async def list_[resources]() -> list[[Resource]Response]:
    pass

@router.post("/")
async def create_[resource](data: [Resource]Request) -> [Resource]Response:
    pass
```
```

### Example: React Component Skill

`.claude/skills/react-component.md`:
```markdown
# Creating React Components

## Structure
```
src/components/[ComponentName]/
├── index.tsx           # Main component
├── [ComponentName].test.tsx  # Tests
└── types.ts            # TypeScript interfaces
```

## Template
```tsx
/**
 * [ComponentName].tsx
 * Purpose: [What this component renders]
 */
import { FC } from 'react';
import { [ComponentName]Props } from './types';

export const [ComponentName]: FC<[ComponentName]Props> = ({ ...props }) => {
  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```
```

---

## shadcn/ui

Copy-paste component library for React + Tailwind. The default UI library for AI coding.

**Docs:** https://ui.shadcn.com/docs/components

### Setup

```bash
npx shadcn@latest init
```

### Components

```bash
npx shadcn@latest add button card dialog dropdown-menu input
npx shadcn@latest add table tabs toast tooltip
```

Full list: https://ui.shadcn.com/docs/components

### Icons (Lucide)

Bundled with shadcn. 1500+ icons.

```tsx
import { Search, Settings, User, ChevronRight, X } from "lucide-react"

<Button><Search className="h-4 w-4 mr-2" /> Search</Button>
```

Browse: https://lucide.dev/icons

### Charts (Recharts)

```bash
npx shadcn@latest add chart
```

Built on Recharts. Types: area, bar, line, pie, radar, radial.

Docs: https://ui.shadcn.com/docs/components/chart

### Blocks

Pre-built page sections (auth, dashboard, settings, etc.):

```bash
npx shadcn@latest add login-01
npx shadcn@latest add dashboard-01
npx shadcn@latest add sidebar-01
```

Browse: https://ui.shadcn.com/blocks

### Themes

5 built-in styles: default, new-york, vega, nova, maia

```bash
npx shadcn@latest init --style new-york
```

Theme generator: https://ui.shadcn.com/themes

---

## MCP Database Configuration

Give Claude read-only database access for autonomous debugging.

### Setup `.mcp.json`

```json
{
  "mcpServers": {
    "postgres-readonly": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://readonly_user:password@localhost:5432/mydb"
      }
    }
  }
}
```

### Create Read-Only Database User

```sql
CREATE USER readonly_user WITH PASSWORD 'password';
GRANT CONNECT ON DATABASE mydb TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_user;
```

---

## Test-Driven Development Setup

### pytest with testcontainers

`tests/conftest.py`:
```python
"""
conftest.py
Purpose: Pytest fixtures including testcontainers database setup
"""
import pytest
from testcontainers.postgres import PostgresContainer

@pytest.fixture(scope="session")
def postgres_container():
    with PostgresContainer("postgres:15") as postgres:
        yield postgres

@pytest.fixture
def db_url(postgres_container):
    return postgres_container.get_connection_url()
```

### GitHub Actions CI

`.github/workflows/test.yml`:
```yaml
name: Tests
on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest --tb=short
```

---

## Tmux Development Setup

Add to your `CLAUDE.md`:

```markdown
## Development Environment

Run services in tmux for log access:

```bash
# Start tmux session
tmux new-session -d -s dev

# Window 0: Frontend
tmux send-keys -t dev:0 'npm run dev' C-m

# Window 1: Backend
tmux new-window -t dev:1
tmux send-keys -t dev:1 'uvicorn main:app --reload' C-m

# Window 2: Tests (watch mode)
tmux new-window -t dev:2
tmux send-keys -t dev:2 'pytest --watch' C-m
```

To check logs: `tmux capture-pane -t dev:[window] -p | tail -50`
```

---

## Git Basics

Essential git commands for working with Claude Code.

### Daily Workflow

```bash
# Check status
git status

# Stage and commit
git add .
git commit -m "feat: add user authentication"

# Push to remote
git push origin main
git push -u origin feature/new-feature  # First push of new branch
```

### Branching

```bash
# Create and switch to new branch
git checkout -b feature/my-feature

# Switch branches
git checkout main
git switch main  # Modern alternative

# List branches
git branch       # Local
git branch -a    # All (including remote)

# Delete branch
git branch -d feature/done      # Safe delete (merged only)
git branch -D feature/abandoned # Force delete
```

### Syncing

```bash
# Get latest from remote
git fetch origin
git pull origin main

# Rebase onto main (cleaner history)
git checkout feature/my-feature
git rebase main

# Merge main into feature (preserves history)
git merge main
```

### Undoing

```bash
# Unstage files
git reset HEAD file.py

# Discard local changes
git checkout -- file.py
git restore file.py  # Modern alternative

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Stashing

```bash
# Save work temporarily
git stash
git stash push -m "WIP: auth feature"

# Restore
git stash pop       # Apply and remove
git stash apply     # Apply and keep

# List stashes
git stash list
```

---

## GitHub CLI (gh)

Command-line tool for GitHub. Faster than browser for PRs and issues.

### Setup

```bash
# Install
brew install gh          # macOS
winget install GitHub.cli # Windows

# Authenticate
gh auth login
```

### Pull Requests

```bash
# Create PR (interactive)
gh pr create

# Create PR (flags)
gh pr create --title "Add auth" --body "Implements login/logout"

# Create draft PR
gh pr create --draft

# List PRs
gh pr list

# View PR
gh pr view 123
gh pr view --web  # Open in browser

# Checkout PR locally
gh pr checkout 123

# Merge PR
gh pr merge 123
gh pr merge 123 --squash  # Squash commits
```

### Issues

```bash
# Create issue
gh issue create --title "Bug: login fails" --body "Steps to reproduce..."

# List issues
gh issue list
gh issue list --assignee @me

# View issue
gh issue view 456

# Close issue
gh issue close 456
```

### Useful Aliases

```bash
# Set up shortcuts
gh alias set prc "pr create --draft"
gh alias set prv "pr view --web"

# Use them
gh prc   # Quick draft PR
gh prv   # Open current PR in browser
```

---

## GitLab CLI (glab)

Same idea as `gh`, for GitLab.

### Setup

```bash
# Install
brew install glab        # macOS
winget install GLab.GLab # Windows

# Authenticate
glab auth login
```

### Common Commands

```bash
# Pull/Merge Requests
glab mr create --title "Add feature" --description "Details..."
glab mr list
glab mr view 123
glab mr merge 123

# Issues
glab issue create --title "Bug report"
glab issue list
glab issue view 456

# CI/CD
glab ci status    # Current pipeline status
glab ci view      # View pipeline in browser
glab ci list      # List recent pipelines
```

---

## Git Worktrees for Parallel Work

Run multiple Claude instances on different features simultaneously.

### Setup Script

```bash
#!/bin/bash
# create-worktree.sh
# Purpose: Create isolated worktree for parallel development

FEATURE=$1
git worktree add ../project-$FEATURE -b feature/$FEATURE
cd ../project-$FEATURE
echo "Ready to work on $FEATURE"
```

### Usage Pattern

```bash
# Terminal 1: Main feature
cd ~/project-main && claude

# Terminal 2: Bug fix (parallel)
./create-worktree.sh bugfix-123
cd ../project-bugfix-123 && claude

# Terminal 3: Another feature (parallel)
./create-worktree.sh new-api
cd ../project-new-api && claude
```

### Cleanup

```bash
git worktree remove ../project-bugfix-123
git branch -d feature/bugfix-123
```

---

## Workflow: Plan → Implement → Test

### 1. Planning Phase

```
You: "I want to add user authentication. Before writing code,
     ask me questions about the requirements and create a plan."

Claude: [Asks clarifying questions]
Claude: [Creates implementation plan]
```

### 2. Implementation (Bypass Mode)

Once plan is approved:
```
You: "Implement the plan. Use bypass mode for autonomous work."
```

### 3. Test & Commit

```
You: "Run all tests and fix any failures. Then commit with
     a descriptive message."
```

---

## Hooks

### Hook Events

| Event | When It Fires |
|-------|---------------|
| `Stop` | Claude finishes responding |
| `Notification` | Claude needs user input |
| `PreToolUse` | Before tool execution |
| `PostToolUse` | After tool execution |

### Notifications + Sound (macOS)

Install: `brew install terminal-notifier`

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "terminal-notifier -message 'Claude finished' -sound default"
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "terminal-notifier -message 'Claude needs input' -sound Basso"
          }
        ]
      }
    ]
  }
}
```

### Sound Only (macOS)

Add to `~/.claude/settings.json`:
```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "afplay /System/Library/Sounds/Glass.aiff"
          }
        ]
      }
    ]
  }
}
```

Other macOS sounds: `Ping.aiff`, `Pop.aiff`, `Purr.aiff`, `Submarine.aiff`

### Notifications + Sound (Windows)

Add to `~/.claude/settings.json`:
```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell -c \"[Windows.UI.Notifications.ToastNotificationManager,Windows.UI.Notifications,ContentType=WindowsRuntime]|Out-Null;$x='<toast><visual><binding template=\\\"ToastGeneric\\\"><text>Claude finished</text></binding></visual><audio src=\\\"ms-winsoundevent:Notification.Default\\\"/></toast>';$d=[Windows.Data.Xml.Dom.XmlDocument]::New();$d.LoadXml($x);[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Claude').Show($d)\""
          }
        ]
      }
    ],
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell -c \"[Windows.UI.Notifications.ToastNotificationManager,Windows.UI.Notifications,ContentType=WindowsRuntime]|Out-Null;$x='<toast><visual><binding template=\\\"ToastGeneric\\\"><text>Claude needs input</text></binding></visual><audio src=\\\"ms-winsoundevent:Notification.IM\\\"/></toast>';$d=[Windows.Data.Xml.Dom.XmlDocument]::New();$d.LoadXml($x);[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier('Claude').Show($d)\""
          }
        ]
      }
    ]
  }
}
```

Works on default Windows PowerShell. No extra installs needed.

### Sound Only (Windows)

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "powershell -c \"(New-Object Media.SoundPlayer 'C:\\Windows\\Media\\notify.wav').PlaySync()\""
          }
        ]
      }
    ]
  }
}
```

Other sounds: `chimes.wav`, `ding.wav`, `tada.wav`

### Sound Only (Linux)

Add to `~/.claude/settings.json`:
```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "paplay /usr/share/sounds/freedesktop/stereo/complete.oga"
          }
        ]
      }
    ]
  }
}
```

### Quality Enforcement Hook

`.claude/hooks/post-tool.sh`:
```bash
#!/bin/bash
# Run after Claude modifies files

if git diff --name-only | grep -q "\.py$"; then
  echo "Running Python checks..."
  python -m py_compile $(git diff --name-only | grep "\.py$")
fi

if git diff --name-only | grep -q "\.tsx\?$"; then
  echo "Running TypeScript checks..."
  npx tsc --noEmit
fi
```

**Note:** `Stop` fires every time Claude pauses, not just on task completion. Occasional extra notifications are normal.

---

## Status Line

Display project, git branch, and context usage: `claude_meta (main) [65%]`

```
/statusline show project name, git branch, and context percentage
```

Claude Code generates the script and config automatically.

---

## Context Management

### Handoff Documents

For long-running tasks, create handoff docs to preserve context:

```markdown
# Handoff: [Feature Name]

## Goal
[What we're trying to accomplish]

## Completed
- [x] Task 1
- [x] Task 2

## Current State
[Where things stand now]

## Blockers
[Any issues encountered]

## Next Steps
1. [Next task]
2. [Following task]

## Key Decisions Made
- Decision 1: [rationale]
- Decision 2: [rationale]
```

### Fresh Sessions

Use `/clear` between unrelated tasks to reset context and improve performance.

---

## Plugins

### Superpowers

[Superpowers](https://github.com/obra/superpowers) enforces structured development workflows: brainstorm → plan → execute → review.

**Install:**
```bash
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

| Phase | Command | Purpose |
|-------|---------|---------|
| 1. Brainstorm | `/superpowers:brainstorm` | Clarify requirements, explore alternatives |
| 2. Plan | `/superpowers:write-plan` | Create detailed task breakdown |
| 3. Execute | `/superpowers:execute-plan` | Implement via subagents with review |
| 4. Review | `/superpowers:code-review` | Validate against plan |

Key principles: TDD enforced, evidence-based completion, subagent review.

### Frontend Design

[Frontend Design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) generates distinctive, production-grade UIs that avoid generic AI aesthetics.

**Install:**
```bash
/plugin marketplace add anthropics/claude-code
/plugin install frontend-design@claude-code-plugins
```

Auto-activates for frontend work. Guides Claude toward bold, intentional design choices instead of cookie-cutter layouts with overused fonts and purple gradients.

Design tones: brutally minimal, maximalist chaos, retro-futuristic, luxury/refined, playful, editorial, brutalist, art deco, soft/pastel, industrial.

### Ralph Loop

[Ralph Loop](https://github.com/frankbria/ralph-claude-code) runs Claude autonomously in a continuous loop until task completion. Named after Ralph Wiggum - perpetually confused, always making mistakes, but never stopping.

**Install:**
```bash
/plugin marketplace add anthropics/claude-code
/plugin install ralph-wiggum@claude-code-plugins
```

**Usage:**
```bash
/ralph-loop "<prompt>" --max-iterations 10
/ralph-loop "<prompt>" --max-iterations 5 --completion-promise "All tests pass"
/cancel-ralph  # Kill active loop
```

When Claude attempts to exit, Ralph re-invokes the prompt preserving context and file changes. Best for batch mechanical work with clear completion criteria. For judgment-heavy work, use normal conversational mode.

**Windows note:** Requires `jq` installed first, or use WSL.

### Document Skills (Office Files)

Create and edit Excel, Word, PowerPoint, and PDF files. From [Anthropic's skills repo](https://github.com/anthropics/skills).

**Install:**
```bash
/plugin marketplace add anthropics/skills
/plugin install document-skills@anthropic-agent-skills
```

**Capabilities:**
- **xlsx** - Create/edit spreadsheets with formulas, formatting, charts, pivot tables
- **docx** - Create/edit Word docs with tracked changes, comments, formatting
- **pptx** - Create/edit PowerPoint presentations
- **pdf** - PDF manipulation, text extraction, merging

Claude generates Python scripts at runtime to manipulate these files. You can also drag-and-drop xlsx/pptx files into Claude Code for analysis.

---

## VS Code Extension

Native Claude Code integration for VS Code (also works with Cursor, Windsurf, VSCodium).

**Install:** Search "Claude Code" in Extensions (Cmd+Shift+X) or visit [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code)

**Requirements:** VS Code 1.98.0+, Claude Pro/Max/Team/Enterprise or API credits

### Features

- Review and edit Claude's plans before accepting
- Auto-accept edits mode
- @-mention files with line ranges from selection
- Real-time diffs with accept/reject buttons
- Multiple conversations in tabs
- Subagents for parallel tasks

### Extension vs CLI

Extension doesn't have full CLI feature parity yet. For CLI-only features, use VS Code's integrated terminal.

**Resume extension conversation in CLI:**
```bash
claude --resume  # Opens picker to select conversation
```

Extension and CLI share conversation history.

---

## Claude Desktop

Standalone desktop app for macOS and Windows with MCP server support.

**Download:** [claude.ai/download](https://claude.ai/download)

### Desktop Extensions (MCP)

One-click install for MCP servers. No manual JSON config needed.

**Install extensions:**
Settings > Extensions > Browse extensions

**Capabilities via MCP:**
- File system access (read/write local files)
- Database connections
- API integrations
- Development tools

### Manual MCP Config

For custom servers, edit `claude_desktop_config.json`:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    }
  }
}
```

### Claude Desktop vs Claude Code

| | Claude Desktop | Claude Code |
|---|---|---|
| Interface | GUI app | Terminal CLI |
| MCP support | Yes (desktop extensions) | Yes (.mcp.json) |
| Code editing | Basic | Full IDE integration |
| Best for | General tasks, file access | Software development |

---

## LSP Integration

Language Server Protocol provides Claude with code intelligence: diagnostics, type info, go-to-definition.

### Enable in Claude Code

```bash
claude config set lsp.enabled true
```

### Common LSPs

| Language | LSP | Install |
|----------|-----|---------|
| Python | Pyright | `npm i -g pyright` |
| TypeScript | tsserver | Bundled with `typescript` |
| Rust | rust-analyzer | `rustup component add rust-analyzer` |
| Go | gopls | `go install golang.org/x/tools/gopls@latest` |

### Benefits

- Real-time error detection before running code
- Type information without reading entire files
- Faster navigation in large codebases

### Project Setup

Ensure your project has proper config files for LSP to work:

| Language | Config File |
|----------|-------------|
| Python | `pyproject.toml` or `pyrightconfig.json` |
| TypeScript | `tsconfig.json` |
| Rust | `Cargo.toml` |
| Go | `go.mod` |

---

## Sources

- [Claude Code Best Practices (Anthropic)](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Claude Code Memory Docs](https://code.claude.com/docs/en/memory)
- [Claude Code Tips (GitHub)](https://github.com/ykdojo/claude-code-tips)
- [Claude Code Tips from 6 Months Use (DEV)](https://dev.to/diet-code103/claude-code-is-a-beast-tips-from-6-months-of-hardcore-use-572n)
- [Superpowers Plugin (GitHub)](https://github.com/obra/superpowers)
