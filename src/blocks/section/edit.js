import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';
import { useDispatch } from '@wordpress/data';
import { 
	useBlockProps, 
	InnerBlocks, 
	InspectorControls,
    InspectorAdvancedControls
} from '@wordpress/block-editor';
import { 
	PanelBody, 
	SelectControl, 
	RangeControl, 
	ToggleControl,
    TabPanel,
    TextControl,
    ColorPalette,
    Button,
    ButtonGroup,
    __experimentalBoxControl as BoxControl
} from '@wordpress/components';

import './editor.scss';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
        tagName,
        layoutWidth,
        maxWidth,
        heightType,
        minHeight,
        flexParams,
        deviceVisibility,
        animation,
        zIndex,
        overflow
    } = attributes;

    const Tag = tagName;
    
    const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

    const setColumnLayout = ( layout ) => {
        const newBlocks = [];
        if ( layout === '100' ) {
            newBlocks.push( createBlock( 'wp-dsgn-blocks/column', { width: { value: 100, unit: '%' }, widthType: 'percentage' } ) );
        } else if ( layout === '50-50' ) {
            newBlocks.push( createBlock( 'wp-dsgn-blocks/column', { width: { value: 50, unit: '%' }, widthType: 'percentage' } ) );
            newBlocks.push( createBlock( 'wp-dsgn-blocks/column', { width: { value: 50, unit: '%' }, widthType: 'percentage' } ) );
        } else if ( layout === '33-33-33' ) {
            newBlocks.push( createBlock( 'wp-dsgn-blocks/column', { width: { value: 33.33, unit: '%' }, widthType: 'percentage' } ) );
            newBlocks.push( createBlock( 'wp-dsgn-blocks/column', { width: { value: 33.33, unit: '%' }, widthType: 'percentage' } ) );
            newBlocks.push( createBlock( 'wp-dsgn-blocks/column', { width: { value: 33.33, unit: '%' }, widthType: 'percentage' } ) );
        } else if ( layout === '66-33' ) {
            newBlocks.push( createBlock( 'wp-dsgn-blocks/column', { width: { value: 66.66, unit: '%' }, widthType: 'percentage' } ) );
            newBlocks.push( createBlock( 'wp-dsgn-blocks/column', { width: { value: 33.33, unit: '%' }, widthType: 'percentage' } ) );
        }
        replaceInnerBlocks( clientId, newBlocks );
    };

    const onChangeTagName = ( value ) => setAttributes( { tagName: value } );

    const blockProps = useBlockProps( {
        className: `wp-dsgn-section type-${layoutWidth}`,
        style: {
            // We will add inline styles here or generate a class
            minHeight: heightType === 'custom' ? `${minHeight.value}${minHeight.unit}` : undefined,
            zIndex: zIndex,
            overflow: overflow,
        }
    } );

    const tabs = [
        {
            name: 'settings',
            title: __( 'Settings', 'wp-dsgn-blocks' ),
            className: 'tab-settings',
        },
        {
            name: 'styling',
            title: __( 'Styling', 'wp-dsgn-blocks' ),
            className: 'tab-styling',
        },
        {
            name: 'advanced',
            title: __( 'Advanced', 'wp-dsgn-blocks' ),
            className: 'tab-advanced',
        },
    ];

	return (
		<>
            <InspectorControls>
                <TabPanel
                    className="wp-dsgn-inspector-tabs"
                    activeClass="active-tab"
                    tabs={ tabs }
                >
                    { ( tab ) => {
                        if ( tab.name === 'settings' ) {
                            return (
                                <PanelBody title={ __( 'Layout & Structure', 'wp-dsgn-blocks' ) }>
                                    <SelectControl
                                        label={ __( 'Tag Name', 'wp-dsgn-blocks' ) }
                                        value={ tagName }
                                        options={ [
                                            { label: 'Section', value: 'section' },
                                            { label: 'Div', value: 'div' },
                                            { label: 'Article', value: 'article' },
                                            { label: 'Main', value: 'main' },
                                            { label: 'Header', value: 'header' },
                                            { label: 'Footer', value: 'footer' },
                                        ] }
                                        onChange={ onChangeTagName }
                                    />
                                    <SelectControl
                                        label={ __( 'Layout Width', 'wp-dsgn-blocks' ) }
                                        value={ layoutWidth }
                                        options={ [
                                            { label: 'Boxed', value: 'boxed' },
                                            { label: 'Full Width', value: 'full' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { layoutWidth: value } ) }
                                    />
                                    { layoutWidth === 'boxed' && (
                                         <RangeControl
                                            label={ __( 'Max Width (px)', 'wp-dsgn-blocks' ) }
                                            value={ maxWidth.value }
                                            onChange={ ( value ) => setAttributes( { maxWidth: { ...maxWidth, value } } ) }
                                            min={ 300 }
                                            max={ 1920 }
                                         />
                                    )}
                                    <SelectControl
                                        label={ __( 'Height', 'wp-dsgn-blocks' ) }
                                        value={ heightType }
                                        options={ [
                                            { label: 'Auto', value: 'auto' },
                                            { label: 'Fit to Viewport', value: 'viewport' },
                                            { label: 'Custom', value: 'custom' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { heightType: value } ) }
                                    />
                                    { heightType === 'custom' && (
                                         <RangeControl
                                            label={ __( 'Min Height (px)', 'wp-dsgn-blocks' ) }
                                            value={ minHeight.value }
                                            onChange={ ( value ) => setAttributes( { minHeight: { ...minHeight, value } } ) }
                                            min={ 0 }
                                            max={ 1000 }
                                         />
                                    )}
                                    
                                    <h3>{ __( 'Columns Setup', 'wp-dsgn-blocks' ) }</h3>
                                    <div className="wp-dsgn-column-presets" style={ { marginBottom: '20px' } }>
                                        <ButtonGroup>
                                            <Button variant="secondary" onClick={ () => setColumnLayout( '100' ) }>100%</Button>
                                            <Button variant="secondary" onClick={ () => setColumnLayout( '50-50' ) }>50/50</Button>
                                            <Button variant="secondary" onClick={ () => setColumnLayout( '33-33-33' ) }>33/33/33</Button>
                                            <Button variant="secondary" onClick={ () => setColumnLayout( '66-33' ) }>66/33</Button>
                                        </ButtonGroup>
                                        <p className="description">{ __( 'Warning: This will reset current column content.', 'wp-dsgn-blocks' ) }</p>
                                    </div>

                                    { /* Flex Controls */ }
                                    <SelectControl
                                        label={ __( 'Flex Direction', 'wp-dsgn-blocks' ) }
                                        value={ flexParams.direction }
                                        options={ [
                                            { label: 'Row', value: 'row' },
                                            { label: 'Column', value: 'column' },
                                            { label: 'Row Reverse', value: 'row-reverse' },
                                            { label: 'Column Reverse', value: 'column-reverse' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { flexParams: { ...flexParams, direction: value } } ) }
                                    />
                                    { /* Device Visibility */ }
                                    <ToggleControl
                                        label={ __( 'Hide on Desktop', 'wp-dsgn-blocks' ) }
                                        checked={ ! deviceVisibility.desktop }
                                        onChange={ ( value ) => setAttributes( { deviceVisibility: { ...deviceVisibility, desktop: ! value } } ) }
                                    />
                                     <ToggleControl
                                        label={ __( 'Hide on Tablet', 'wp-dsgn-blocks' ) }
                                        checked={ ! deviceVisibility.tablet }
                                        onChange={ ( value ) => setAttributes( { deviceVisibility: { ...deviceVisibility, tablet: ! value } } ) }
                                    />
                                     <ToggleControl
                                        label={ __( 'Hide on Mobile', 'wp-dsgn-blocks' ) }
                                        checked={ ! deviceVisibility.mobile }
                                        onChange={ ( value ) => setAttributes( { deviceVisibility: { ...deviceVisibility, mobile: ! value } } ) }
                                    />
                                </PanelBody>
                            );
                        } else if ( tab.name === 'styling' ) {
                            return (
                                <PanelBody title={ __( 'Visual Design', 'wp-dsgn-blocks' ) }>
                                    <p>{ __( 'Background, Overlay, Borders, Spacing controls would go here.', 'wp-dsgn-blocks' ) }</p>
                                    { /* Placeholder for styling controls - simplifying for initial pass */ }
                                </PanelBody>
                            );
                        } else if ( tab.name === 'advanced' ) {
                             return (
                                <PanelBody title={ __( 'Advanced & Motion', 'wp-dsgn-blocks' ) }>
                                     <RangeControl
                                        label={ __( 'Z-Index', 'wp-dsgn-blocks' ) }
                                        value={ zIndex }
                                        onChange={ ( value ) => setAttributes( { zIndex: value } ) }
                                        min={ -10 }
                                        max={ 100 }
                                     />
                                     <SelectControl
                                        label={ __( 'Overflow', 'wp-dsgn-blocks' ) }
                                        value={ overflow }
                                        options={ [
                                            { label: 'Visible', value: 'visible' },
                                            { label: 'Hidden', value: 'hidden' },
                                            { label: 'Auto', value: 'auto' },
                                            { label: 'Scroll', value: 'scroll' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { overflow: value } ) }
                                     />
                                     <h3>{ __( 'Animation', 'wp-dsgn-blocks' ) }</h3>
                                     <SelectControl
                                        label={ __( 'Type', 'wp-dsgn-blocks' ) }
                                        value={ animation.type }
                                        options={ [
                                            { label: 'None', value: 'none' },
                                            { label: 'Fade In', value: 'fade-in' },
                                            { label: 'Slide Up', value: 'slide-up' },
                                            { label: 'Zoom In', value: 'zoom-in' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { animation: { ...animation, type: value } } ) }
                                     />
                                </PanelBody>
                             );
                        }
                    } }
                </TabPanel>
            </InspectorControls>
            
			<Tag { ...blockProps }>
                <InnerBlocks 
                    allowedBlocks={ [ 'wp-dsgn-blocks/column', 'wp-dsgn-blocks/section' ] }
                    template={ [ [ 'wp-dsgn-blocks/column' ] ] }
                />
			</Tag>
		</>
	);
}
