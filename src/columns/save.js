import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function Save( { attributes } ) {
    const {
        columnsCount,
        stackMobile,
        columnGap,
        verticalAlign
    } = attributes;

    const blockProps = useBlockProps.save( {
        className: `flexblocks-columns count-${columnsCount}`,
        style: {
            '--column-gap': `${columnGap.value}${columnGap.unit}`,
            '--vertical-align': verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : verticalAlign,
            '--stack-mobile': stackMobile ? 'column' : 'row'
        }
    } );

    return (
        <div { ...blockProps }>
            <InnerBlocks.Content />
        </div>
    );
}
