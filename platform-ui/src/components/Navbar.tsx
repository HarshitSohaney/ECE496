import React, { useState } from 'react';
import { Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLibraryPlus,
} from '@tabler/icons-react';
import AssetLibrary from './AssetLibrary';
import Panel from './Panel';

interface NavbarLinkProps {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
  onClick?(): void;
}

const useNavbarLinkStyles = (active: boolean) => ({
  width: rem(50),
  height: rem(50),
  borderRadius: 'var(--mantine-radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: active
    ? 'var(--mantine-color-blue-light-color)'
    : 'var(--mantine-color-dark-0)',
  backgroundColor: active ? 'var(--mantine-color-blue-light)' : 'transparent',
  transition: 'background-color 0.3s ease',
});

const NavbarLink: React.FC<NavbarLinkProps> = ({
  icon: Icon,
  label,
  active = false,
  onClick,
}) => (
  <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
    <UnstyledButton
      onClick={onClick}
      style={{ ...useNavbarLinkStyles(active), cursor: 'pointer' }}
      data-active={active}
    >
      <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
    </UnstyledButton>
  </Tooltip>
);

const mockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconLibraryPlus, label: 'Library' },
  { icon: IconGauge, label: 'Dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconCalendarStats, label: 'Releases' },
  { icon: IconUser, label: 'Account' },
  { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' },
];

type PanelKey =
  | 'Library'
  | 'Dashboard'
  | 'Analytics'
  | 'Releases'
  | 'Account'
  | 'Security'
  | 'Settings';

const panels: Record<PanelKey, React.ReactNode> = {
  Library: <AssetLibrary />,
  Dashboard: <div>Example Content</div>,
  Analytics: <div>Example Content</div>,
  Releases: <div>Example Content</div>,
  Account: <div>Example Content</div>,
  Security: <div>Example Content</div>,
  Settings: <div>Example Content</div>,
};

export const NavbarMinimal: React.FC = () => {
  const [active, setActive] = useState<PanelKey | null>(null);

  const handleLinkClick = (label: PanelKey) => {
    setActive((current) => (current === label ? null : label));
  };

  return (
    <div style={{ display: 'flex' }}>
      <nav
        style={{
          width: active ? '380px' : rem(80),
          height: '100vh',
          padding: 'var(--mantine-spacing-md)',
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
          transition: 'width 0.3s ease',
        }}
      >
        <div
          style={{
            width: rem(80),
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack
            justify="center"
            gap={0}
            style={{ flex: 1, marginTop: rem(-150) }}
          >
            {mockdata.map((link) => (
              <NavbarLink
                {...link}
                key={link.label}
                active={link.label === active}
                onClick={() => handleLinkClick(link.label as PanelKey)}
              />
            ))}
          </Stack>
        </div>

        {Object.keys(panels).map((key) => (
          <Panel key={key} isOpen={active === key}>
            {panels[key as PanelKey]}
          </Panel>
        ))}
      </nav>
    </div>
  );
};
