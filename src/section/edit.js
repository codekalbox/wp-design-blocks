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

    const blockProps = useBlockProps({
        className: `flexblocks-section layout-${layout.widthType} ${animation.type !== 'none' ? 'has-animation' : ''}`,
        style: {
            '--content-width': layout.widthType === 'boxed' ? `${layout.contentWidth.value}${layout.contentWidth.unit}` : '100%',
            '--min-height': `${layout.minHeight[activeDevice]?.value || 0}${layout.minHeight[activeDevice]?.unit || 'px'}`,
            '--flex-dir': flex[activeDevice]?.direction,
            '--justify': flex[activeDevice]?.justify,
            '--align': flex[activeDevice]?.align,
            '--wrap': flex[activeDevice]?.wrap,
            '--gap': `${flex[activeDevice]?.gap}px`,
            '--pt': `${styleSpacing.padding[activeDevice]?.top}${styleSpacing.padding[activeDevice]?.unit}`,
            '--pr': `${styleSpacing.padding[activeDevice]?.right}${styleSpacing.padding[activeDevice]?.unit}`,
            '--pb': `${styleSpacing.padding[activeDevice]?.bottom}${styleSpacing.padding[activeDevice]?.unit}`,
            '--pl': `${styleSpacing.padding[activeDevice]?.left}${styleSpacing.padding[activeDevice]?.unit}`,
            '--mt': `${styleSpacing.margin[activeDevice]?.top}${styleSpacing.margin[activeDevice]?.unit}`,
            '--mr': `${styleSpacing.margin[activeDevice]?.right}${styleSpacing.margin[activeDevice]?.unit}`,
            '--mb': `${styleSpacing.margin[activeDevice]?.bottom}${styleSpacing.margin[activeDevice]?.unit}`,
            '--ml': `${styleSpacing.margin[activeDevice]?.left}${styleSpacing.margin[activeDevice]?.unit}`,
            '--bg-color': styleBackground.type === 'color' ? styleBackground.color : 'transparent',
            '--bg-image': styleBackground.type === 'image' && styleBackground.image?.url ? `url(${styleBackground.image.url})` : styleBackground.type === 'gradient' ? styleBackground.gradient : 'none',
            '--bg-pos': styleBackground.position,
            '--bg-size': styleBackground.size,
            '--overlay-color': styleOverlay.type === 'color' ? styleOverlay.color : 'transparent',
            '--overlay-grad': styleOverlay.type === 'gradient' ? styleOverlay.gradient : 'none',
            '--overlay-opacity': styleOverlay.opacity,
            '--overlay-blend': styleOverlay.blendMode,
        }
    });

    return (
        <>
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
                                    <LayoutControls
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                        activeDevice={activeDevice}
                                        setActiveDevice={setActiveDevice}
                                    />
                                )}
                                {tab.name === 'styling' && (
                                    <StylingControls
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                        activeDevice={activeDevice}
                                        setActiveDevice={setActiveDevice}
                                    />
                                )}
                                {tab.name === 'advanced' && (
                                    <AdvancedControls
                                        attributes={attributes}
                                        setAttributes={setAttributes}
                                    />
                                )}
                            </div>
                        )}
                    </TabPanel>
                </div>
            </InspectorControls>

            {/* Visual Editor Render */}
            <div {...blockProps}>
                {styleOverlay.enable && (
                    <div className="flexblocks-overlay" style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: styleOverlay.type === 'gradient' ? styleOverlay.gradient : styleOverlay.color,
                        opacity: styleOverlay.opacity,
                        mixBlendMode: styleOverlay.blendMode,
                        pointerEvents: 'none',
                        zIndex: -1
                    }}></div>
                )}
                <InnerBlocks />
            </div>
        </>
    );
}
