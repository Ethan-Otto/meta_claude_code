# Claude Code Best Practices - References

## Official Documentation

- **[Claude Code Memory Docs](https://code.claude.com/docs/en/memory)**
  Official documentation for CLAUDE.md, `.claude/rules/` directory, path-specific rules, symlinks, and memory hierarchy.

- **[Claude Code Best Practices (Anthropic)](https://www.anthropic.com/engineering/claude-code-best-practices)**
  Official guide covering CLAUDE.md setup, tool permissions, MCP configuration, TDD workflows, visual iteration, git worktrees, and multi-Claude patterns.

## Community Resources

- **[Claude Code Tips - 40+ Tips (GitHub)](https://github.com/ykdojo/claude-code-tips)**
  Comprehensive tips collection including system prompt optimization, MCP tool lazy-loading, skills vs commands vs plugins, context management, and container isolation patterns.

- **[Claude Code Tips from 6 Months Use (DEV Community)](https://dev.to/diet-code103/claude-code-is-a-beast-tips-from-6-months-of-hardcore-use-572n)**
  Real-world tips on hooks for build/error checking, PM2 process management, dev docs system, and specialized agents.

- **[How I Use Every Claude Code Feature (Shrivu Shankar)](https://blog.sshh.io/p/how-i-use-every-claude-code-feature)**
  Detailed walkthrough of Claude Code features and practical usage patterns.

- **[How I use Claude Code + Best Tips (Builder.io)](https://www.builder.io/blog/claude-code)**
  Practical tips for daily Claude Code usage.

- **[Claude Code Best Practices (rosmur)](https://rosmur.github.io/claudecode-best-practices/)**
  Community-maintained best practices collection.
  - GitHub: https://github.com/rosmur/claudecode-best-practices

- **[Mastering the Vibe: Claude Code Best Practices (Medium)](https://dinanjana.medium.com/mastering-the-vibe-claude-code-best-practices-that-actually-work-823371daf64c)**
  Practical workflows and patterns that work in production.

- **[Getting Good Results from Claude Code (Chris Dzombak)](https://www.dzombak.com/blog/2025/08/getting-good-results-from-claude-code/)**
  Tips for improving Claude Code output quality.

- **[ZacheryGlass/.claude (GitHub)](https://github.com/ZacheryGlass/.claude)**
  Personal Claude Code configuration with settings.json, custom hooks, status line scripts. Source for style guidelines: no emojis, commit authorship rules, concise documentation principles.

## Original Source

- **[What I Learned from Writing 500K Lines with Claude Code (Reddit)](https://www.reddit.com/r/ClaudeCode/comments/1px2umk/what_i_learned_from_writing_500k_lines_with/)**
  Original post with key insights:
  - Use popular stacks with older versions (React, FastAPI, Python)
  - Write SKILL files for each module in your architecture
  - Add file header comments for autonomous navigation
  - Use MCP for read-only database access
  - Plan features before bypass mode implementation
  - TDD with testcontainers and CI on every PR
  - Run frontend/backend in tmux for log access
  - Use git worktrees for 3-4 parallel agents

## Video Tutorials

- Search YouTube for "Claude Code tutorial" and "Claude Code workflow" for visual walkthroughs

## Related Tools

- **[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)** - Protocol for connecting Claude to external tools and data sources
- **[Testcontainers](https://testcontainers.com/)** - Library for running containers in tests
- **[tmux](https://github.com/tmux/tmux)** - Terminal multiplexer for managing development sessions
