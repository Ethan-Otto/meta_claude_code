export interface Slide {
  id: number
  title: string
  subtitle?: string
  type: 'title' | 'list' | 'code' | 'comparison' | 'diagram' | 'split'
  content: SlideContent
}

export type SlideContent =
  | { kind: 'title'; tagline: string }
  | { kind: 'numbered'; items: string[] }
  | { kind: 'bullets'; items: Array<{ text: string; detail?: string }> }
  | { kind: 'code'; language: string; code: string; caption?: string }
  | { kind: 'comparison'; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'diagram'; ascii: string; caption?: string }
  | { kind: 'split'; left: string; right: { language: string; code: string } }

export const slides: Slide[] = [
  // 1. Title
  {
    id: 1,
    title: 'Claude Code',
    subtitle: 'Best Practices & Templates',
    type: 'title',
    content: {
      kind: 'title',
      tagline: 'A guide to getting the most out of AI-assisted development'
    }
  },

  // 2. The 9 Principles
  {
    id: 2,
    title: 'The 9 Principles',
    subtitle: 'Core philosophy for working with Claude',
    type: 'list',
    content: {
      kind: 'numbered',
      items: [
        'Use mature tech stacks (React, FastAPI, Python)',
        'Modularize aggressively',
        'Write SKILL files for each module',
        'Add file headers explaining purpose',
        'Use MCP for database access',
        'Plan before implementing',
        'Test-driven development',
        'Use tmux for log access',
        'Parallel worktrees for multiple agents'
      ]
    }
  },

  // 3. Modern Tooling
  {
    id: 3,
    title: 'Modern Tooling',
    subtitle: '10-100x faster development tools',
    type: 'comparison',
    content: {
      kind: 'table',
      headers: ['Language', 'Package Manager', 'Linter', 'Speed'],
      rows: [
        ['Python', 'uv', 'Ruff', '10-100x faster'],
        ['Node/TS', 'Bun', 'Biome', '20-30x faster'],
        ['Rust', 'cargo', 'clippy', 'Built-in'],
        ['Go', 'go mod', 'golangci-lint', 'Built-in']
      ]
    }
  },

  // 4. Python Setup
  {
    id: 4,
    title: 'Python with uv',
    subtitle: 'Replaces pip, venv, pyenv in one tool',
    type: 'code',
    content: {
      kind: 'code',
      language: 'bash',
      code: `# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create project
uv init myproject && cd myproject

# Add dependencies
uv add fastapi uvicorn

# Run scripts
uv run python app.py`,
      caption: 'All-in-one Python tooling'
    }
  },

  // 5. Security: Secrets
  {
    id: 5,
    title: 'Security: Secrets',
    subtitle: 'Never expose sensitive data',
    type: 'split',
    content: {
      kind: 'split',
      left: `**Never touch:**
- .env, .env.*, .env.local
- .secrets, credentials/
- *.pem, *.key, *.p12
- .ssh/, .aws/, .gcloud/

**Validate by length, not content:**`,
      right: {
        language: 'python',
        code: `# Good
assert len(os.environ.get("API_KEY", "")) > 0

# Bad - exposes secret
print(f"API_KEY: {os.environ.get('API_KEY')}")`
      }
    }
  },

  // 6. Sandbox Mode
  {
    id: 6,
    title: 'Sandbox Mode',
    subtitle: 'Reduces permission prompts by 84%',
    type: 'diagram',
    content: {
      kind: 'diagram',
      ascii: `┌─────────────────────────────────────┐
│         SANDBOX BOUNDARY            │
│   (project dir + allowed domains)   │
│                                     │
│     Auto-approved, no prompts       │
└─────────────────────────────────────┘
                 │
                 ▼ exceeds boundary
              [PROMPT]`,
      caption: 'Enable with /sandbox or in settings.json'
    }
  },

  // 7. Project Structure
  {
    id: 7,
    title: 'Project Structure',
    subtitle: 'Frontend/Backend web app',
    type: 'code',
    content: {
      kind: 'code',
      language: 'text',
      code: `project/
├── frontend/
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom hooks
│       ├── services/      # API clients
│       └── types/         # TypeScript types
├── backend/
│   └── src/
│       ├── api/           # Route handlers
│       ├── models/        # Database models
│       ├── services/      # Business logic
│       └── schemas/       # Validation
├── .claude/
│   ├── CLAUDE.md
│   └── rules/
└── docker-compose.yml`
    }
  },

  // 8. CLAUDE.md
  {
    id: 8,
    title: 'CLAUDE.md',
    subtitle: 'Your project\'s instruction manual for Claude',
    type: 'list',
    content: {
      kind: 'bullets',
      items: [
        { text: './CLAUDE.md', detail: 'Project-specific instructions' },
        { text: '~/.claude/CLAUDE.md', detail: 'Global preferences (all projects)' },
        { text: './subdir/CLAUDE.md', detail: 'Directory-specific context' },
        { text: 'Keep under 300 lines', detail: 'Split into .claude/rules/ if larger' },
        { text: 'Include: tech stack, commands, conventions', detail: '' }
      ]
    }
  },

  // 9. Slash Commands
  {
    id: 9,
    title: 'Slash Commands',
    subtitle: 'Built-in commands for your session',
    type: 'comparison',
    content: {
      kind: 'table',
      headers: ['Command', 'Purpose'],
      rows: [
        ['/init', 'Scan project, generate CLAUDE.md'],
        ['/compact', 'Summarize conversation (keep context)'],
        ['/clear', 'Wipe conversation (fresh start)'],
        ['/rewind', 'Roll back conversation and/or code'],
        ['/context', 'Show token usage'],
        ['/sandbox', 'Enable sandbox mode']
      ]
    }
  },

  // 10. Custom Commands
  {
    id: 10,
    title: 'Custom Commands',
    subtitle: 'Reusable prompts as Markdown files',
    type: 'code',
    content: {
      kind: 'code',
      language: 'markdown',
      code: `# .claude/commands/review.md

Review the code I just wrote for:
- Security vulnerabilities
- Performance issues
- Edge cases not handled
- Missing error handling

Be concise and actionable.`,
      caption: 'Use with: /review'
    }
  },

  // 11. Testing: TDD
  {
    id: 11,
    title: 'Test-Driven Development',
    subtitle: 'Write tests first, always',
    type: 'list',
    content: {
      kind: 'numbered',
      items: [
        'Write a failing test',
        'Write minimal code to pass',
        'Refactor',
        'Repeat'
      ]
    }
  },

  // 12. Test Structure
  {
    id: 12,
    title: 'Test Structure',
    subtitle: 'Mirror your source folder exactly',
    type: 'code',
    content: {
      kind: 'code',
      language: 'text',
      code: `src/                     tests/
├── api/                 ├── api/
│   └── routes/          │   └── routes/
│       └── users.py     │       └── test_users.py
├── services/            ├── services/
│   └── auth.py          │   └── test_auth.py
└── utils/               └── utils/
    └── helpers.py           └── test_helpers.py`,
      caption: 'Naming: users.py → test_users.py'
    }
  },

  // 13. Git Worktrees
  {
    id: 13,
    title: 'Git Worktrees',
    subtitle: 'Run multiple Claude instances in parallel',
    type: 'code',
    content: {
      kind: 'code',
      language: 'bash',
      code: `# Terminal 1: Main feature
cd ~/project-main && claude

# Terminal 2: Bug fix (parallel)
git worktree add ../project-bugfix -b feature/bugfix
cd ../project-bugfix && claude

# Terminal 3: Another feature (parallel)
git worktree add ../project-api -b feature/api
cd ../project-api && claude

# Cleanup when done
git worktree remove ../project-bugfix`,
      caption: '3-4 parallel agents = massive productivity'
    }
  },

  // 14. Hooks
  {
    id: 14,
    title: 'Hooks',
    subtitle: 'Get notified when Claude finishes',
    type: 'code',
    content: {
      kind: 'code',
      language: 'json',
      code: `// ~/.claude/settings.json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "terminal-notifier -message 'Claude finished' -sound default"
      }]
    }]
  }
}`,
      caption: 'Events: Stop, Notification, PreToolUse, PostToolUse'
    }
  },

  // 15. Plugins
  {
    id: 15,
    title: 'Plugins',
    subtitle: 'Extend Claude Code capabilities',
    type: 'list',
    content: {
      kind: 'bullets',
      items: [
        { text: 'Superpowers', detail: 'Structured workflows: brainstorm → plan → execute → review' },
        { text: 'Frontend Design', detail: 'Generate distinctive, non-generic UIs' },
        { text: 'Ralph Loop', detail: 'Run Claude autonomously until task completion' },
        { text: 'Document Skills', detail: 'Create/edit Excel, Word, PowerPoint, PDF' }
      ]
    }
  },

  // 16. IDE Integration
  {
    id: 16,
    title: 'IDE Integration',
    subtitle: 'VS Code Extension & Claude Desktop',
    type: 'comparison',
    content: {
      kind: 'table',
      headers: ['Feature', 'VS Code Extension', 'Claude Desktop'],
      rows: [
        ['Interface', 'IDE panel', 'Standalone app'],
        ['Code editing', 'Full integration', 'Basic'],
        ['MCP support', 'Yes (.mcp.json)', 'Yes (extensions)'],
        ['Best for', 'Development', 'General tasks']
      ]
    }
  },

  // 17. Workflow
  {
    id: 17,
    title: 'The Workflow',
    subtitle: 'Plan → Implement → Test',
    type: 'list',
    content: {
      kind: 'numbered',
      items: [
        'Describe what you want, ask Claude to plan first',
        'Review and approve the plan',
        'Let Claude implement (bypass mode for autonomy)',
        'Run tests and fix failures',
        'Commit with descriptive message'
      ]
    }
  },

  // 18. Resources
  {
    id: 18,
    title: 'Resources',
    subtitle: 'Learn more',
    type: 'list',
    content: {
      kind: 'bullets',
      items: [
        { text: 'anthropic.com/engineering/claude-code-best-practices', detail: 'Official guide' },
        { text: 'code.claude.com/docs', detail: 'Documentation' },
        { text: 'github.com/obra/superpowers', detail: 'Superpowers plugin' },
        { text: 'ui.shadcn.com', detail: 'Recommended UI library' }
      ]
    }
  }
]
