import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, TabPanel, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { width, flexGrow, flexShrink, verticalAlign, advanced } = attributes;
    const [activeDevice, setActiveDevice] = useState('desktop');

    const blockProps = useBlockProps({
        className: `flexblocks-column`,
        style: {
            '--col-width': width[activeDevice]?.value ? `${width[activeDevice].value}${width[activeDevice].unit}` : '100%',
            '--col-grow': flexGrow,
            '--col-shrink': flexShrink,
            '--col-align': verticalAlign,
            '--col-z-index': advanced?.zIndex || 1
        }
    });

    const updateWidth = (val) => {
        setAttributes({
            width: {
                ...width,
                [activeDevice]: { ...width[activeDevice], value: val }
            }
        });
    }

    return (
        <>
            <InspectorControls>
                <PanelBody title="Column Sizing">
                    <div className="flexblocks-device-toggle" style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
                        {['desktop', 'tablet', 'mobile'].map(d => (
                            <Button
                                key={d}
                                isSmall
                                variant={activeDevice === d ? 'primary' : 'tertiary'}
                                onClick={() => setActiveDevice(d)}
                            >
                                {d.charAt(0).toUpperCase() + d.slice(1)}
                            </Button>
                        ))}
                    </div>
                    <RangeControl
                        label="Width (%)"
                        value={width[activeDevice]?.value || ''}
                        onChange={updateWidth}
                        min={0} max={100}
                    />
                    <RangeControl
                        label="Flex Grow"
                        value={flexGrow}
                        onChange={(value) => setAttributes({ flexGrow: value })}
                        min={0} max={10}
                    />
                    <RangeControl
                        label="Flex Shrink"
                        value={flexShrink}
                        onChange={(value) => setAttributes({ flexShrink: value })}
                        min={0} max={10}
                    />
                </PanelBody>
                <PanelBody title="Alignment">
                    <SelectControl
                        label="Vertical Align (Self)"
                        value={verticalAlign}
                        options={[
                            { label: 'Stretch', value: 'stretch' },
                            { label: 'Top', value: 'flex-start' },
                            { label: 'Center', value: 'center' },
                            { label: 'Bottom', value: 'flex-end' },
                        ]}
                        onChange={(value) => setAttributes({ verticalAlign: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks />
            </div>
        </>
    );
}
