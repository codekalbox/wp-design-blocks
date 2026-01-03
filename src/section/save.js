/**
 * Section Block Save Component.
 *
 * @package WP_Design_Blocks
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { generateClassNames } from '../shared';

/**
 * Section Save Component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Component markup.
 */
export default function save( { attributes } ) {
	const {
		uniqueId,
		tagName = 'section',
		styleOverlay,
		animation,
	} = attributes;

	// Generate class names.
	const className = generateClassNames( attributes, 'wpdb-section' );

	// Block props.
	const blockProps = useBlockProps.save( {
		className,
		id: uniqueId,
		'data-animation-type': animation?.type || 'none',
		'data-animation-duration': animation?.duration || 0.8,
		'data-animation-delay': animation?.delay || 0,
	} );

	// Inner blocks props.
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'wpdb-section__content',
	} );

	// Create the element with the specified tag name.
	const TagName = tagName;

	return (
		<TagName { ...blockProps }>
			{ styleOverlay?.enable && (
				<div className="wpdb-overlay" />
			) }
			<div { ...innerBlocksProps } />
		</TagName>
	);
}

