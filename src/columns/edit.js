import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InnerBlocks,
    InspectorControls
} from '@wordpress/block-editor';
import {
    PanelBody,
    RangeControl,
    ToggleControl,
    SelectControl
} from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { useDispatch, useSelect } from '@wordpress/data';
import './editor.scss';

export default function Edit({ attributes, setAttributes, clientId }) {
    const {
        columnsCount,
        stackMobile,
        columnGap,
        verticalAlign,
        reverseOrder
    } = attributes;

    const blockProps = useBlockProps({
        className: `flexblocks-columns count-${columnsCount}`,
        style: {
            '--column-gap': `${columnGap.value}${columnGap.unit}`,
            '--vertical-align': verticalAlign === 'top' ? 'flex-start' : verticalAlign === 'bottom' ? 'flex-end' : verticalAlign,
            '--stack-mobile': stackMobile ? 'column' : 'row',
            '--flex-direction': reverseOrder ? 'row-reverse' : 'row'
        }
    });

    // Manage inner blocks based on column count
    const { replaceInnerBlocks } = useDispatch('core/block-editor');
    const { innerBlocks } = useSelect((select) => ({
        innerBlocks: select('core/block-editor').getBlocks(clientId)
    }), [clientId]);

    const updateColumns = (count) => {
        setAttributes({ columnsCount: count });

        const currentCount = innerBlocks.length;
        if (count > currentCount) {
            const newBlocks = [...innerBlocks];
            for (let i = currentCount; i < count; i++) {
                newBlocks.push(createBlock('flexblocks/column'));
            }
            replaceInnerBlocks(clientId, newBlocks);
        }
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Layout', 'flexblocks')}>
                    <RangeControl
                        label={__('Columns', 'flexblocks')}
                        value={columnsCount}
                        onChange={updateColumns}
                        min={1}
                        max={6}
                    />
                    <ToggleControl
                        label={__('Stack on Mobile', 'flexblocks')}
                        checked={stackMobile}
                        onChange={(value) => setAttributes({ stackMobile: value })}
                    />
                    <RangeControl
                        label={__('Gap (px)', 'flexblocks')}
                        value={columnGap.value}
                        onChange={(value) => setAttributes({ columnGap: { ...columnGap, value } })}
                        min={0}
                        max={100}
                    />
                    <SelectControl
                        label={__('Vertical Align', 'flexblocks')}
                        value={verticalAlign}
                        options={[
                            { label: 'Top', value: 'top' },
                            { label: 'Center', value: 'center' },
                            { label: 'Bottom', value: 'bottom' },
                            { label: 'Stretch', value: 'stretch' },
                        ]}
                        onChange={(value) => setAttributes({ verticalAlign: value })}
                    />
                    <ToggleControl
                        label={__('Reverse Order', 'flexblocks')}
                        checked={reverseOrder}
                        onChange={(value) => setAttributes({ reverseOrder: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['flexblocks/column']}
                    template={Array(columnsCount).fill(['flexblocks/column'])}
                    templateLock={false}
                    orientation="horizontal"
                />
            </div>
        </>
    );
}
