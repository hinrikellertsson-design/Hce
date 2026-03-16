# CLAUDE.md

This file provides guidance for AI assistants working in this repository.

## Repository Overview

**Name:** Hce
**Status:** Early-stage / bootstrapping
**Branch model:** `main` is the default branch; feature work goes on `claude/<description>-<id>` branches.

The repository currently contains only a `README.md` placeholder. This file will be updated as the project grows.

## Repository Structure

```
Hce/
├── README.md        # Project overview (placeholder)
└── CLAUDE.md        # This file
```

## Git Conventions

### Branching
- Default branch: `main`
- AI-assisted branches: `claude/<short-description>-<session-id>`
- Never push directly to `main` without a pull request.

### Commits
- Use short, imperative commit messages (e.g. `Add authentication module`, `Fix null pointer in parser`).
- One logical change per commit.
- Reference issue numbers when applicable (e.g. `Fix login bug (#42)`).

### Push workflow
```bash
git push -u origin <branch-name>
```
- Retry up to 4 times with exponential backoff (2s, 4s, 8s, 16s) on network failures.
- Never force-push to `main`.

## Development Workflow

Since the project is in its early stage, these are the expected conventions to follow as code is added:

1. **Create a feature branch** from `main`.
2. **Make changes** with clear, focused commits.
3. **Push** the branch and open a pull request against `main`.
4. **Do not merge** without review.

## AI Assistant Guidelines

- Always read existing files before modifying them.
- Do not create files unless clearly necessary.
- Keep changes minimal and focused on the task at hand.
- When the project structure grows, update this file to reflect new directories, workflows, build commands, and conventions.
- Do not commit secrets, credentials, or large binaries.

## Updating This File

As the codebase evolves, keep this file current by updating:
- The repository structure diagram
- Build/test/lint commands once they exist
- Any framework-specific conventions introduced
- Environment setup instructions
