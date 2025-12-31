import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

export const AdvancedControls = ({ attributes, setAttributes }) => {
    const { animation, advanced, tagName } = attributes;

    const updateAttribute = (category, field, value) => {
        setAttributes({ [category]: { ...attributes[category], [field]: value } });
    };

    return (
        <>
            <PanelBody title={__('Animation (Motion)', 'flexblocks')} initialOpen={true}>
                <SelectControl
                    label={__('Entrance Animation', 'flexblocks')}
                    value={animation.type}
                    options={[
                        { label: 'None', value: 'none' },
                        { label: 'Fade In', value: 'fade-in' },
                        { label: 'Slide Up', value: 'slide-up' },
                        { label: 'Zoom In', value: 'zoom-in' },
                        { label: 'Scale Up', value: 'scale-up' },
                    ]}
                    onChange={(val) => updateAttribute('animation', 'type', val)}
                />
                {animation.type !== 'none' && (
                    <>
                        <RangeControl
                            label={__('Duration (s)', 'flexblocks')}
                            value={animation.duration}
                            onChange={(val) => updateAttribute('animation', 'duration', val)}
                            min={0.1} max={3} step={0.1}
                        />
                        <RangeControl
                            label={__('Delay (s)', 'flexblocks')}
                            value={animation.delay}
                            onChange={(val) => updateAttribute('animation', 'delay', val)}
                            min={0} max={2} step={0.1}
                        />
                        <SelectControl
                            label={__('Easing', 'flexblocks')}
                            value={animation.easing}
                            options={[
                                { label: 'Linear', value: 'linear' },
                                { label: 'Ease In', value: 'ease-in' },
                                { label: 'Ease Out', value: 'ease-out' },
                                { label: 'Ease In Out', value: 'ease-in-out' },
                            ]}
                            onChange={(val) => updateAttribute('animation', 'easing', val)}
                        />
                    </>
                )}
            </PanelBody>

            <PanelBody title={__('HTML Structure', 'flexblocks')}>
                <SelectControl
                    label={__('HTML Tag', 'flexblocks')}
                    value={tagName}
                    options={[
                        { label: 'section', value: 'section' },
                        { label: 'div', value: 'div' },
                        { label: 'header', value: 'header' },
                        { label: 'footer', value: 'footer' },
                        { label: 'article', value: 'article' },
                        { label: 'aside', value: 'aside' },
                        { label: 'main', value: 'main' },
                    ]}
                    onChange={(val) => setAttributes({ tagName: val })}
                />
                <RangeControl
                    label={__('Z-Index', 'flexblocks')}
                    value={advanced.zIndex}
                    onChange={(val) => updateAttribute('advanced', 'zIndex', val)}
                    min={-1} max={100}
                />
                <SelectControl
                    label={__('Overflow', 'flexblocks')}
                    value={advanced.overflow}
                    options={[
                        { label: 'Visible', value: 'visible' },
                        { label: 'Hidden', value: 'hidden' },
                        { label: 'Scroll', value: 'scroll' },
                        { label: 'Auto', value: 'auto' },
                    ]}
                    onChange={(val) => updateAttribute('advanced', 'overflow', val)}
                />
            </PanelBody>
        </>
    );
};
