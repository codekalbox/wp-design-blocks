import { __ } from '@wordpress/i18n';
import { 
	useBlockProps, 
	InnerBlocks, 
	InspectorControls
} from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	RangeControl, 
	ToggleControl,
    TextControl,
    ColorPalette
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
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

    const blockProps = useBlockProps( {
        className: `flexblocks-section layout-${layoutWidth}`,
        style: {
            // We use CSS variables for dynamic styles to avoid inline style mess
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

    const Tag = tagName;

    return (
        <>
            <InspectorControls>
                <PanelBody title={ __( 'Layout', 'flexblocks' ) }>
                    <SelectControl
                        label={ __( 'HTML Tag', 'flexblocks' ) }
                        value={ tagName }
                        options={ [
                            { label: 'Section', value: 'section' },
                            { label: 'Div', value: 'div' },
                            { label: 'Header', value: 'header' },
                            { label: 'Footer', value: 'footer' },
                            { label: 'Article', value: 'article' },
                            { label: 'Aside', value: 'aside' },
                        ] }
                        onChange={ ( value ) => setAttributes( { tagName: value } ) }
                    />
                    <SelectControl
                        label={ __( 'Content Width', 'flexblocks' ) }
                        value={ layoutWidth }
                        options={ [
                            { label: 'Boxed', value: 'boxed' },
                            { label: 'Full Width', value: 'full' },
                        ] }
                        onChange={ ( value ) => setAttributes( { layoutWidth: value } ) }
                    />
                    { layoutWidth === 'boxed' && (
                        <RangeControl
                            label={ __( 'Max Width (px)', 'flexblocks' ) }
                            value={ maxWidth.value }
                            onChange={ ( value ) => setAttributes( { maxWidth: { ...maxWidth, value } } ) }
                            min={ 300 }
                            max={ 1920 }
                        />
                    ) }
                    <RangeControl
                        label={ __( 'Min Height (px)', 'flexblocks' ) }
                        value={ minHeight.value }
                        onChange={ ( value ) => setAttributes( { minHeight: { ...minHeight, value } } ) }
                        min={ 0 }
                        max={ 1000 }
                    />
                </PanelBody>

                <PanelBody title={ __( 'Flexbox', 'flexblocks' ) } initialOpen={ false }>
                    <SelectControl
                        label={ __( 'Direction', 'flexblocks' ) }
                        value={ flexDirection }
                        options={ [
                            { label: 'Row', value: 'row' },
                            { label: 'Row Reverse', value: 'row-reverse' },
                            { label: 'Column', value: 'column' },
                            { label: 'Column Reverse', value: 'column-reverse' },
                        ] }
                        onChange={ ( value ) => setAttributes( { flexDirection: value } ) }
                    />
                    <SelectControl
                        label={ __( 'Justify Content', 'flexblocks' ) }
                        value={ justifyContent }
                        options={ [
                            { label: 'Start', value: 'flex-start' },
                            { label: 'End', value: 'flex-end' },
                            { label: 'Center', value: 'center' },
                            { label: 'Space Between', value: 'space-between' },
                            { label: 'Space Around', value: 'space-around' },
                            { label: 'Space Evenly', value: 'space-evenly' },
                        ] }
                        onChange={ ( value ) => setAttributes( { justifyContent: value } ) }
                    />
                    <SelectControl
                        label={ __( 'Align Items', 'flexblocks' ) }
                        value={ alignItems }
                        options={ [
                            { label: 'Start', value: 'flex-start' },
                            { label: 'End', value: 'flex-end' },
                            { label: 'Center', value: 'center' },
                            { label: 'Stretch', value: 'stretch' },
                            { label: 'Baseline', value: 'baseline' },
                        ] }
                        onChange={ ( value ) => setAttributes( { alignItems: value } ) }
                    />
                    <SelectControl
                        label={ __( 'Wrap', 'flexblocks' ) }
                        value={ flexWrap }
                        options={ [
                            { label: 'No Wrap', value: 'nowrap' },
                            { label: 'Wrap', value: 'wrap' },
                            { label: 'Wrap Reverse', value: 'wrap-reverse' },
                        ] }
                        onChange={ ( value ) => setAttributes( { flexWrap: value } ) }
                    />
                    <RangeControl
                        label={ __( 'Gap (px)', 'flexblocks' ) }
                        value={ gap.value }
                        onChange={ ( value ) => setAttributes( { gap: { ...gap, value } } ) }
                        min={ 0 }
                        max={ 100 }
                    />
                </PanelBody>

                <PanelBody title={ __( 'Advanced', 'flexblocks' ) } initialOpen={ false }>
                    <RangeControl
                        label={ __( 'Z-Index', 'flexblocks' ) }
                        value={ zIndex }
                        onChange={ ( value ) => setAttributes( { zIndex: value } ) }
                        min={ -10 }
                        max={ 100 }
                    />
                    <SelectControl
                        label={ __( 'Overflow', 'flexblocks' ) }
                        value={ overflow }
                        options={ [
                            { label: 'Visible', value: 'visible' },
                            { label: 'Hidden', value: 'hidden' },
                            { label: 'Scroll', value: 'scroll' },
                            { label: 'Auto', value: 'auto' },
                        ] }
                        onChange={ ( value ) => setAttributes( { overflow: value } ) }
                    />
                </PanelBody>
            </InspectorControls>

            <Tag { ...blockProps }>
                <InnerBlocks />
            </Tag>
        </>
    );
}
