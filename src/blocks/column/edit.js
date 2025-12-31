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
    TabPanel
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
    const {
        width,
        widthType,
        flexGrow,
        flexShrink,
        alignSelf,
        animation
    } = attributes;

    const blockProps = useBlockProps( {
        className: 'wp-dsgn-column',
        style: {
            width: widthType === 'percentage' ? `${width.value}%` : undefined,
            flexGrow: widthType === 'flex' ? flexGrow : undefined,
            flexShrink: flexShrink,
            alignSelf: alignSelf
        }
    } );

    const tabs = [
        {
            name: 'settings',
            title: __( 'Layout', 'wp-dsgn-blocks' ),
            className: 'tab-settings',
        },
        {
            name: 'styling',
            title: __( 'Style', 'wp-dsgn-blocks' ),
            className: 'tab-styling',
        },
        {
            name: 'advanced',
            title: __( 'Advanced', 'wp-dsgn-blocks' ),
            className: 'tab-advanced',
        }
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
                                <PanelBody title={ __( 'Column Layout', 'wp-dsgn-blocks' ) }>
                                    <SelectControl
                                        label={ __( 'Width Type', 'wp-dsgn-blocks' ) }
                                        value={ widthType }
                                        options={ [
                                            { label: 'Percentage', value: 'percentage' },
                                            { label: 'Flex', value: 'flex' },
                                            { label: 'Fixed', value: 'fixed' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { widthType: value } ) }
                                    />
                                    { widthType === 'percentage' && (
                                        <RangeControl
                                            label={ __( 'Width (%)', 'wp-dsgn-blocks' ) }
                                            value={ width.value }
                                            onChange={ ( value ) => setAttributes( { width: { ...width, value } } ) }
                                            min={ 1 }
                                            max={ 100 }
                                        />
                                    )}
                                    { widthType === 'flex' && (
                                        <RangeControl
                                            label={ __( 'Flex Grow', 'wp-dsgn-blocks' ) }
                                            value={ flexGrow }
                                            onChange={ ( value ) => setAttributes( { flexGrow: value } ) }
                                            min={ 0 }
                                            max={ 10 }
                                        />
                                    )}
                                    <SelectControl
                                        label={ __( 'Align Self', 'wp-dsgn-blocks' ) }
                                        value={ alignSelf }
                                        options={ [
                                            { label: 'Auto', value: 'auto' },
                                            { label: 'Start', value: 'flex-start' },
                                            { label: 'Center', value: 'center' },
                                            { label: 'End', value: 'flex-end' },
                                            { label: 'Stretch', value: 'stretch' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { alignSelf: value } ) }
                                    />
                                </PanelBody>
                            );
                        } else if ( tab.name === 'styling' ) {
                             return (
                                <PanelBody title={ __( 'Design', 'wp-dsgn-blocks' ) }>
                                     <p>{ __( 'Background, Border, Shadow settings here.', 'wp-dsgn-blocks' ) }</p>
                                </PanelBody>
                             );
                        } else if ( tab.name === 'advanced' ) {
                            return (
                                <PanelBody title={ __( 'Motion', 'wp-dsgn-blocks' ) }>
                                     <SelectControl
                                        label={ __( 'Animation Type', 'wp-dsgn-blocks' ) }
                                        value={ animation.type }
                                        options={ [
                                            { label: 'None', value: 'none' },
                                            { label: 'Fade In', value: 'fade-in' },
                                            { label: 'Slide Up', value: 'slide-up' },
                                        ] }
                                        onChange={ ( value ) => setAttributes( { animation: { ...animation, type: value } } ) }
                                     />
                                </PanelBody>
                            );
                        }
                    } }
                </TabPanel>
            </InspectorControls>

            <div { ...blockProps }>
                <InnerBlocks />
            </div>
        </>
    );
}
