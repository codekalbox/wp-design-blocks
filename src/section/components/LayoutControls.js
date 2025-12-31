import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { DeviceToggle } from './DeviceToggle';

export const LayoutControls = ({ attributes, setAttributes, activeDevice, setActiveDevice }) => {
    const { layout, flex, visibility } = attributes;

    const updateAttribute = (category, field, value) => {
        setAttributes({ [category]: { ...attributes[category], [field]: value } });
    };

    const updateResponsiveAttribute = (category, field, value) => {
        setAttributes({
            [category]: {
                ...attributes[category],
                [activeDevice]: { ...attributes[category][activeDevice], [field]: value }
            }
        });
    };

    return (
        <>
            <PanelBody title={__('Layout Structure', 'flexblocks')} initialOpen={true}>
                <SelectControl
                    label={__('Content Width', 'flexblocks')}
                    value={layout.widthType}
                    options={[
                        { label: 'Boxed', value: 'boxed' },
                        { label: 'Full Width', value: 'full' },
                        { label: 'Custom', value: 'custom' },
                    ]}
                    onChange={(value) => updateAttribute('layout', 'widthType', value)}
                />
                {layout.widthType !== 'full' && (
                    <RangeControl
                        label={__('Max Width (px)', 'flexblocks')}
                        value={layout.contentWidth.value}
                        onChange={(value) => setAttributes({ layout: { ...layout, contentWidth: { ...layout.contentWidth, value } } })}
                        min={300} max={1920}
                    />
                )}
                <div className="responsive-control-header">
                    <label>{__('Min Height', 'flexblocks')}</label>
                    <DeviceToggle activeDevice={activeDevice} setActiveDevice={setActiveDevice} />
                </div>
                <RangeControl
                    value={layout.minHeight[activeDevice].value}
                    onChange={(value) => {
                        const newHeight = { ...layout.minHeight };
                        newHeight[activeDevice] = { ...newHeight[activeDevice], value };
                        setAttributes({ layout: { ...layout, minHeight: newHeight } });
                    }}
                    min={0} max={1000}
                />
            </PanelBody>

            <PanelBody title={__('Flex Container', 'flexblocks')} initialOpen={false}>
                <DeviceToggle activeDevice={activeDevice} setActiveDevice={setActiveDevice} />
                <SelectControl
                    label={__('Direction', 'flexblocks')}
                    value={flex[activeDevice].direction}
                    options={[
                        { label: 'Column (Stack)', value: 'column' },
                        { label: 'Row (Horizontal)', value: 'row' },
                        { label: 'Row Reverse', value: 'row-reverse' },
                        { label: 'Column Reverse', value: 'column-reverse' },
                    ]}
                    onChange={(value) => updateResponsiveAttribute('flex', 'direction', value)}
                />
                <SelectControl
                    label={__('Justify Content', 'flexblocks')}
                    value={flex[activeDevice].justify}
                    options={[
                        { label: 'Start (Flex Start)', value: 'flex-start' },
                        { label: 'Center', value: 'center' },
                        { label: 'End (Flex End)', value: 'flex-end' },
                        { label: 'Space Between', value: 'space-between' },
                        { label: 'Space Around', value: 'space-around' },
                    ]}
                    onChange={(value) => updateResponsiveAttribute('flex', 'justify', value)}
                />
                <SelectControl
                    label={__('Align Items', 'flexblocks')}
                    value={flex[activeDevice].align}
                    options={[
                        { label: 'Stretch', value: 'stretch' },
                        { label: 'Center', value: 'center' },
                        { label: 'Start', value: 'flex-start' },
                        { label: 'End', value: 'flex-end' },
                    ]}
                    onChange={(value) => updateResponsiveAttribute('flex', 'align', value)}
                />
                <SelectControl
                    label={__('Wrap', 'flexblocks')}
                    value={flex[activeDevice].wrap}
                    options={[
                        { label: 'No Wrap', value: 'nowrap' },
                        { label: 'Wrap', value: 'wrap' },
                        { label: 'Wrap Reverse', value: 'wrap-reverse' },
                    ]}
                    onChange={(value) => updateResponsiveAttribute('flex', 'wrap', value)}
                />
                <RangeControl
                    label={__('Gap (px)', 'flexblocks')}
                    value={flex[activeDevice].gap}
                    onChange={(value) => updateResponsiveAttribute('flex', 'gap', value)}
                    min={0} max={100}
                />
            </PanelBody>
        </>
    );
};
