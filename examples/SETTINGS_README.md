# settings.json Configuration

## File Locations

| File | Scope | Git |
|------|-------|-----|
| `~/.claude/settings.json` | All projects (user) | N/A |
| `.claude/settings.json` | Project (shared) | Commit |
| `.claude/settings.local.json` | Project (personal) | Ignore |

## Precedence (highest to lowest)

1. Enterprise managed policies
2. CLI arguments
3. `.claude/settings.local.json`
4. `.claude/settings.json`
5. `~/.claude/settings.json`

## Permission Patterns

```
Tool(pattern)
```

**Tools:** `Bash`, `Read`, `Edit`, `Write`, `WebFetch`

**Wildcards:**
- `*` matches anything
- `**` matches directories recursively

**Examples:**
```json
"Bash(npm:*)"           // npm with any args
"Bash(git status)"      // exact match
"Read(**/.env)"         // .env in any directory
"WebFetch(domain:github.com)"  // specific domain
```

## Recommended Deny Rules

Always deny:
- `.env` files and secrets
- SSH/AWS/GCloud credentials
- Destructive commands (`rm -rf /`, `sudo`)
- Force pushes to main/master
- System commands (`shutdown`, `reboot`)

## Known Issues

- Deny rules may not be enforced reliably (see GitHub issues #6631, #10256)
- Test your deny rules before trusting them with sensitive data
- Consider not storing secrets in project directories at all

## Sources

- [Claude Code Settings Docs](https://code.claude.com/docs/en/settings)
- [Claude Code Permissions Guide](https://www.eesel.ai/blog/claude-code-permissions)
