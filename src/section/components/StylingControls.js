import { __ } from '@wordpress/i18n';
import {
    PanelBody,
    ColorPalette,
    ToggleControl,
    RangeControl,
    __experimentalGradientPicker as GradientPicker,
    SelectControl,
    Button
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { DeviceToggle } from './DeviceToggle';

export const StylingControls = ({ attributes, setAttributes, activeDevice, setActiveDevice }) => {
    const { styleBackground, styleOverlay, styleSpacing, styleShadow, styleBorder } = attributes;

    const updateAttribute = (category, field, value) => {
        setAttributes({ [category]: { ...attributes[category], [field]: value } });
    };

    const updateNestedResponsive = (category, subCategory, field, value) => {
        setAttributes({
            [category]: {
                ...attributes[category],
                [subCategory]: {
                    ...attributes[category][subCategory],
                    [activeDevice]: { ...attributes[category][subCategory][activeDevice], [field]: value }
                }
            }
        });
    };

    // Helper to render box inputs (placeholder for custom UnitControl implementation)
    const renderBoxInputs = (label, type) => (
        <div className="flexblocks-box-control">
            <label className="components-base-control__label">{label}</label>
            <div className="box-inputs-grid">
                {['top', 'right', 'bottom', 'left'].map(side => (
                    <div key={side} className="box-input-wrapper">
                        {/* Using simple inputs for now, can upgrade to UnitControl */}
                        <input
                            type="number"
                            className="components-text-control__input"
                            value={styleSpacing[type][activeDevice][side]}
                            onChange={(e) => updateNestedResponsive('styleSpacing', type, side, e.target.value)}
                        />
                        <span className="box-label-mini">{side.charAt(0)}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <PanelBody title={__('Background', 'flexblocks')} initialOpen={true}>
                <SelectControl
                    label={__('Type', 'flexblocks')}
                    value={styleBackground.type}
                    options={[
                        { label: 'None', value: 'none' },
                        { label: 'Color', value: 'color' },
                        { label: 'Gradient', value: 'gradient' },
                        { label: 'Image', value: 'image' },
                    ]}
                    onChange={(val) => updateAttribute('styleBackground', 'type', val)}
                />
                {styleBackground.type === 'color' && (
                    <ColorPalette
                        value={styleBackground.color}
                        onChange={(val) => updateAttribute('styleBackground', 'color', val)}
                    />
                )}
                {styleBackground.type === 'gradient' && (
                    <GradientPicker
                        value={styleBackground.gradient}
                        onChange={(val) => updateAttribute('styleBackground', 'gradient', val)}
                    />
                )}
                {styleBackground.type === 'image' && (
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={(media) => setAttributes({ styleBackground: { ...styleBackground, image: { url: media.url, id: media.id } } })}
                            allowedTypes={['image']}
                            value={styleBackground.image?.id}
                            render={({ open }) => (
                                <div className="media-upload-wrapper">
                                    {styleBackground.image?.url ? (
                                        <>
                                            <img src={styleBackground.image.url} alt="bg" style={{ width: '100%', marginBottom: '10px', borderRadius: '4px' }} />
                                            <Button isDestructive isLink onClick={() => setAttributes({ styleBackground: { ...styleBackground, image: { url: '', id: 0 } } })}>
                                                {__('Remove Image', 'flexblocks')}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button variant="secondary" onClick={open}>
                                            {__('Select Image', 'flexblocks')}
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </MediaUploadCheck>
                )}
                {styleBackground.type === 'image' && styleBackground.image?.url && (
                    <>
                        <SelectControl
                            label={__('Position', 'flexblocks')}
                            value={styleBackground.position}
                            options={[
                                { label: 'Center Center', value: 'center center' },
                                { label: 'Top Left', value: 'top left' },
                                { label: 'Top Right', value: 'top right' },
                                { label: 'Bottom Left', value: 'bottom left' },
                                { label: 'Bottom Right', value: 'bottom right' },
                            ]}
                            onChange={(val) => updateAttribute('styleBackground', 'position', val)}
                        />
                        <SelectControl
                            label={__('Size', 'flexblocks')}
                            value={styleBackground.size}
                            options={[
                                { label: 'Cover', value: 'cover' },
                                { label: 'Contain', value: 'contain' },
                                { label: 'Auto', value: 'auto' },
                            ]}
                            onChange={(val) => updateAttribute('styleBackground', 'size', val)}
                        />
                    </>
                )}
            </PanelBody>

            <PanelBody title={__('Overlay', 'flexblocks')} initialOpen={false}>
                <ToggleControl
                    label={__('Enable Overlay', 'flexblocks')}
                    checked={styleOverlay.enable}
                    onChange={(val) => updateAttribute('styleOverlay', 'enable', val)}
                />
                {styleOverlay.enable && (
                    <>
                        <SelectControl
                            label={__('Type', 'flexblocks')}
                            value={styleOverlay.type}
                            options={[
                                { label: 'Color', value: 'color' },
                                { label: 'Gradient', value: 'gradient' },
                            ]}
                            onChange={(val) => updateAttribute('styleOverlay', 'type', val)}
                        />
                        {styleOverlay.type === 'color' ? (
                            <ColorPalette
                                value={styleOverlay.color}
                                onChange={(val) => updateAttribute('styleOverlay', 'color', val)}
                            />
                        ) : (
                            <GradientPicker
                                value={styleOverlay.gradient}
                                onChange={(val) => updateAttribute('styleOverlay', 'gradient', val)}
                            />
                        )}
                        <RangeControl
                            label={__('Opacity', 'flexblocks')}
                            value={styleOverlay.opacity}
                            onChange={(val) => updateAttribute('styleOverlay', 'opacity', val)}
                            min={0} max={1} step={0.1}
                        />
                        <SelectControl
                            label={__('Blend Mode', 'flexblocks')}
                            value={styleOverlay.blendMode}
                            options={[
                                { label: 'Normal', value: 'normal' },
                                { label: 'Multiply', value: 'multiply' },
                                { label: 'Screen', value: 'screen' },
                                { label: 'Overlay', value: 'overlay' },
                                { label: 'Darken', value: 'darken' },
                                { label: 'Lighten', value: 'lighten' },
                            ]}
                            onChange={(val) => updateAttribute('styleOverlay', 'blendMode', val)}
                        />
                    </>
                )}
            </PanelBody>

            <PanelBody title={__('Separators', 'flexblocks')} initialOpen={false}>
                {['top', 'bottom'].map(side => (
                    <div key={side} style={{ marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                        <ToggleControl
                            label={`${side.charAt(0).toUpperCase() + side.slice(1)} Divider`}
                            checked={attributes.styleSeparator?.[side]?.enable}
                            onChange={(val) => setAttributes({
                                styleSeparator: {
                                    ...attributes.styleSeparator,
                                    [side]: { ...attributes.styleSeparator[side], enable: val }
                                }
                            })}
                        />
                        {attributes.styleSeparator?.[side]?.enable && (
                            <>
                                <SelectControl
                                    label="Shape"
                                    value={attributes.styleSeparator[side].style}
                                    options={[
                                        { label: 'Wave', value: 'wave' },
                                        { label: 'Curve', value: 'curve' },
                                        { label: 'Triangle', value: 'triangle' },
                                    ]}
                                    onChange={(val) => setAttributes({
                                        styleSeparator: {
                                            ...attributes.styleSeparator,
                                            [side]: { ...attributes.styleSeparator[side], style: val }
                                        }
                                    })}
                                />
                                <RangeControl
                                    label="Height"
                                    value={attributes.styleSeparator[side].height}
                                    onChange={(val) => setAttributes({
                                        styleSeparator: {
                                            ...attributes.styleSeparator,
                                            [side]: { ...attributes.styleSeparator[side], height: val }
                                        }
                                    })}
                                    min={20} max={300}
                                />
                                <ColorPalette
                                    value={attributes.styleSeparator[side].color}
                                    onChange={(val) => setAttributes({
                                        styleSeparator: {
                                            ...attributes.styleSeparator,
                                            [side]: { ...attributes.styleSeparator[side], color: val }
                                        }
                                    })}
                                />
                            </>
                        )}
                    </div>
                ))}
            </PanelBody>

            <PanelBody title={__('Spacing (Responsive)', 'flexblocks')} initialOpen={false}>
                <DeviceToggle activeDevice={activeDevice} setActiveDevice={setActiveDevice} />
                {renderBoxInputs('Padding', 'padding')}
                <div style={{ height: '20px' }}></div>
                {renderBoxInputs('Margin', 'margin')}
            </PanelBody>

            <PanelBody title={__('Border & Shadow', 'flexblocks')} initialOpen={false}>
                {/* Simplified for now, can expand later */}
                <ToggleControl
                    label={__('Enable Shadow', 'flexblocks')}
                    checked={styleShadow.enable}
                    onChange={(val) => setAttributes({ styleShadow: { ...styleShadow, enable: val } })}
                />
                {styleShadow.enable && (
                    <>
                        <ColorPalette
                            value={styleShadow.color}
                            onChange={(val) => setAttributes({ styleShadow: { ...styleShadow, color: val } })}
                        />
                        <RangeControl
                            label="Blur"
                            value={styleShadow.blur}
                            onChange={(val) => setAttributes({ styleShadow: { ...styleShadow, blur: val } })}
                            min={0} max={100}
                        />
                    </>
                )}
            </PanelBody>
        </>
    );
};
