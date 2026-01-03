import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save({ attributes }) {
    const {
        columnsCount,
        stackMobile,
        columnGap,
        verticalAlign,
        reverseOrder
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `wp-design-blocks-columns count-${columnsCount}`,
        style: {
            '--column-gap': `${columnGap.value}${columnGap.unit}`,
            '--vertical-align': verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : verticalAlign,
            '--stack-mobile': stackMobile ? 'column' : 'row',
            '--flex-direction': reverseOrder ? 'row-reverse' : 'row'
        }
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
