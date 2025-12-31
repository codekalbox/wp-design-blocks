import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const {
        tagName,
        layout,
        flex,
        visibility,
        styleBackground,
        styleOverlay,
        styleSpacing,
        animation,
        advanced
    } = attributes;

    const Tag = tagName;

    const visibilityClasses = [
        visibility.hideDesktop ? 'flexblocks-hide-d' : '',
        visibility.hideTablet ? 'flexblocks-hide-t' : '',
        visibility.hideMobile ? 'flexblocks-hide-m' : ''
    ].filter(Boolean).join(' ');

    const style = {
        '--fb-max-w': layout.widthType === 'boxed' ? `${layout.contentWidth.value}${layout.contentWidth.unit}` : '100%',

        // Flex
        '--fb-flex-dir-d': flex.desktop?.direction, '--fb-flex-dir-t': flex.tablet?.direction, '--fb-flex-dir-m': flex.mobile?.direction,
        '--fb-justify-d': flex.desktop?.justify, '--fb-justify-t': flex.tablet?.justify, '--fb-justify-m': flex.mobile?.justify,
        '--fb-align-d': flex.desktop?.align, '--fb-align-t': flex.tablet?.align, '--fb-align-m': flex.mobile?.align,
        '--fb-wrap-d': flex.desktop?.wrap, '--fb-wrap-t': flex.tablet?.wrap, '--fb-wrap-m': flex.mobile?.wrap,
        '--fb-gap-d': `${flex.desktop?.gap || 0}px`, '--fb-gap-t': `${flex.tablet?.gap || 0}px`, '--fb-gap-m': `${flex.mobile?.gap || 0}px`,

        // Dimensions
        '--fb-min-h-d': `${layout.minHeight.desktop?.value}${layout.minHeight.desktop?.unit}`,
        '--fb-min-h-t': `${layout.minHeight.tablet?.value}${layout.minHeight.tablet?.unit}`,
        '--fb-min-h-m': `${layout.minHeight.mobile?.value}${layout.minHeight.mobile?.unit}`,

        // Padding
        '--fb-pt-d': `${styleSpacing.padding.desktop?.top}${styleSpacing.padding.desktop?.unit}`, '--fb-pr-d': `${styleSpacing.padding.desktop?.right}${styleSpacing.padding.desktop?.unit}`, '--fb-pb-d': `${styleSpacing.padding.desktop?.bottom}${styleSpacing.padding.desktop?.unit}`, '--fb-pl-d': `${styleSpacing.padding.desktop?.left}${styleSpacing.padding.desktop?.unit}`,
        '--fb-pt-t': `${styleSpacing.padding.tablet?.top}${styleSpacing.padding.tablet?.unit}`, '--fb-pr-t': `${styleSpacing.padding.tablet?.right}${styleSpacing.padding.tablet?.unit}`, '--fb-pb-t': `${styleSpacing.padding.tablet?.bottom}${styleSpacing.padding.tablet?.unit}`, '--fb-pl-t': `${styleSpacing.padding.tablet?.left}${styleSpacing.padding.tablet?.unit}`,
        '--fb-pt-m': `${styleSpacing.padding.mobile?.top}${styleSpacing.padding.mobile?.unit}`, '--fb-pr-m': `${styleSpacing.padding.mobile?.right}${styleSpacing.padding.mobile?.unit}`, '--fb-pb-m': `${styleSpacing.padding.mobile?.bottom}${styleSpacing.padding.mobile?.unit}`, '--fb-pl-m': `${styleSpacing.padding.mobile?.left}${styleSpacing.padding.mobile?.unit}`,

        // Margin
        '--fb-mt-d': `${styleSpacing.margin.desktop?.top}${styleSpacing.margin.desktop?.unit}`, '--fb-mr-d': `${styleSpacing.margin.desktop?.right}${styleSpacing.margin.desktop?.unit}`, '--fb-mb-d': `${styleSpacing.margin.desktop?.bottom}${styleSpacing.margin.desktop?.unit}`, '--fb-ml-d': `${styleSpacing.margin.desktop?.left}${styleSpacing.margin.desktop?.unit}`,
        '--fb-mt-t': `${styleSpacing.margin.tablet?.top}${styleSpacing.margin.tablet?.unit}`, '--fb-mr-t': `${styleSpacing.margin.tablet?.right}${styleSpacing.margin.tablet?.unit}`, '--fb-mb-t': `${styleSpacing.margin.tablet?.bottom}${styleSpacing.margin.tablet?.unit}`, '--fb-ml-t': `${styleSpacing.margin.tablet?.left}${styleSpacing.margin.tablet?.unit}`,
        '--fb-mt-m': `${styleSpacing.margin.mobile?.top}${styleSpacing.margin.mobile?.unit}`, '--fb-mr-m': `${styleSpacing.margin.mobile?.right}${styleSpacing.margin.mobile?.unit}`, '--fb-mb-m': `${styleSpacing.margin.mobile?.bottom}${styleSpacing.margin.mobile?.unit}`, '--fb-ml-m': `${styleSpacing.margin.mobile?.left}${styleSpacing.margin.mobile?.unit}`,

        // Background
        '--fb-bg-color': styleBackground.type === 'color' ? styleBackground.color : 'transparent',
        '--fb-bg-img': styleBackground.type === 'image' && styleBackground.image?.url ? `url(${styleBackground.image.url})` : styleBackground.type === 'gradient' ? styleBackground.gradient : 'none',
        '--fb-bg-pos': styleBackground.position,
        '--fb-bg-size': styleBackground.size,

        // Z-Index & Overflow
        zIndex: advanced.zIndex,
        overflow: advanced.overflow
    };

    const blockProps = useBlockProps.save({
        className: `flexblocks-section layout-${layout.widthType} ${visibilityClasses} ${animation.type !== 'none' ? 'fb-anim-' + animation.type : ''} ${advanced.customClasses || ''}`,
        id: advanced.customId || undefined,
        style: style
    });

    return (
        <Tag {...blockProps}>
            {styleOverlay.enable && (
                <div className="flexblocks-overlay" style={{
                    background: styleOverlay.type === 'gradient' ? styleOverlay.gradient : styleOverlay.color,
                    opacity: styleOverlay.opacity,
                    mixBlendMode: styleOverlay.blendMode
                }}></div>
            )}
            <InnerBlocks.Content />
        </Tag>
    );
}
