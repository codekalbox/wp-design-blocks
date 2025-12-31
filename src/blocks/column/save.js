import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    const {
        width,
        widthType,
        flexGrow,
        flexShrink,
        alignSelf,
        animation
    } = attributes;

    const style = {
        '--wp-dsgn-width': widthType === 'percentage' ? `${width.value}%` : undefined,
        '--wp-dsgn-flex-grow': widthType === 'flex' ? flexGrow : undefined,
        '--wp-dsgn-flex-shrink': flexShrink,
        '--wp-dsgn-align-self': alignSelf,
    };

    let className = 'wp-dsgn-column';
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
        <div { ...blockProps }>
            <InnerBlocks.Content />
        </div>
    );
}
