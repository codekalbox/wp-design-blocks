import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';
import { DeviceToggle } from './DeviceToggle';
import { getResponsiveValue, updateResponsiveAttribute } from '../../utils/attributeHelpers';

export const LayoutControls = ({ attributes, setAttributes, activeDevice, setActiveDevice }) => {
    const { layout = {}, flex = {}, visibility = {} } = attributes;

    const updateAttribute = (category, field, value) => {
        setAttributes({ [category]: { ...attributes[category], [field]: value } });
    };

    const updateResponsiveAttributeLocal = (category, field, value) => {
        updateResponsiveAttribute(attributes, setAttributes, category, activeDevice, field, value);
    };

    return (
        <>
            <PanelBody title={__('Layout Structure', 'flexblocks')} initialOpen={true}>
                <SelectControl
                    label={__('Content Width', 'flexblocks')}
                    value={layout?.widthType || 'boxed'}
                    options={[
                        { label: 'Boxed', value: 'boxed' },
                        { label: 'Full Width', value: 'full' },
                        { label: 'Custom', value: 'custom' },
                    ]}
                    onChange={(value) => updateAttribute('layout', 'widthType', value)}
                />
                {layout?.widthType !== 'full' && (
                    <RangeControl
                        label={__('Max Width (px)', 'flexblocks')}
                        value={layout?.contentWidth?.value || 1200}
                        onChange={(value) => setAttributes({ 
                            layout: { 
                                ...layout, 
                                contentWidth: { 
                                    ...layout?.contentWidth, 
                                    value 
                                } 
                            } 
                        })}
                        min={300} max={1920}
                    />
                )}
                <div className="responsive-control-header">
                    <label>{__('Min Height', 'flexblocks')}</label>
                    <DeviceToggle activeDevice={activeDevice} setActiveDevice={setActiveDevice} />
                </div>
                <RangeControl
                    value={getResponsiveValue(layout?.minHeight, activeDevice, 'value', 0)}
                    onChange={(value) => updateResponsiveAttributeLocal('layout', 'minHeight', { 
                        ...getResponsiveValue(layout?.minHeight, activeDevice, '', {}), 
                        value 
                    })}
                    min={0} max={1000}
                />
            </PanelBody>

            <PanelBody title={__('Flex Container', 'flexblocks')} initialOpen={false}>
                <DeviceToggle activeDevice={activeDevice} setActiveDevice={setActiveDevice} />
                <SelectControl
                    label={__('Direction', 'flexblocks')}
                    value={getResponsiveValue(flex, activeDevice, 'direction', 'column')}
                    options={[
                        { label: 'Column (Stack)', value: 'column' },
                        { label: 'Row (Horizontal)', value: 'row' },
                        { label: 'Row Reverse', value: 'row-reverse' },
                        { label: 'Column Reverse', value: 'column-reverse' },
                    ]}
                    onChange={(value) => updateResponsiveAttributeLocal('flex', 'direction', value)}
                />
                <SelectControl
                    label={__('Justify Content', 'flexblocks')}
                    value={getResponsiveValue(flex, activeDevice, 'justify', 'flex-start')}
                    options={[
                        { label: 'Start (Flex Start)', value: 'flex-start' },
                        { label: 'Center', value: 'center' },
                        { label: 'End (Flex End)', value: 'flex-end' },
                        { label: 'Space Between', value: 'space-between' },
                        { label: 'Space Around', value: 'space-around' },
                    ]}
                    onChange={(value) => updateResponsiveAttributeLocal('flex', 'justify', value)}
                />
                <SelectControl
                    label={__('Align Items', 'flexblocks')}
                    value={getResponsiveValue(flex, activeDevice, 'align', 'stretch')}
                    options={[
                        { label: 'Stretch', value: 'stretch' },
                        { label: 'Center', value: 'center' },
                        { label: 'Start', value: 'flex-start' },
                        { label: 'End', value: 'flex-end' },
                    ]}
                    onChange={(value) => updateResponsiveAttributeLocal('flex', 'align', value)}
                />
                <SelectControl
                    label={__('Wrap', 'flexblocks')}
                    value={getResponsiveValue(flex, activeDevice, 'wrap', 'nowrap')}
                    options={[
                        { label: 'No Wrap', value: 'nowrap' },
                        { label: 'Wrap', value: 'wrap' },
                        { label: 'Wrap Reverse', value: 'wrap-reverse' },
                    ]}
                    onChange={(value) => updateResponsiveAttributeLocal('flex', 'wrap', value)}
                />
                <RangeControl
                    label={__('Gap (px)', 'flexblocks')}
                    value={getResponsiveValue(flex, activeDevice, 'gap', 0)}
                    onChange={(value) => updateResponsiveAttributeLocal('flex', 'gap', value)}
                    min={0} max={100}
                />
            </PanelBody>
        </>
    );
};
