import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
	const {
        tagName,
        layoutWidth,
        maxWidth,
        heightType,
        minHeight,
        flexParams,
        deviceVisibility,
        zIndex,
        overflow,
        animation
    } = attributes;

    const Tag = tagName;

    const style = {
        '--wp-dsgn-max-width': layoutWidth === 'boxed' ? `${maxWidth.value}${maxWidth.unit}` : undefined,
        '--wp-dsgn-min-height': heightType === 'custom' ? `${minHeight.value}${minHeight.unit}` : undefined,
        '--wp-dsgn-flex-direction': flexParams.direction,
        '--wp-dsgn-z-index': zIndex,
        '--wp-dsgn-overflow': overflow,
    };

    // Construct class names
    let className = `wp-dsgn-section type-${layoutWidth}`;
    if ( ! deviceVisibility.desktop ) className += ' hide-desktop';
    if ( ! deviceVisibility.tablet ) className += ' hide-tablet';
    if ( ! deviceVisibility.mobile ) className += ' hide-mobile';
    
    if ( animation.type !== 'none' ) {
        className += ` has-animation animation-${animation.type}`;
    }

	const blockProps = useBlockProps.save( {
        className,
        style,
        'data-animation-duration': animation.duration,
        'data-animation-delay': animation.delay,
    } );

	return (
		<Tag { ...blockProps }>
			<InnerBlocks.Content />
		</Tag>
	);
}
