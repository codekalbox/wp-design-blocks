/**
 * Responsive Control Component.
 *
 * Provides device toggle buttons for responsive controls.
 *
 * @package WP_Design_Blocks
 */

import { Button, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { desktop, tablet, mobile } from '@wordpress/icons';

/**
 * Device icons map.
 */
const DEVICE_ICONS = {
	desktop,
	tablet,
	mobile,
};

/**
 * Device labels map.
 */
const DEVICE_LABELS = {
	desktop: __( 'Desktop', 'wp-design-blocks' ),
	tablet: __( 'Tablet', 'wp-design-blocks' ),
	mobile: __( 'Mobile', 'wp-design-blocks' ),
};

/**
 * ResponsiveControl component.
 *
 * @param {Object}   props                - Component props.
 * @param {string}   props.activeDevice   - Currently active device.
 * @param {Function} props.setActiveDevice - Function to set active device.
 * @return {JSX.Element} Component markup.
 */
export default function ResponsiveControl( { activeDevice = 'desktop', setActiveDevice } ) {
	return (
		<div className="wpdb-responsive-control">
			<ButtonGroup>
				{ Object.keys( DEVICE_ICONS ).map( ( device ) => (
					<Button
						key={ device }
						icon={ DEVICE_ICONS[ device ] }
						label={ DEVICE_LABELS[ device ] }
						isPressed={ activeDevice === device }
						onClick={ () => setActiveDevice( device ) }
					/>
				) ) }
			</ButtonGroup>
		</div>
	);
}

