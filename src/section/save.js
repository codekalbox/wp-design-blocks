import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    const {
        tagName,
        layoutWidth,
        maxWidth,
        minHeight,
        flexDirection,
        justifyContent,
        alignItems,
        flexWrap,
        gap,
        zIndex,
        overflow
    } = attributes;

    const Tag = tagName;

    const blockProps = useBlockProps.save( {
        className: `flexblocks-section layout-${layoutWidth}`,
        style: {
            '--flex-direction': flexDirection,
            '--justify-content': justifyContent,
            '--align-items': alignItems,
            '--flex-wrap': flexWrap,
            '--gap': `${gap.value}${gap.unit}`,
            '--min-height': `${minHeight.value}${minHeight.unit}`,
            '--max-width': layoutWidth === 'boxed' ? `${maxWidth.value}${maxWidth.unit}` : '100%',
            '--z-index': zIndex,
            '--overflow': overflow
        }
    } );

    return (
        <Tag { ...blockProps }>
            <InnerBlocks.Content />
        </Tag>
    );
}
