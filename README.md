# Palette Pally

Material-UI Color Palette Designer and Manager

[日本語](./README.ja.md) | English

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
  - [Creating Color Palettes](#creating-color-palettes)
  - [UI Customization](#ui-customization)
  - [Export & Import](#export--import)
- [UI Settings Guide](#ui-settings-guide)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

Palette Pally is a powerful tool for creating and managing Material-UI color palettes. With its intuitive UI and flexible customization options, you can efficiently design color palettes for your design system.

### Features

- 🎨 **Real-time Preview**: See color changes instantly
- 🔧 **Fully Customizable**: Adjust layout, theme, and spacing freely
- 📱 **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- 💾 **Auto-save**: Settings saved to local storage
- 📦 **Export Options**: Output in JSON, TypeScript, and CSS formats
- ♿ **Accessibility**: Automatic WCAG contrast ratio calculation
- 🌙 **Dark Mode**: Toggle between light and dark themes

## Key Features

### 1. Color Management

- **Theme Colors**: Primary, Secondary, Error, Warning, Info, Success
- **Custom Colors**: Add your own color roles
- **Color Variations**: Auto-generate Main, Light, Lighter, Dark, ContrastText
- **Grey Palette**: Complete greyscale from 50-900, A100-A700

### 2. UI Flexibility

- **Layout Modes**:
  - Grid: Cards arranged in a grid
  - List: Vertical single-column display
  - Compact: Dense grid display

- **View Density**: Comfortable / Standard / Compact

- **Customization Options**:
  - Card Size (Small / Medium / Large)
  - Column Count (1-6 columns)
  - Spacing (Tight / Normal / Loose)
  - Border Radius (0-16px)
  - Card Shadow (0-5 levels)
  - Animation Speed
  - Font Size

### 3. Color Picker Features

- **Multiple Color Models**:
  - HEX
  - RGB
  - HSL
  - Oklab

- **Accessibility Checks**:
  - Display WCAG contrast ratios
  - Auto-determine AAA/AA/A levels

### 4. Export & Import

- **Export Formats**:
  - JSON (complete configuration data)
  - TypeScript (with type definitions)
  - CSS Variables
  - MUI ThemeProvider code

- **Import Features**:
  - Import existing settings in JSON format
  - Built-in validation

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Palette-Pally-v0.git
cd Palette-Pally-v0

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build

```bash
# Production build
npm run build

# Preview build locally
npm run start
```

## Usage Guide

### Creating Color Palettes

#### Step 1: Select Base Colors

1. Open the **Theme Colors** tab
2. Click on a color card you want to change (e.g., Primary)
3. Select a color using the color picker or enter a HEX code directly
4. Variations (Light, Lighter, Dark) are automatically generated

#### Step 2: Add Custom Colors

1. Click the **Add Color** button
2. Enter a color name (e.g., "brand")
3. Select a color type:
   - **Theme**: Automatically generates variations
   - **Simple**: Single color with contrast text
4. Click **Add**

#### Step 3: Configure Additional Colors

1. Open the **Additional Colors** tab
2. Set text colors (Primary, Secondary, Disabled)
3. Set background colors (Default, Paper)
4. Set divider color
5. Customize grey palette (50-900)

#### Step 4: Configure System Colors

1. Open the **System Colors** tab
2. Set action colors (Active, Hover, Selected, etc.)
3. Set common colors (Black, White)

#### Step 5: Save

1. Click the **Save** button in the top right
2. Settings are saved to local storage
3. Automatically restored on next visit

### UI Customization

#### Using Presets

1. Click the **UI Settings** button in the top right
2. Select a preset in the **Quick Presets** section:
   - **Minimal**: Simple, streamlined layout
   - **Spacious**: Generous, airy layout
   - **Compact**: Display more information at once
   - **Default**: Return to standard settings

#### Custom Settings

##### Layout Settings

1. Select **Layout Mode**:
   - **Grid**: Cards arranged in a grid
   - **List**: Vertical single-column display
   - **Compact**: Dense grid

2. Select **View Density**:
   - **Comfortable**: Large spacing
   - **Standard**: Standard spacing
   - **Compact**: Minimal spacing

3. Select **Card Size**:
   - **Small**: Small cards
   - **Medium**: Standard size
   - **Large**: Large cards

4. Set **Desktop Columns** (1-6 columns)

5. Select **Spacing**:
   - **Tight**: Narrow spacing
   - **Normal**: Standard spacing
   - **Loose**: Wide spacing

##### Theme Settings

1. Select **Border Radius** (0-16px)
   - 0px: Square design
   - 8px: Standard rounding
   - 16px: Heavily rounded

2. Select **Card Shadow** (0-5)
   - 0: No shadow (flat design)
   - 1-2: Subtle shadow
   - 3-5: Prominent shadow

3. Select **Animation Speed**:
   - **Slow**: Slow animations
   - **Normal**: Standard speed
   - **Fast**: Fast animations
   - **Off**: No animations

4. Select **Font Size**:
   - **Small**: Small text (12px)
   - **Normal**: Standard text (14px)
   - **Large**: Large text (16px)

### Export & Import

#### Export

1. Click the **Export** button
2. Select export format:
   - **JSON**: Complete configuration data
   - **TypeScript**: TypeScript type definitions
   - **CSS**: CSS variables
   - **MUI Theme**: MUI ThemeProvider code

3. Click **Copy** to copy to clipboard
4. Or **Download** to save as JSON file

#### Import

1. Click the **Import** button
2. Import using two methods:
   - **From File**: Select a JSON file
   - **Paste**: Paste JSON data directly

3. Click the **Import** button
4. Settings are applied after successful validation

## UI Settings Guide

### Layout Patterns

#### For Large-Scale Projects (Recommended)

```
Layout Mode: Grid
View Density: Comfortable
Card Size: Large
Desktop Columns: 2
Spacing: Loose
Border Radius: 12px
Card Shadow: 2
```

#### For High-Density Work

```
Layout Mode: Compact
View Density: Compact
Card Size: Small
Desktop Columns: 4-6
Spacing: Tight
Border Radius: 4px
Card Shadow: 1
```

#### For Presentations

```
Layout Mode: Grid
View Density: Comfortable
Card Size: Large
Desktop Columns: 2-3
Spacing: Loose
Border Radius: 16px
Card Shadow: 3
```

### Performance Optimization

When working with many colors:

1. Set **Animation Speed** to **Fast** or **Off**
2. Set **Card Shadow** low (0-1)
3. Set **View Density** to **Compact**

### Accessibility

To improve visual accessibility:

1. Set **Font Size** to **Large**
2. Set **Card Shadow** high (3-4) for better distinction
3. Set **Spacing** to **Loose** to ensure adequate whitespace

## Keyboard Shortcuts

Keyboard shortcuts are not currently supported but are planned for future versions.

## Troubleshooting

### Settings Not Saving

**Cause**: Browser local storage disabled or private browsing mode

**Solution**:
1. Use normal browsing mode
2. Enable browser local storage
3. Check browser cache and cookies

### Export Not Working

**Cause**: Clipboard API unavailable or insufficient browser permissions

**Solution**:
1. Update browser to latest version
2. Connect via HTTPS (localhost is OK in development)
3. Allow clipboard permissions

### Import Error

**Cause**: Invalid JSON format or missing required fields

**Solution**:
1. Check JSON syntax (commas, brackets, etc.)
2. Verify required fields (colors, mode, etc.) are included
3. Ensure color codes are in correct format (#RRGGBB)

### Layout Breaking

**Cause**: Browser compatibility issues or insufficient CSS variable support

**Solution**:
1. Use modern browsers (latest Chrome, Firefox, Safari, Edge)
2. Clear browser cache
3. Reload page
4. Reset UI settings (**UI Settings** > **Default**)

## FAQ

### Q: Can I use this with frameworks other than Material-UI?

A: Yes, exported color palettes can be output as CSS variables or JSON format, so they can be used with any framework or library.

### Q: Can I share settings with my team?

A: Yes, use the JSON export feature to save settings as a file, share the file with team members, and import it.

### Q: How many colors can I add to a palette?

A: There's no technical limit, but we recommend 20-30 colors for performance and usability.

### Q: Can I save different settings for dark and light modes?

A: Yes, you can have different color settings for each mode, and settings are preserved when switching modes.

### Q: Are UI settings shared across browsers and devices?

A: No, UI settings and color palette settings are stored in browser local storage, so they're managed separately for each device and browser. To share settings, use the JSON export/import feature.

### Q: Are there restrictions on custom color names?

A: No special restrictions, but we recommend using names that are valid as JavaScript variable names (alphanumeric, underscores, hyphens).

### Q: What are the contrast ratio standards?

A: Based on WCAG guidelines:
- **AAA**: 7:1 or higher (highest level)
- **AA**: 4.5:1 or higher (recommended level)
- **A**: 3:1 or higher (minimum level)
- **Fail**: Below 3:1 (accessibility fail)

### Q: Can I contribute to the project?

A: Yes! We welcome pull requests and issues on GitHub. See `DEVELOPMENT.md` for details.

---

## Support

If you have issues or questions:

1. Report on [GitHub Issues](https://github.com/yourusername/Palette-Pally-v0/issues)
2. Check the [Documentation](https://github.com/yourusername/Palette-Pally-v0/blob/main/README.md)
3. Refer to the [Developer Guide](./DEVELOPMENT.md)

## License

This project is released under the [MIT License](LICENSE).

---

**Palette Pally** - For Better Design Systems 🎨
