# Palette Pally - Developer Guide

Comprehensive Operations and Maintenance Manual for Developers

English | [日本語](./DEVELOPMENT.ja.md)

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Development Environment Setup](#development-environment-setup)
- [Architecture](#architecture)
- [Development Workflow](#development-workflow)
- [Coding Conventions](#coding-conventions)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)
- [Operations & Maintenance](#operations--maintenance)
- [Troubleshooting](#troubleshooting)

## Project Overview

Palette Pally is a web application for creating and managing Material-UI color palettes. Built with Next.js, React, and TypeScript, it provides a highly customizable UI and real-time color preview features.

### Primary Goals

1. **Flexibility**: Flexible architecture to support large-scale design systems
2. **Usability**: Intuitive UI with comprehensive documentation
3. **Extensibility**: Modular design for easy feature additions
4. **Performance**: Fast loading and smooth interactions

## Tech Stack

### Core Technologies

- **Framework**: Next.js 14.x (App Router)
- **Language**: TypeScript 5.x
- **UI Library**: React 19.x
- **Styling**: Tailwind CSS 3.x
- **Components**: Radix UI

### Key Libraries

```json
{
  "react-colorful": "Color picker",
  "next-themes": "Theme management",
  "class-variance-authority": "Component variations",
  "tailwind-merge": "Tailwind class merging",
  "lucide-react": "Icons",
  "sonner": "Toast notifications"
}
```

### Development Tools

- **Build Tool**: Next.js built-in (Turbopack)
- **Linter**: ESLint
- **Testing**: Vitest
- **Version Control**: Git

## Project Structure

```
Palette-Pally-v0/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── globals.css          # Global styles
│
├── components/              # React components
│   ├── ui/                  # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── color-picker.tsx     # Color picker
│   ├── mui-color-picker.tsx # MUI color picker
│   ├── mui-color-display.tsx # Color display
│   ├── ui-settings-panel.tsx # UI settings panel
│   └── ...
│
├── lib/                     # Utilities & helpers
│   ├── color-utils.ts       # Color conversion & calculation
│   ├── color-constants.ts   # Color constants
│   ├── ui-config-context.tsx # UI config context
│   └── utils.ts             # General utilities
│
├── types/                   # TypeScript type definitions
│   ├── palette.ts           # Palette type definitions
│   └── ui-config.ts         # UI config type definitions
│
├── constants/               # Constants
│   └── app-constants.ts     # Application constants
│
├── styles/                  # Style files
│   └── globals.css          # Additional global styles
│
└── public/                  # Static files
    └── ...
```

### Key File Descriptions

#### `/app/page.tsx`
Main page component. Handles color palette management, state management, and UI integration.

#### `/lib/ui-config-context.tsx`
Global context for UI settings. Manages layout, theme, and spacing configurations.

#### `/types/ui-config.ts`
Type definitions for UI configuration, default values, and preset configurations.

#### `/components/ui-settings-panel.tsx`
Settings panel for modifying UI configurations.

#### `/lib/color-utils.ts`
Utilities for color conversion (HEX, RGB, HSL, Oklab), contrast ratio calculation, WCAG assessment, etc.

## Development Environment Setup

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later (or yarn/pnpm)
- Git

### Setup Steps

```bash
# 1. Clone repository
git clone https://github.com/yourusername/Palette-Pally-v0.git
cd Palette-Pally-v0

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Open http://localhost:3000 in browser
```

### Development Commands

```bash
# Start development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Run tests
npm run test

# Run tests (UI mode)
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Architecture

### Component Architecture

```
UIConfigProvider (Context)
└── App Layout
    └── Main Page
        ├── Header
        │   ├── Logo
        │   ├── Help Modal
        │   ├── UI Settings Panel
        │   └── Theme Toggle
        │
        ├── Tabs
        │   ├── Theme Colors Tab
        │   │   ├── Color Picker (multiple)
        │   │   └── Color Display (multiple)
        │   │
        │   ├── Additional Colors Tab
        │   │   ├── Text Colors Editor
        │   │   ├── Background Colors Editor
        │   │   └── Grey Palette Editor
        │   │
        │   └── System Colors Tab
        │       ├── Action Colors Editor
        │       └── Common Colors Editor
        │
        └── Export/Import Panel
```

### State Management

#### 1. Local State (useState)

Managed in main page (`app/page.tsx`):
- Color palette data
- Text colors
- Background colors
- Action colors
- Grey palette
- Mode (light/dark)

#### 2. Context (React Context)

Managed by `UIConfigProvider`:
- Layout settings
- Theme settings
- UI setting presets

#### 3. Local Storage

Persisted data:
- Color palette settings
- UI settings
- User preferences

### Data Flow

```
User Action
    ↓
Event Handler (onClick, onChange)
    ↓
State Update (setState)
    ↓
Save to Local Storage
    ↓
UI Re-render
    ↓
Update CSS Variables (for UI settings)
```

### UI Settings System

1. **Load Settings**: `UIConfigProvider` loads settings from local storage on mount
2. **Apply CSS Variables**: `applyConfigToDOM()` sets CSS custom properties
3. **Reactive Updates**: When settings change, CSS variables are immediately updated and reflected in UI
4. **Persistence**: All changes are automatically saved to local storage

## Development Workflow

### Adding New Features

#### 1. Planning
- Create feature request on GitHub Issues
- Document design
- Identify required changes

#### 2. Create Branch
```bash
git checkout -b feature/your-feature-name
```

#### 3. Development
- Create/modify components
- Add/update type definitions
- Add styles
- Create utility functions (as needed)

#### 4. Testing
```bash
npm run test
npm run lint
```

#### 5. Commit
```bash
git add .
git commit -m "feat: add your feature description"
```

Commit message conventions:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code formatting
- `refactor:` Refactoring
- `test:` Add tests
- `chore:` Build/config changes

#### 6. Pull Request
```bash
git push origin feature/your-feature-name
```
Create pull request on GitHub

### Example: Adding New UI Setting Option

#### Step 1: Update Type Definitions

`types/ui-config.ts`:
```typescript
export interface ThemeConfig {
  // ...existing properties
  newOption: string // new option
}

export const DEFAULT_UI_CONFIG: UIConfig = {
  // ...
  theme: {
    // ...
    newOption: "default-value"
  }
}
```

#### Step 2: Update Context

`lib/ui-config-context.tsx`:
```typescript
const applyConfigToDOM = (cfg: UIConfig) => {
  // ...existing code
  root.style.setProperty("--new-option", cfg.theme.newOption)
}
```

#### Step 3: Update UI Component

`components/ui-settings-panel.tsx`:
```typescript
<div className="space-y-2">
  <Label>New Option</Label>
  <RadioGroup
    value={config.theme.newOption}
    onValueChange={(value) => updateTheme({ newOption: value })}
  >
    {/* options */}
  </RadioGroup>
</div>
```

#### Step 4: Add CSS

`app/globals.css`:
```css
:root {
  --new-option: default-value;
}

.uses-new-option {
  property: var(--new-option);
}
```

## Coding Conventions

### TypeScript

```typescript
// ✅ Good: Explicit types
interface Props {
  name: string
  age: number
}

// ❌ Bad: Unclear types
const handleClick = (data: any) => { }

// ✅ Good: Explicit types
const handleClick = (data: ColorData) => { }
```

### React Components

```typescript
// ✅ Good: Function component with TypeScript
interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}

// ❌ Bad: No type definitions
export function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}
```

### File Naming Conventions

- Components: `kebab-case.tsx` (e.g., `ui-settings-panel.tsx`)
- Utilities: `kebab-case.ts` (e.g., `color-utils.ts`)
- Type definitions: `kebab-case.ts` (e.g., `ui-config.ts`)

### Import Order

```typescript
// 1. React & Next.js
import { useState, useEffect } from "react"
import Link from "next/link"

// 2. Third-party libraries
import { HexColorPicker } from "react-colorful"

// 3. Internal components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 4. Utilities & types
import { cn } from "@/lib/utils"
import type { ColorData } from "@/types/palette"
```

## Testing

### Testing Strategy

1. **Unit Tests**: Individual functions and utilities
2. **Component Tests**: UI component behavior
3. **Integration Tests**: Component interactions
4. **E2E Tests**: Full user flows (future implementation)

### Test Example

`lib/color-utils.test.ts`:
```typescript
import { describe, it, expect } from "vitest"
import { hexToRgb, calculateContrastRatio } from "./color-utils"

describe("color-utils", () => {
  describe("hexToRgb", () => {
    it("should convert HEX to RGB", () => {
      const result = hexToRgb("#FF0000")
      expect(result).toEqual({ r: 255, g: 0, b: 0 })
    })
  })

  describe("calculateContrastRatio", () => {
    it("should calculate contrast ratio", () => {
      const ratio = calculateContrastRatio("#FFFFFF", "#000000")
      expect(ratio).toBeCloseTo(21, 0)
    })
  })
})
```

### Running Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage report
npm run test:coverage

# Tests with UI
npm run test:ui
```

## Build & Deployment

### Production Build

```bash
# Build
npm run build

# Check build result
npm run start
```

### Deployment

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect GitHub repository to Vercel for automatic deployment.

#### Other Platforms

- **Netlify**: Configure static export in `next.config.js`
- **AWS Amplify**: Set build commands
- **Cloudflare Pages**: Check Next.js support

### Environment Variables

Currently not using environment variables, but for future additions:

`.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Operations & Maintenance

### Regular Maintenance

#### Updating Dependencies

```bash
# Check dependencies
npm outdated

# Minor updates
npm update

# Major updates (requires caution)
npm install package@latest
```

#### Security Audit

```bash
# Vulnerability scan
npm audit

# Auto-fix (when possible)
npm audit fix
```

### Performance Monitoring

1. **Lighthouse**: Regular score checks
2. **Core Web Vitals**: Measure LCP, FID, CLS
3. **Bundle Analyzer**: Analyze bundle size

```bash
# Next.js Bundle Analyzer
npm install @next/bundle-analyzer
```

`next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // config
})
```

Run:
```bash
ANALYZE=true npm run build
```

### Database (Future)

Currently using local storage, but for future backend additions:

1. **Supabase**: PostgreSQL + Auth
2. **Firebase**: Firestore + Auth
3. **PlanetScale**: MySQL compatible

### Monitoring & Logging

Production environment monitoring:

1. **Vercel Analytics**: Automatically enabled
2. **Sentry**: Error tracking
3. **LogRocket**: Session replay

## Troubleshooting

### Common Issues and Solutions

#### Build Errors

**Issue**: `Type error: Cannot find module`

**Solution**:
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

#### Styles Not Applied

**Issue**: Tailwind classes not working

**Solution**:
1. Check content paths in `tailwind.config.js`
2. Restart development server
3. Clear browser cache

#### Local Storage Issues

**Issue**: Settings not saving

**Solution**:
```javascript
// Check storage
console.log(localStorage.getItem("palette-pally-ui-config"))

// Clear storage
localStorage.clear()
```

#### TypeScript Errors

**Issue**: Type definitions not found

**Solution**:
```bash
# Regenerate type definitions
npm run build
```

### Debug Tools

```typescript
// Output color data to console
console.log("Color Data:", colorData)

// Output UI config
console.log("UI Config:", config)

// Check local storage contents
console.log("Storage:", {
  palette: localStorage.getItem("mui-color-palette"),
  uiConfig: localStorage.getItem("palette-pally-ui-config"),
})
```

### Performance Debugging

```typescript
// Track render count
useEffect(() => {
  console.log("Component rendered")
}, [])

// Measure performance
console.time("operation")
// ... processing
console.timeEnd("operation")
```

## Contribution Guidelines

### Pull Request Checklist

- [ ] Code passes linter
- [ ] All tests pass
- [ ] Tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] Changes maintain backward compatibility

### Code Review Process

1. Create pull request
2. CI/CD checks pass
3. Assign reviewers
4. Address feedback
5. Merge after approval

## Release Process

### Versioning

Using Semantic Versioning (SemVer):

- **MAJOR**: Breaking changes (e.g., 1.0.0 → 2.0.0)
- **MINOR**: Backward-compatible new features (e.g., 1.0.0 → 1.1.0)
- **PATCH**: Bug fixes (e.g., 1.0.0 → 1.0.1)

### Release Steps

```bash
# 1. Update version
npm version patch # or minor, major

# 2. Update CHANGELOG
# Add changes to CHANGELOG.md

# 3. Commit & push
git push origin main --tags

# 4. Create release on GitHub
# Add release notes

# 5. Deploy
# Vercel automatically deploys
```

## Support & Resources

- **Documentation**: [README.md](./README.md)
- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/Palette-Pally-v0/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/Palette-Pally-v0/discussions)

---

For questions or suggestions about development, feel free to contact us on GitHub Issues or Discussions.
