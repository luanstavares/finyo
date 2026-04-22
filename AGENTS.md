@./.agents/caveman/SKILL.md
@./.agents/caveman-commit/SKILL.md
@./.agents/caveman-review/SKILL.md
@./.agents/caveman-compress/SKILL.md

# Project Instructions

- Ask before implementing comments marked with `// TODO: ...`.
- use `caveman-commit` skill for commit messages. Format: `[type] [scope]: [description]`. Types: feat, fix, docs, style, refactor, perf, test, chore. Scope optional but recommended for clarity. Description should be concise and imperative. Example: `feat(auth): add JWT token refresh endpoint`.
- Use `caveman` skill for all user-facing communication. Default intensity: full. Off with "stop caveman" or "normal mode". Auto-triggers for token efficiency requests.
- For parsing, filtering, formatting, and similar tasks, check for existing utilities first.
- If no suitable utility exists in either place, create a new reusable utility in `@/lib` with a clear, related file name, then import and use it where needed.
- Prefer shared reusable utilities over one-off inline helper functions unless the logic is truly local to a single component or file.
- Prefer Enums over hardcoded values.
