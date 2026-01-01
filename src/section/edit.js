import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls,
} from '@wordpress/block-editor';
import {
    TabPanel,
} from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import './editor.scss';

// Import refactored components
import { LayoutControls } from './components/LayoutControls';
import { StylingControls } from './components/StylingControls';
import { AdvancedControls } from './components/AdvancedControls';

// Import utilities
import ErrorBoundary from '../components/ErrorBoundary';
import { getResponsiveValue, generateCSSProps } from '../utils/attributeHelpers';

export default function Edit({ attributes, setAttributes, clientId }) {
    const {
        uniqueId,
        tagName,
        layout,
        flex,
        visibility,
        styleBackground,
        styleOverlay,
        styleSpacing,
        animation
    } = attributes;

    const [activeDevice, setActiveDevice] = useState('desktop');

    // Generate Unique ID safely based on ClientID for consistency
    useEffect(() => {
        if (!uniqueId) {
            setAttributes({ uniqueId: `flex-${clientId.slice(0, 8)}` });
        }
    }, [clientId]);

    // Generate safe CSS properties
    const safeCSSProps = generateCSSProps(attributes, activeDevice);
    
    const blockProps = useBlockProps({
        className: `flexblocks-section layout-${layout?.widthType || 'boxed'} ${animation?.type !== 'none' ? 'has-animation' : ''}`,
        style: {
            '--content-width': layout?.widthType === 'boxed' ? `${layout?.contentWidth?.value || 1200}${layout?.contentWidth?.unit || 'px'}` : '100%',
            '--min-height': `${getResponsiveValue(layout?.minHeight, activeDevice, 'value', 0)}${getResponsiveValue(layout?.minHeight, activeDevice, 'unit', 'px')}`,
            '--bg-color': styleBackground?.type === 'color' ? styleBackground?.color || 'transparent' : 'transparent',
            '--bg-image': styleBackground?.type === 'image' && styleBackground?.image?.url ? `url(${styleBackground.image.url})` : styleBackground?.type === 'gradient' ? styleBackground?.gradient || 'none' : 'none',
            '--bg-pos': styleBackground?.position || 'center center',
            '--bg-size': styleBackground?.size || 'cover',
            '--overlay-color': styleOverlay?.type === 'color' ? styleOverlay?.color || 'transparent' : 'transparent',
            '--overlay-grad': styleOverlay?.type === 'gradient' ? styleOverlay?.gradient || 'none' : 'none',
            '--overlay-opacity': styleOverlay?.opacity || 1,
            '--overlay-blend': styleOverlay?.blendMode || 'normal',
            ...safeCSSProps
        }
    });

    return (
        <ErrorBoundary>
            <InspectorControls>
                <div className="flexblocks-tabs-wrapper">
                    <TabPanel
                        className="flexblocks-tab-panel"
                        activeClass="active-tab"
                        tabs={[
                            { name: 'settings', title: 'Settings', className: 'tab-settings' },
                            { name: 'styling', title: 'Styling', className: 'tab-styling' },
                            { name: 'advanced', title: 'Advanced', className: 'tab-advanced' },
                        ]}
                    >
                        {(tab) => (
                            <div className="flexblocks-inspector-content">
                                {tab.name === 'settings' && (
                                    <ErrorBoundary>
                                        <LayoutControls
                                            attributes={attributes}
                                            setAttributes={setAttributes}
                                            activeDevice={activeDevice}
                                            setActiveDevice={setActiveDevice}
                                        />
                                    </ErrorBoundary>
                                )}
                                {tab.name === 'styling' && (
                                    <ErrorBoundary>
                                        <StylingControls
                                            attributes={attributes}
                                            setAttributes={setAttributes}
                                            activeDevice={activeDevice}
                                            setActiveDevice={setActiveDevice}
                                        />
                                    </ErrorBoundary>
                                )}
                                {tab.name === 'advanced' && (
                                    <ErrorBoundary>
                                        <AdvancedControls
                                            attributes={attributes}
                                            setAttributes={setAttributes}
                                        />
                                    </ErrorBoundary>
                                )}
                            </div>
                        )}
                    </TabPanel>
                </div>
            </InspectorControls>

            {/* Visual Editor Render */}
            <div {...blockProps}>
                {styleOverlay?.enable && (
                    <div className="flexblocks-overlay" style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: styleOverlay?.type === 'gradient' ? styleOverlay?.gradient || 'none' : styleOverlay?.color || 'transparent',
                        opacity: styleOverlay?.opacity || 1,
                        mixBlendMode: styleOverlay?.blendMode || 'normal',
                        pointerEvents: 'none',
                        zIndex: -1
                    }}></div>
                )}
                <InnerBlocks />
            </div>
        </ErrorBoundary>
    );
}
