import { Drawer } from '@mui/material';

import MobileDrawerContainer from '@/components/mobile-ui/MobileDrawer/MobileDrawerContainer';
import MobileArtistFollowNav from './MobileArtistFollowNav';
import MobileArtistFollowTable from './MobileArtistFollowTable';

const MobileArtistFollow = (props) => {
  const { open, onClose, userId, onChangeNav, isMe } = props;

  return (
    <Drawer
      sx={{
        backdropFilter: 'blur(6px)',
        '@media (min-width: 900px)': {
          display: 'none',
        },
        '&': {
          zIndex: 1500,
        },
        '& > .MuiPaper-root': {
          backgroundColor: 'transparent',
        },
      }}
      open={!!open}
      transitionDuration={200}
      anchor="bottom"
      onClose={onClose}
    >
      <MobileDrawerContainer
        type="long"
        border={false}
        padding={false}
        onClose={onClose}
      >
        <MobileArtistFollowNav menu={open} onChangeNav={onChangeNav} />
        <MobileArtistFollowTable
          menu={open}
          userId={userId}
          onClose={onClose}
          isMe={isMe}
        />
      </MobileDrawerContainer>
    </Drawer>
  );
};

export default MobileArtistFollow;
