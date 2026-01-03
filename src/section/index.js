/**
 * Section Block Registration.
 *
 * @package WP_Design_Blocks
 */

import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import save from './save';
import metadata from './block.json';

/**
 * Register the Section block.
 */
registerBlockType( metadata.name, {
	...metadata,
	edit: Edit,
	save,
} );

