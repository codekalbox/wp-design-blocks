import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { width, flexGrow, flexShrink, verticalAlign, advanced } = attributes;

    const style = {
        '--wp-design-blocks-col-w-d': width.desktop?.value ? `${width.desktop.value}${width.desktop.unit}` : undefined,
        '--wp-design-blocks-col-w-t': width.tablet?.value ? `${width.tablet.value}${width.tablet.unit}` : undefined,
        '--wp-design-blocks-col-w-m': width.mobile?.value ? `${width.mobile.value}${width.mobile.unit}` : undefined,
        '--wp-design-blocks-col-grow': flexGrow,
        '--wp-design-blocks-col-shrink': flexShrink,
        '--wp-design-blocks-col-align': verticalAlign,
        zIndex: advanced?.zIndex
    };

    const blockProps = useBlockProps.save({
        className: `wp-design-blocks-column`,
        style: style
    });

    return (
        <div {...blockProps}>
            <InnerBlocks.Content />
        </div>
    );
}
