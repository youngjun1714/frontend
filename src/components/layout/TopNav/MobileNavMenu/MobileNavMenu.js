import { useState } from 'react';
import { useRouter } from 'next/router';

import MobileDrawerContainer from '@/components/mobile-ui/MobileDrawer/MobileDrawerContainer';
import MobileDrawerList from '@/components/mobile-ui/MobileDrawer/MobileDrawerList';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import MobileNavIcons from '@/components/mobile-ui/MobileIcons/MobileNavIcons';
import dynamic from 'next/dynamic';

const Drawer = dynamic(() => import('@mui/material/Drawer'));
const MobileCreate = dynamic(() =>
  import('@/components/mobile-ui/MobileCreate/MobileCreate')
);
const MobileConnectBox = dynamic(() =>
  import('@/components/mobile-ui/MobileNavigation/MobileConnectBox')
);

const MobileNavMenu = (props) => {
  const { open, onClose, onChangePath, isPartner } = props;
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const handleChangePath = (value) => {
    onChangePath(value);
    router.push(value);
    onClose();
  };

  return (
    <>
      {open && (
        <Drawer
          sx={{
            backdropFilter: 'blur(6px)',
            '@media (min-width: 1024px)': {
              display: 'none',
            },
            '&': {
              zIndex: 1500,
            },
            '& > .MuiPaper-root': {
              backgroundColor: 'transparent',
            },
          }}
          open={open}
          transitionDuration={200}
          anchor="bottom"
          onClose={onClose}
        >
          <MobileDrawerContainer>
            <MobileDrawerList
              arrow
              icon={<MobileNavIcons shape="creation" />}
              onClick={() => handleChangePath('/creation')}
              title="Creation"
            />
            <MobileDrawerList
              arrow
              icon={<MobileNavIcons shape="feed" />}
              onClick={() => handleChangePath('/feed')}
              title="Feed"
            />
            <AuthRequiredButtonWrapper
              onClick={() => {
                setIsCreateOpen(true);
                onClose();
              }}
            >
              <MobileDrawerList
                arrow
                icon={<MobileNavIcons shape="create" />}
                title="Create"
              />
            </AuthRequiredButtonWrapper>
            <AuthRequiredButtonWrapper
              onClick={() => {
                setIsConnectOpen(true);
                onClose();
              }}
            >
              <MobileDrawerList
                arrow
                icon={<MobileNavIcons shape="my" />}
                title="My"
              />
            </AuthRequiredButtonWrapper>
          </MobileDrawerContainer>
        </Drawer>
      )}
      {isCreateOpen && (
        <MobileCreate
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          isPartner={isPartner}
        />
      )}
      {isConnectOpen && (
        <MobileConnectBox
          open={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
        />
      )}
    </>
  );
};

export default MobileNavMenu;
