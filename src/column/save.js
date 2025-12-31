import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { width, flexGrow, flexShrink, verticalAlign, advanced } = attributes;

    const style = {
        '--fb-col-w-d': width.desktop?.value ? `${width.desktop.value}${width.desktop.unit}` : undefined,
        '--fb-col-w-t': width.tablet?.value ? `${width.tablet.value}${width.tablet.unit}` : undefined,
        '--fb-col-w-m': width.mobile?.value ? `${width.mobile.value}${width.mobile.unit}` : undefined,
        '--fb-col-grow': flexGrow,
        '--fb-col-shrink': flexShrink,
        '--fb-col-align': verticalAlign,
        zIndex: advanced?.zIndex
    };

    const blockProps = useBlockProps.save({
        className: `flexblocks-column`,
        style: style
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
