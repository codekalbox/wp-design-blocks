/**
 * Section Block Edit Component.
 *
 * @package WP_Design_Blocks
 */

import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	ToggleControl,
	RangeControl,
	__experimentalUnitControl as UnitControl,
	__experimentalBoxControl as BoxControl,
	ColorPalette,
	GradientPicker,
	Button,
	ButtonGroup,
	Flex,
	FlexItem,
} from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';

import { ErrorBoundary, ResponsiveControl } from '../components';
import {
	generateUniqueId,
	generateCSSProps,
	generateClassNames,
	getResponsiveValue,
	updateResponsiveAttribute,
	getCSSValue,
} from '../shared';

/**
 * Section Edit Component.
 *
 * @param {Object} props - Component props.
 * @return {JSX.Element} Component markup.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const [ activeDevice, setActiveDevice ] = useState( 'desktop' );

	const {
		uniqueId,
		tagName,
		layout,
		flex,
		visibility,
		styleBackground,
		styleOverlay,
		styleSpacing,
		styleShadow,
		animation,
		advanced,
	} = attributes;

	// Generate unique ID if not set.
	useEffect( () => {
		if ( ! uniqueId ) {
			setAttributes( { uniqueId: generateUniqueId( 'section', clientId ) } );
		}
	}, [ uniqueId, clientId, setAttributes ] );

	// Generate CSS custom properties for current device.
	const cssProps = generateCSSProps( attributes, activeDevice );

	// Generate class names.
	const className = generateClassNames( attributes, 'wpdb-section' );

	// Block props with custom styles.
	const blockProps = useBlockProps( {
		className,
		style: cssProps,
		id: uniqueId,
	} );

	// Inner blocks props.
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'wpdb-section__content',
		},
		{
			templateLock: false,
		}
	);

	/**
	 * Update responsive attribute.
	 *
	 * @param {string} attributeName - Attribute name.
	 * @param {string} property      - Property to update.
	 * @param {*}      value         - New value.
	 */
	const updateResponsiveAttr = ( attributeName, property, value ) => {
		const currentAttr = attributes[ attributeName ] || {};
		const updatedAttr = updateResponsiveAttribute( currentAttr, activeDevice, property, value );
		setAttributes( { [ attributeName ]: updatedAttr } );
	};

	/**
	 * Update layout attribute.
	 *
	 * @param {string} property - Property to update.
	 * @param {*}      value    - New value.
	 */
	const updateLayout = ( property, value ) => {
		setAttributes( {
			layout: {
				...layout,
				[ property ]: value,
			},
		} );
	};

	/**
	 * Update style attribute.
	 *
	 * @param {string} styleName - Style attribute name.
	 * @param {string} property  - Property to update.
	 * @param {*}      value     - New value.
	 */
	const updateStyle = ( styleName, property, value ) => {
		const currentStyle = attributes[ styleName ] || {};
		setAttributes( {
			[ styleName ]: {
				...currentStyle,
				[ property ]: value,
			},
		} );
	};

	return (
		<ErrorBoundary>
			<BlockControls>
				<AlignmentToolbar
					value={ layout?.textAlign }
					onChange={ ( value ) => updateLayout( 'textAlign', value ) }
				/>
			</BlockControls>

			<InspectorControls>
				{/* Layout Panel */}
				<PanelBody title={ __( 'Layout', 'wp-design-blocks' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'HTML Tag', 'wp-design-blocks' ) }
						value={ tagName }
						options={ [
							{ label: __( 'Section', 'wp-design-blocks' ), value: 'section' },
							{ label: __( 'Div', 'wp-design-blocks' ), value: 'div' },
							{ label: __( 'Header', 'wp-design-blocks' ), value: 'header' },
							{ label: __( 'Main', 'wp-design-blocks' ), value: 'main' },
							{ label: __( 'Footer', 'wp-design-blocks' ), value: 'footer' },
							{ label: __( 'Article', 'wp-design-blocks' ), value: 'article' },
							{ label: __( 'Aside', 'wp-design-blocks' ), value: 'aside' },
						] }
						onChange={ ( value ) => setAttributes( { tagName: value } ) }
					/>

					<SelectControl
						label={ __( 'Width Type', 'wp-design-blocks' ) }
						value={ layout?.widthType || 'boxed' }
						options={ [
							{ label: __( 'Boxed', 'wp-design-blocks' ), value: 'boxed' },
							{ label: __( 'Full Width', 'wp-design-blocks' ), value: 'full' },
						] }
						onChange={ ( value ) => updateLayout( 'widthType', value ) }
					/>

					{ layout?.widthType === 'boxed' && (
						<UnitControl
							label={ __( 'Content Width', 'wp-design-blocks' ) }
							value={ layout?.contentWidth?.value || 1200 }
							units={ [
								{ value: 'px', label: 'px' },
								{ value: '%', label: '%' },
								{ value: 'vw', label: 'vw' },
							] }
							onChange={ ( value ) =>
								updateLayout( 'contentWidth', {
									value: parseInt( value ) || 1200,
									unit: 'px',
								} )
							}
						/>
					) }

					<ResponsiveControl
						activeDevice={ activeDevice }
						setActiveDevice={ setActiveDevice }
					/>

					<UnitControl
						label={ __( 'Min Height', 'wp-design-blocks' ) }
						value={ getCSSValue( layout?.minHeight, activeDevice, '0px' ) }
						units={ [
							{ value: 'px', label: 'px' },
							{ value: 'vh', label: 'vh' },
							{ value: 'em', label: 'em' },
						] }
						onChange={ ( value ) => {
							const numValue = parseInt( value ) || 0;
							const unit = value.replace( numValue.toString(), '' ) || 'px';
							updateResponsiveAttr( 'layout', 'minHeight', {
								value: numValue,
								unit,
							} );
						} }
					/>
				</PanelBody>

				{/* Flex Container Panel */}
				<PanelBody title={ __( 'Flex Container', 'wp-design-blocks' ) } initialOpen={ false }>
					<ResponsiveControl
						activeDevice={ activeDevice }
						setActiveDevice={ setActiveDevice }
					/>

					<SelectControl
						label={ __( 'Direction', 'wp-design-blocks' ) }
						value={ getResponsiveValue( flex, activeDevice, 'direction', 'column' ) }
						options={ [
							{ label: __( 'Column', 'wp-design-blocks' ), value: 'column' },
							{ label: __( 'Row', 'wp-design-blocks' ), value: 'row' },
							{ label: __( 'Column Reverse', 'wp-design-blocks' ), value: 'column-reverse' },
							{ label: __( 'Row Reverse', 'wp-design-blocks' ), value: 'row-reverse' },
						] }
						onChange={ ( value ) => updateResponsiveAttr( 'flex', 'direction', value ) }
					/>

					<SelectControl
						label={ __( 'Justify Content', 'wp-design-blocks' ) }
						value={ getResponsiveValue( flex, activeDevice, 'justify', 'flex-start' ) }
						options={ [
							{ label: __( 'Start', 'wp-design-blocks' ), value: 'flex-start' },
							{ label: __( 'Center', 'wp-design-blocks' ), value: 'center' },
							{ label: __( 'End', 'wp-design-blocks' ), value: 'flex-end' },
							{ label: __( 'Space Between', 'wp-design-blocks' ), value: 'space-between' },
							{ label: __( 'Space Around', 'wp-design-blocks' ), value: 'space-around' },
							{ label: __( 'Space Evenly', 'wp-design-blocks' ), value: 'space-evenly' },
						] }
						onChange={ ( value ) => updateResponsiveAttr( 'flex', 'justify', value ) }
					/>

					<SelectControl
						label={ __( 'Align Items', 'wp-design-blocks' ) }
						value={ getResponsiveValue( flex, activeDevice, 'align', 'stretch' ) }
						options={ [
							{ label: __( 'Stretch', 'wp-design-blocks' ), value: 'stretch' },
							{ label: __( 'Start', 'wp-design-blocks' ), value: 'flex-start' },
							{ label: __( 'Center', 'wp-design-blocks' ), value: 'center' },
							{ label: __( 'End', 'wp-design-blocks' ), value: 'flex-end' },
							{ label: __( 'Baseline', 'wp-design-blocks' ), value: 'baseline' },
						] }
						onChange={ ( value ) => updateResponsiveAttr( 'flex', 'align', value ) }
					/>

					<SelectControl
						label={ __( 'Wrap', 'wp-design-blocks' ) }
						value={ getResponsiveValue( flex, activeDevice, 'wrap', 'nowrap' ) }
						options={ [
							{ label: __( 'No Wrap', 'wp-design-blocks' ), value: 'nowrap' },
							{ label: __( 'Wrap', 'wp-design-blocks' ), value: 'wrap' },
							{ label: __( 'Wrap Reverse', 'wp-design-blocks' ), value: 'wrap-reverse' },
						] }
						onChange={ ( value ) => updateResponsiveAttr( 'flex', 'wrap', value ) }
					/>

					<RangeControl
						label={ __( 'Gap (px)', 'wp-design-blocks' ) }
						value={ getResponsiveValue( flex, activeDevice, 'gap', 20 ) }
						onChange={ ( value ) => updateResponsiveAttr( 'flex', 'gap', value ) }
						min={ 0 }
						max={ 100 }
					/>
				</PanelBody>

				{/* Background Panel */}
				<PanelBody title={ __( 'Background', 'wp-design-blocks' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Background Type', 'wp-design-blocks' ) }
						value={ styleBackground?.type || 'none' }
						options={ [
							{ label: __( 'None', 'wp-design-blocks' ), value: 'none' },
							{ label: __( 'Color', 'wp-design-blocks' ), value: 'color' },
							{ label: __( 'Gradient', 'wp-design-blocks' ), value: 'gradient' },
							{ label: __( 'Image', 'wp-design-blocks' ), value: 'image' },
						] }
						onChange={ ( value ) => updateStyle( 'styleBackground', 'type', value ) }
					/>

					{ styleBackground?.type === 'color' && (
						<ColorPalette
							label={ __( 'Background Color', 'wp-design-blocks' ) }
							value={ styleBackground?.color }
							onChange={ ( value ) => updateStyle( 'styleBackground', 'color', value ) }
						/>
					) }

					{ styleBackground?.type === 'gradient' && (
						<GradientPicker
							label={ __( 'Background Gradient', 'wp-design-blocks' ) }
							value={ styleBackground?.gradient }
							onChange={ ( value ) => updateStyle( 'styleBackground', 'gradient', value ) }
						/>
					) }
				</PanelBody>

				{/* Overlay Panel */}
				<PanelBody title={ __( 'Overlay', 'wp-design-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Enable Overlay', 'wp-design-blocks' ) }
						checked={ styleOverlay?.enable || false }
						onChange={ ( value ) => updateStyle( 'styleOverlay', 'enable', value ) }
					/>

					{ styleOverlay?.enable && (
						<>
							<SelectControl
								label={ __( 'Overlay Type', 'wp-design-blocks' ) }
								value={ styleOverlay?.type || 'color' }
								options={ [
									{ label: __( 'Color', 'wp-design-blocks' ), value: 'color' },
									{ label: __( 'Gradient', 'wp-design-blocks' ), value: 'gradient' },
								] }
								onChange={ ( value ) => updateStyle( 'styleOverlay', 'type', value ) }
							/>

							{ styleOverlay?.type === 'color' && (
								<ColorPalette
									label={ __( 'Overlay Color', 'wp-design-blocks' ) }
									value={ styleOverlay?.color }
									onChange={ ( value ) => updateStyle( 'styleOverlay', 'color', value ) }
								/>
							) }

							{ styleOverlay?.type === 'gradient' && (
								<GradientPicker
									label={ __( 'Overlay Gradient', 'wp-design-blocks' ) }
									value={ styleOverlay?.gradient }
									onChange={ ( value ) => updateStyle( 'styleOverlay', 'gradient', value ) }
								/>
							) }

							<RangeControl
								label={ __( 'Overlay Opacity', 'wp-design-blocks' ) }
								value={ styleOverlay?.opacity || 0.5 }
								onChange={ ( value ) => updateStyle( 'styleOverlay', 'opacity', value ) }
								min={ 0 }
								max={ 1 }
								step={ 0.1 }
							/>

							<SelectControl
								label={ __( 'Blend Mode', 'wp-design-blocks' ) }
								value={ styleOverlay?.blendMode || 'normal' }
								options={ [
									{ label: __( 'Normal', 'wp-design-blocks' ), value: 'normal' },
									{ label: __( 'Multiply', 'wp-design-blocks' ), value: 'multiply' },
									{ label: __( 'Screen', 'wp-design-blocks' ), value: 'screen' },
									{ label: __( 'Overlay', 'wp-design-blocks' ), value: 'overlay' },
									{ label: __( 'Darken', 'wp-design-blocks' ), value: 'darken' },
									{ label: __( 'Lighten', 'wp-design-blocks' ), value: 'lighten' },
								] }
								onChange={ ( value ) => updateStyle( 'styleOverlay', 'blendMode', value ) }
							/>
						</>
					) }
				</PanelBody>

				{/* Spacing Panel */}
				<PanelBody title={ __( 'Spacing', 'wp-design-blocks' ) } initialOpen={ false }>
					<ResponsiveControl
						activeDevice={ activeDevice }
						setActiveDevice={ setActiveDevice }
					/>

					<BoxControl
						label={ __( 'Padding', 'wp-design-blocks' ) }
						values={ {
							top: getResponsiveValue( styleSpacing?.padding, activeDevice, 'top', '50' ) + 'px',
							right: getResponsiveValue( styleSpacing?.padding, activeDevice, 'right', '20' ) + 'px',
							bottom: getResponsiveValue( styleSpacing?.padding, activeDevice, 'bottom', '50' ) + 'px',
							left: getResponsiveValue( styleSpacing?.padding, activeDevice, 'left', '20' ) + 'px',
						} }
						onChange={ ( values ) => {
							const padding = {
								top: parseInt( values.top ) || 0,
								right: parseInt( values.right ) || 0,
								bottom: parseInt( values.bottom ) || 0,
								left: parseInt( values.left ) || 0,
								unit: 'px',
							};
							updateResponsiveAttr( 'styleSpacing', 'padding', padding );
						} }
					/>

					<BoxControl
						label={ __( 'Margin', 'wp-design-blocks' ) }
						values={ {
							top: getResponsiveValue( styleSpacing?.margin, activeDevice, 'top', '0' ) + 'px',
							right: getResponsiveValue( styleSpacing?.margin, activeDevice, 'right', '0' ) + 'px',
							bottom: getResponsiveValue( styleSpacing?.margin, activeDevice, 'bottom', '0' ) + 'px',
							left: getResponsiveValue( styleSpacing?.margin, activeDevice, 'left', '0' ) + 'px',
						} }
						onChange={ ( values ) => {
							const margin = {
								top: parseInt( values.top ) || 0,
								right: parseInt( values.right ) || 0,
								bottom: parseInt( values.bottom ) || 0,
								left: parseInt( values.left ) || 0,
								unit: 'px',
							};
							updateResponsiveAttr( 'styleSpacing', 'margin', margin );
						} }
					/>
				</PanelBody>

				{/* Shadow Panel */}
				<PanelBody title={ __( 'Shadow', 'wp-design-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Enable Shadow', 'wp-design-blocks' ) }
						checked={ styleShadow?.enable || false }
						onChange={ ( value ) => updateStyle( 'styleShadow', 'enable', value ) }
					/>

					{ styleShadow?.enable && (
						<>
							<RangeControl
								label={ __( 'Horizontal Offset', 'wp-design-blocks' ) }
								value={ styleShadow?.hOffset || 0 }
								onChange={ ( value ) => updateStyle( 'styleShadow', 'hOffset', value ) }
								min={ -50 }
								max={ 50 }
							/>

							<RangeControl
								label={ __( 'Vertical Offset', 'wp-design-blocks' ) }
								value={ styleShadow?.vOffset || 0 }
								onChange={ ( value ) => updateStyle( 'styleShadow', 'vOffset', value ) }
								min={ -50 }
								max={ 50 }
							/>

							<RangeControl
								label={ __( 'Blur', 'wp-design-blocks' ) }
								value={ styleShadow?.blur || 10 }
								onChange={ ( value ) => updateStyle( 'styleShadow', 'blur', value ) }
								min={ 0 }
								max={ 100 }
							/>

							<RangeControl
								label={ __( 'Spread', 'wp-design-blocks' ) }
								value={ styleShadow?.spread || 0 }
								onChange={ ( value ) => updateStyle( 'styleShadow', 'spread', value ) }
								min={ -50 }
								max={ 50 }
							/>

							<ColorPalette
								label={ __( 'Shadow Color', 'wp-design-blocks' ) }
								value={ styleShadow?.color }
								onChange={ ( value ) => updateStyle( 'styleShadow', 'color', value ) }
							/>

							<ToggleControl
								label={ __( 'Inset Shadow', 'wp-design-blocks' ) }
								checked={ styleShadow?.inset || false }
								onChange={ ( value ) => updateStyle( 'styleShadow', 'inset', value ) }
							/>
						</>
					) }
				</PanelBody>

				{/* Animation Panel */}
				<PanelBody title={ __( 'Animation', 'wp-design-blocks' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Animation Type', 'wp-design-blocks' ) }
						value={ animation?.type || 'none' }
						options={ [
							{ label: __( 'None', 'wp-design-blocks' ), value: 'none' },
							{ label: __( 'Fade In', 'wp-design-blocks' ), value: 'fade-in' },
							{ label: __( 'Slide Up', 'wp-design-blocks' ), value: 'slide-up' },
							{ label: __( 'Zoom In', 'wp-design-blocks' ), value: 'zoom-in' },
							{ label: __( 'Scale Up', 'wp-design-blocks' ), value: 'scale-up' },
						] }
						onChange={ ( value ) => updateStyle( 'animation', 'type', value ) }
					/>

					{ animation?.type && animation?.type !== 'none' && (
						<>
							<RangeControl
								label={ __( 'Duration (seconds)', 'wp-design-blocks' ) }
								value={ animation?.duration || 0.8 }
								onChange={ ( value ) => updateStyle( 'animation', 'duration', value ) }
								min={ 0.1 }
								max={ 3 }
								step={ 0.1 }
							/>

							<RangeControl
								label={ __( 'Delay (seconds)', 'wp-design-blocks' ) }
								value={ animation?.delay || 0 }
								onChange={ ( value ) => updateStyle( 'animation', 'delay', value ) }
								min={ 0 }
								max={ 2 }
								step={ 0.1 }
							/>
						</>
					) }
				</PanelBody>

				{/* Visibility Panel */}
				<PanelBody title={ __( 'Visibility', 'wp-design-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Hide on Desktop', 'wp-design-blocks' ) }
						checked={ visibility?.hideDesktop || false }
						onChange={ ( value ) =>
							setAttributes( {
								visibility: { ...visibility, hideDesktop: value },
							} )
						}
					/>

					<ToggleControl
						label={ __( 'Hide on Tablet', 'wp-design-blocks' ) }
						checked={ visibility?.hideTablet || false }
						onChange={ ( value ) =>
							setAttributes( {
								visibility: { ...visibility, hideTablet: value },
							} )
						}
					/>

					<ToggleControl
						label={ __( 'Hide on Mobile', 'wp-design-blocks' ) }
						checked={ visibility?.hideMobile || false }
						onChange={ ( value ) =>
							setAttributes( {
								visibility: { ...visibility, hideMobile: value },
							} )
						}
					/>
				</PanelBody>

				{/* Advanced Panel */}
				<PanelBody title={ __( 'Advanced', 'wp-design-blocks' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Z-Index', 'wp-design-blocks' ) }
						value={ advanced?.zIndex || 1 }
						onChange={ ( value ) => updateStyle( 'advanced', 'zIndex', value ) }
						min={ 0 }
						max={ 999 }
					/>

					<SelectControl
						label={ __( 'Overflow', 'wp-design-blocks' ) }
						value={ advanced?.overflow || 'visible' }
						options={ [
							{ label: __( 'Visible', 'wp-design-blocks' ), value: 'visible' },
							{ label: __( 'Hidden', 'wp-design-blocks' ), value: 'hidden' },
							{ label: __( 'Scroll', 'wp-design-blocks' ), value: 'scroll' },
							{ label: __( 'Auto', 'wp-design-blocks' ), value: 'auto' },
						] }
						onChange={ ( value ) => updateStyle( 'advanced', 'overflow', value ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				{ styleOverlay?.enable && (
					<div className="wpdb-overlay" />
				) }
				<div { ...innerBlocksProps } />
			</div>
		</ErrorBoundary>
	);
}

