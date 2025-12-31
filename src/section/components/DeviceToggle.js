import { Button } from '@wordpress/components';
import { desktop, tablet, mobile } from '@wordpress/icons';

export const DeviceToggle = ({ activeDevice, setActiveDevice }) => (
    <div className="flexblocks-device-toggle">
        {[
            { name: 'desktop', icon: desktop },
            { name: 'tablet', icon: tablet },
            { name: 'mobile', icon: mobile }
        ].map(device => (
            <Button
                key={device.name}
                isSmall
                variant={activeDevice === device.name ? 'primary' : 'tertiary'}
                onClick={() => setActiveDevice(device.name)}
                icon={device.icon}
                label={`Switch to ${device.name} view`}
            />
        ))}
    </div>
);
