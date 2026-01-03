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

// Import utilities
import { ErrorBoundary } from '../components';

export default function Edit({ attributes, setAttributes, clientId }) {
    const {
        columnsCount = 2,
        stackMobile = true,
        columnGap = { value: 20, unit: 'px' },
        verticalAlign = 'stretch',
        reverseOrder = false
    } = attributes;

    const blockProps = useBlockProps({
        className: `wp-design-blocks-columns count-${columnsCount}`,
        style: {
            '--column-gap': `${columnGap?.value || 20}${columnGap?.unit || 'px'}`,
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
        // Validate count
        const validCount = Math.max(1, Math.min(6, parseInt(count) || 2));
        setAttributes({ columnsCount: validCount });

        const currentCount = innerBlocks?.length || 0;
        if (validCount > currentCount) {
            const newBlocks = [...(innerBlocks || [])];
            for (let i = currentCount; i < validCount; i++) {
                newBlocks.push(createBlock('wp-design-blocks/column'));
            }
            replaceInnerBlocks(clientId, newBlocks);
        }
    };

    return (
        <ErrorBoundary>
            <InspectorControls>
                <PanelBody title={__('Layout', 'wp-design-blocks')}>
                    <RangeControl
                        label={__('Columns', 'wp-design-blocks')}
                        value={columnsCount}
                        onChange={updateColumns}
                        min={1}
                        max={6}
                    />
                    <ToggleControl
                        label={__('Stack on Mobile', 'wp-design-blocks')}
                        checked={stackMobile}
                        onChange={(value) => setAttributes({ stackMobile: value })}
                    />
                    <RangeControl
                        label={__('Gap (px)', 'wp-design-blocks')}
                        value={columnGap?.value || 20}
                        onChange={(value) => setAttributes({ 
                            columnGap: { 
                                ...columnGap, 
                                value: Math.max(0, Math.min(100, parseInt(value) || 0))
                            } 
                        })}
                        min={0}
                        max={100}
                    />
                    <SelectControl
                        label={__('Vertical Align', 'wp-design-blocks')}
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
                        label={__('Reverse Order', 'wp-design-blocks')}
                        checked={reverseOrder}
                        onChange={(value) => setAttributes({ reverseOrder: value })}
                    />
                </PanelBody>
            </InspectorControls>

            <div {...blockProps}>
                <InnerBlocks
                    allowedBlocks={['wp-design-blocks/column']}
                    template={Array(columnsCount).fill(['wp-design-blocks/column'])}
                    templateLock={false}
                    orientation="horizontal"
                />
            </div>
        </ErrorBoundary>
    );
}
