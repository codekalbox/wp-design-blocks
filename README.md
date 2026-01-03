# WP Design Blocks

Modern, flexible layout blocks for WordPress Gutenberg with advanced responsive controls and design options.

## 🚀 Features

- **Section Container**: Flexible container block with advanced flexbox controls
- **Columns Layout**: Responsive multi-column layouts
- **Column**: Individual column with flex properties
- **Responsive Controls**: Fine-tune designs for desktop, tablet, and mobile
- **Advanced Styling**: Background images, gradients, overlays, shadows, and more
- **Animations**: Entrance animations with IntersectionObserver
- **Performance Optimized**: Block-specific asset loading, minimal frontend JS
- **Modern Architecture**: Built with @wordpress/scripts and latest best practices

## 📋 Requirements

- **WordPress**: 6.3 or higher
- **PHP**: 7.4 or higher
- **Node.js**: 18.12 or higher (for development)

## 🛠️ Installation

### From Release

1. Download the latest release zip
2. Upload to WordPress via Plugins → Add New → Upload Plugin
3. Activate the plugin

### For Development

```bash
# Clone the repository
git clone https://github.com/yourusername/wp-design-blocks.git
cd wp-design-blocks

# Install dependencies
npm install

# Build for production
npm run build

# Or start development mode with hot reload
npm start
```

## 🏗️ Project Structure

```
wp-design-blocks/
├── build/                  # Compiled assets (generated)
├── inc/                    # PHP includes
│   ├── blocks/            # Block-specific PHP
│   ├── blocks.php         # Block registration
│   ├── assets.php         # Asset management
│   └── helpers.php        # Utility functions
├── languages/             # Translation files
├── src/                   # Source files
│   ├── shared/           # Shared utilities
│   │   ├── constants.js
│   │   ├── responsive.js
│   │   ├── css-utils.js
│   │   ├── block-helpers.js
│   │   └── styles/       # SCSS utilities
│   ├── components/       # Shared React components
│   │   ├── ErrorBoundary.jsx
│   │   └── ResponsiveControl.jsx
│   ├── section/          # Section block
│   │   ├── block.json
│   │   ├── index.js
│   │   ├── edit.js
│   │   ├── save.js
│   │   ├── view.js
│   │   ├── style.scss
│   │   └── editor.scss
│   ├── columns/          # Columns block
│   └── column/           # Column block
├── wp-design-blocks.php   # Main plugin file
├── package.json
└── README.md
```

## 🎨 Block Overview

### Section Container

A powerful container block that provides:
- Flexbox layout controls (direction, justify, align, wrap, gap)
- Responsive settings per device
- Background options (color, gradient, image)
- Overlay with blend modes
- Border, shadow, and spacing controls
- Entrance animations
- Visibility controls per device

### Columns

Multi-column layout block with:
- Configurable column count (1-6)
- Column gap control
- Vertical alignment
- Stack on mobile option
- Reverse order option

### Column

Individual column block with:
- Responsive width control
- Flex grow and shrink
- Self-alignment
- Nested block support

## 💻 Development

### Available Scripts

```bash
# Start development mode (hot reload)
npm start

# Build for production
npm run build

# Lint JavaScript
npm run lint:js

# Lint CSS/SCSS
npm run lint:css

# Format code
npm run format

# Update @wordpress packages
npm run packages-update

# Create plugin zip
npm run plugin-zip
```

### Code Style

This project follows:
- [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)

ESLint and Prettier are configured to enforce consistent code style.

## 🧩 Creating a New Block

1. Create block directory in `src/`:
```bash
mkdir src/my-block
cd src/my-block
```

2. Create `block.json`:
```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "wp-design-blocks/my-block",
  "title": "My Block",
  "category": "wp-design-blocks",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css"
}
```

3. Create block files:
```javascript
// index.js
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';

registerBlockType( metadata.name, {
	edit: Edit,
	save,
} );

// edit.js
import { useBlockProps } from '@wordpress/block-editor';

export default function Edit() {
	const blockProps = useBlockProps();
	return <div { ...blockProps }>Edit view</div>;
}

// save.js
import { useBlockProps } from '@wordpress/block-editor';

export default function save() {
	const blockProps = useBlockProps.save();
	return <div { ...blockProps }>Frontend view</div>;
}
```

4. Add to block registration in `inc/blocks.php`:
```php
$blocks = array(
	'section',
	'columns',
	'column',
	'my-block', // Add your block
);
```

## 🔌 Hooks & Filters

### PHP Filters

```php
// Modify registered blocks
add_filter( 'wp_design_blocks_registered_blocks', function( $blocks ) {
	// Add or remove blocks
	return $blocks;
} );
```

### JavaScript Hooks

```javascript
import { addFilter } from '@wordpress/hooks';

// Modify block attributes
addFilter(
	'blocks.registerBlockType',
	'wp-design-blocks/my-modification',
	( settings, name ) => {
		if ( name === 'wp-design-blocks/section' ) {
			// Modify settings
		}
		return settings;
	}
);
```

## 🌐 Internationalization

The plugin is fully translatable. To translate:

1. Use [Poedit](https://poedit.net/) or [Loco Translate](https://wordpress.org/plugins/loco-translate/)
2. Create/edit translations in `languages/` directory
3. All strings use text domain: `wp-design-blocks`

### For Developers

JavaScript strings:
```javascript
import { __ } from '@wordpress/i18n';

const label = __( 'My String', 'wp-design-blocks' );
```

PHP strings:
```php
__( 'My String', 'wp-design-blocks' );
esc_html__( 'My String', 'wp-design-blocks' );
```

## 🐛 Debugging

Enable WordPress debug mode in `wp-config.php`:
```php
define( 'WP_DEBUG', true );
define( 'WP_DEBUG_LOG', true );
define( 'SCRIPT_DEBUG', true );
```

Check browser console for JavaScript errors and `wp-content/debug.log` for PHP errors.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Follow coding standards
4. Write meaningful commit messages
5. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

GPL v2 or later. See [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [WordPress Block Editor Handbook](https://developer.wordpress.org/block-editor/)
- [Block Development Examples](https://github.com/WordPress/block-development-examples)
- [@wordpress/scripts Package](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-scripts/)
- [Block Supports Reference](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-supports/)

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/wp-design-blocks/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/wp-design-blocks/wiki)

---

Built with ❤️ for the WordPress community

