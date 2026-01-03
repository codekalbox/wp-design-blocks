<?php
/**
 * Plugin Name:       WP Design Blocks
 * Plugin URI:        https://example.com/wp-design-blocks
 * Description:       Modern, flexible layout blocks for Gutenberg with advanced responsive controls and design options.
 * Version:           2.0.0
 * Requires at least: 6.3
 * Requires PHP:      7.4
 * Author:            MW. Studio
 * Author URI:        https://example.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-design-blocks
 * Domain Path:       /languages
 *
 * @package WP_Design_Blocks
 */

namespace WP_Design_Blocks;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Plugin version.
 *
 * @var string
 */
define( 'WPDB_VERSION', '2.0.0' );

/**
 * Plugin directory path.
 *
 * @var string
 */
define( 'WPDB_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Plugin directory URL.
 *
 * @var string
 */
define( 'WPDB_URL', plugin_dir_url( __FILE__ ) );

/**
 * Plugin basename.
 *
 * @var string
 */
define( 'WPDB_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Main plugin class.
 */
class Plugin {

	/**
	 * Singleton instance.
	 *
	 * @var Plugin
	 */
	private static $instance = null;

	/**
	 * Get singleton instance.
	 *
	 * @return Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 */
	private function __construct() {
		$this->includes();
		$this->hooks();
	}

	/**
	 * Include required files.
	 *
	 * @return void
	 */
	private function includes() {
		require_once WPDB_PATH . 'inc/helpers.php';
		require_once WPDB_PATH . 'inc/blocks.php';
		require_once WPDB_PATH . 'inc/assets.php';
	}

	/**
	 * Setup hooks.
	 *
	 * @return void
	 */
	private function hooks() {
		add_action( 'init', array( $this, 'load_textdomain' ) );
		add_action( 'admin_init', array( $this, 'check_requirements' ) );

		// Register block category.
		add_filter( 'block_categories_all', array( $this, 'register_block_category' ), 10, 2 );
	}

	/**
	 * Load plugin textdomain.
	 *
	 * @return void
	 */
	public function load_textdomain() {
		load_plugin_textdomain(
			'wp-design-blocks',
			false,
			dirname( WPDB_BASENAME ) . '/languages'
		);
	}

	/**
	 * Check plugin requirements.
	 *
	 * @return void
	 */
	public function check_requirements() {
		global $wp_version;

		$notices = array();

		// Check WordPress version.
		if ( version_compare( $wp_version, '6.3', '<' ) ) {
			$notices[] = sprintf(
				/* translators: %s: Required WordPress version */
				__( 'WP Design Blocks requires WordPress %s or higher.', 'wp-design-blocks' ),
				'6.3'
			);
		}

		// Check PHP version.
		if ( version_compare( PHP_VERSION, '7.4', '<' ) ) {
			$notices[] = sprintf(
				/* translators: %s: Required PHP version */
				__( 'WP Design Blocks requires PHP %s or higher.', 'wp-design-blocks' ),
				'7.4'
			);
		}

		// Display notices.
		if ( ! empty( $notices ) ) {
			add_action(
				'admin_notices',
				function () use ( $notices ) {
					foreach ( $notices as $notice ) {
						printf(
							'<div class="notice notice-error"><p>%s</p></div>',
							esc_html( $notice )
						);
					}
				}
			);
		}
	}

	/**
	 * Register custom block category.
	 *
	 * @param array                   $categories Array of block categories.
	 * @param \WP_Block_Editor_Context $context    Block editor context.
	 *
	 * @return array Modified categories.
	 */
	public function register_block_category( $categories, $context ) {
		return array_merge(
			array(
				array(
					'slug'  => 'wp-design-blocks',
					'title' => __( 'WP Design Blocks', 'wp-design-blocks' ),
					'icon'  => 'layout',
				),
			),
			$categories
		);
	}
}

/**
 * Initialize plugin.
 *
 * @return Plugin
 */
function plugin() {
	return Plugin::instance();
}

// Bootstrap plugin.
plugin();

