# Faux Language Server

This is a lightweight language server implementation for Monaco Editor that provides language features for a custom recipe format.

## Directory Structure

The code is organized into the following directories:

- **config/**: Contains language configuration files that set up Monaco's language features.
- **constants/**: Contains shared constants used across the language server.
- **providers/**: Contains providers for various language features like code completion.
- **types/**: Contains TypeScript types and interfaces used throughout the codebase.
- **validators/**: Contains validation logic for the recipe format.

## Main Components

1. **Language Configuration**: Defines syntax highlighting, tokens, theme, and other editor behaviors.
2. **Completion Provider**: Provides context-aware code completion for recipe sections, frontmatter, etc.
3. **Validators**: Validate recipe syntax and structure, including frontmatter and content sections.

## Usage

```typescript
import { register, validate } from './faux-language-server';

// Register language features with Monaco
register(monaco);

// Validate a model
const problems = validate(monaco, model);
``` 