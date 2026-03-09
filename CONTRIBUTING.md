# Contributing to Mulphilog

Thank you for your interest in contributing to mulphilog! We welcome contributions from the community and are grateful for any help, whether it's fixing bugs, adding new features, improving documentation, or reporting issues.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Release Process](#release-process)
- [Need Help?](#need-help)

## Code of Conduct

Be respectful and considerate in all interactions. We aim to foster an inclusive and welcoming environment for all contributors.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 20.0.0
- **pnpm**: 10.30.3 or higher (package manager)
- **Git**: For version control

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/mulphilog.git
cd mulphilog
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/hammadmajid/mulphilog.git
```

## Development Setup

1. Install dependencies:

```bash
pnpm install
```

2. Verify your setup by running the test suite:

```bash
pnpm test:run
```

3. Build the project:

```bash
pnpm build
```

## Development Workflow

### 1. Create a Branch

Create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-number-description
```

Branch naming conventions:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `chore/` - Build process or tooling changes

### 2. Keep Your Branch Updated

Regularly sync with the upstream repository:

```bash
git fetch upstream
git rebase upstream/main
```

## Making Changes

### Code Guidelines

- Write TypeScript code following the existing patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused on a single responsibility
- Use Zod schemas for runtime validation
- Follow the Result pattern for error handling (see existing code)

### Adding New Features

When adding new features:

1. Check if there's an open issue or create one to discuss the feature
2. Implement the feature in the `src/` directory
3. Add corresponding tests in the `test/` directory
4. Update documentation in `README.md` if necessary
5. Add an entry to the `[Unreleased]` section in `CHANGELOG.md`

### Fixing Bugs

When fixing bugs:

1. Reference the issue number in your commit message
2. Add a test case that reproduces the bug
3. Implement the fix
4. Verify the test now passes
5. Update `CHANGELOG.md` under `[Unreleased]` > `Fixed`

## Testing

We use [Vitest](https://vitest.dev/) for testing. Tests are located in the `test/` directory.

### Running Tests

```bash
# Run tests in watch mode
pnpm test

# Run tests once
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run tests with UI
pnpm test:ui
```

### Coverage Requirements

- Minimum coverage threshold: **75%**
- All new features must include tests
- Bug fixes should include regression tests

### Writing Tests

```typescript
// test/unit/example.test.ts
import { describe, it, expect } from "vitest";
import { yourFunction } from "../../src/your-module";

describe("yourFunction", () => {
  it("should handle valid input", () => {
    const result = yourFunction("valid-input");
    expect(result.ok).toBe(true);
  });

  it("should handle invalid input", () => {
    const result = yourFunction("invalid-input");
    expect(result.ok).toBe(false);
  });
});
```

## Code Style

We use [oxlint](https://oxc.rs/) and [oxfmt](https://oxc.rs/) for linting and formatting.

### Linting

```bash
# Check for linting issues
pnpm lint

# Fix linting issues automatically
pnpm lint:fix
```

### Formatting

```bash
# Format code
pnpm fmt

# Check formatting without making changes
pnpm fmt:check
```

### Pre-commit Hooks

We use [husky](https://typicode.github.io/husky/) and [nano-staged](https://github.com/usmanyunusov/nano-staged) to automatically format code before commits. This ensures consistent code style across the project.

The pre-commit hook will automatically:

- Format `.js`, `.ts`, `.json`, and `.md` files
- Run formatting on staged files only

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Changes to build process, tooling, etc.
- `perf`: Performance improvements

### Examples

```bash
feat(tracking): add shipment status history endpoint

fix(client): handle timeout errors correctly

docs(readme): update installation instructions

test(tracking): add test cases for error scenarios
```

## Pull Request Process

### Before Submitting

1. Ensure all tests pass: `pnpm test:run`
2. Verify code coverage meets threshold: `pnpm test:coverage`
3. Check linting: `pnpm lint`
4. Check formatting: `pnpm fmt:check`
5. Build successfully: `pnpm build`
6. Update `CHANGELOG.md` with your changes under `[Unreleased]`

### Submitting a PR

1. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

2. Open a Pull Request on GitHub with:
   - **Clear title** following commit message conventions
   - **Description** of what changed and why
   - **Reference** to related issues (e.g., "Fixes #123")
   - **Test coverage** - mention if tests were added/updated
   - **Screenshots** (if applicable for documentation changes)

3. Wait for review and address any feedback

### PR Checklist

- [ ] Tests pass locally and on CI
- [ ] Code coverage meets threshold (75%)
- [ ] Code is linted and formatted
- [ ] CHANGELOG.md updated
- [ ] Documentation updated (if needed)
- [ ] No merge conflicts with main branch
- [ ] PR description is clear and complete

## Project Structure

```
mulphilog/
├── src/
│   ├── client.ts          # Main client implementation
│   ├── config.ts          # Configuration handling
│   ├── endpoints/         # API endpoint implementations
│   ├── errors.ts          # Error definitions
│   ├── index.ts           # Public API exports
│   ├── models/            # Data models
│   ├── schemas/           # Zod validation schemas
│   └── types/             # TypeScript type definitions
├── test/
│   ├── fixtures/          # Test data and mocks
│   ├── integration/       # Integration tests
│   ├── unit/              # Unit tests
│   └── utils/             # Test utilities
├── dist/                  # Compiled output (generated)
├── coverage/              # Coverage reports (generated)
├── .github/workflows/     # CI/CD workflows
├── .husky/                # Git hooks
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # This file
├── LICENSE                # MIT License
├── README.md              # Project documentation
├── SECURITY.md            # Security policy
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
└── vitest.config.ts       # Test configuration
```

## Release Process

Releases are handled by maintainers. The process involves:

1. Update version in `package.json`
2. Move `[Unreleased]` changes to a new version section in `CHANGELOG.md`
3. Add release date to the changelog
4. Commit changes: `git commit -m "chore: release v0.x.x"`
5. Create a git tag: `git tag v0.x.x`
6. Push changes and tag: `git push origin main --tags`
7. GitHub Actions will automatically publish to npm and JSR

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Breaking changes (not yet at 1.0.0)
- **MINOR** version: New features (backward compatible)
- **PATCH** version: Bug fixes (backward compatible)

## Need Help?

### Questions

If you have questions about contributing:

- Check existing [issues](https://github.com/hammadmajid/mulphilog/issues) and [pull requests](https://github.com/hammadmajid/mulphilog/pulls)
- Open a [new issue](https://github.com/hammadmajid/mulphilog/issues/new) with the `question` label
- Contact the maintainer: [hammadmajid@proton.me](mailto:hammadmajid@proton.me)

### Finding Issues to Work On

Looking for something to work on? Check out:

- Issues labeled [`good first issue`](https://github.com/hammadmajid/mulphilog/labels/good%20first%20issue)
- Issues labeled [`help wanted`](https://github.com/hammadmajid/mulphilog/labels/help%20wanted)

### Reporting Bugs

When reporting bugs, please include:

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Minimal code example that demonstrates the issue
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**: Node.js version, OS, package version
- **Logs/Errors**: Any relevant error messages or stack traces

### Suggesting Features

When suggesting features:

- Check if the feature has already been requested
- Provide a clear use case for the feature
- Explain how it aligns with the project's goals
- Consider if it could be implemented as a separate package

## Thank You!

Your contributions make this project better. We appreciate your time and effort in helping improve mulphilog!

---

**Note**: This project is not affiliated with Mulphilog (M&P) courier company. We are building an independent open-source client library for their API.
