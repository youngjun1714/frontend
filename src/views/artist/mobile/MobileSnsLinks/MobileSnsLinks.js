import styles from './MobileSnsLinks.module.scss';
import Link from 'next/link';

import { Drawer } from '@mui/material';

import MobileDrawerContainer from '@/components/mobile-ui/MobileDrawer/MobileDrawerContainer';
import MobileDrawerList from '@/components/mobile-ui/MobileDrawer/MobileDrawerList';
import MobileSnsIcons from '@/components/mobile-ui/MobileIcons/MobileSnsIcons';
import MobileNodataIcon from '@/components/mobile-ui/MobileIcons/MobileNodataIcon';
import MobileRightChevron from '@/components/mobile-ui/MobileIcons/MobileRightChevron';

const MobileSnsLinks = (props) => {
  const { open, onClose, instagram, discord, twitter, youtube } = props;

  return (
    <Drawer
      sx={{
        backdropFilter: 'blur(6px)',
        '@media (min-width: 481px)': {
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
        {''.concat(instagram, discord, twitter, youtube).length === 0 && (
          <div className={styles.text}>
            <MobileNodataIcon />
            No Social media accounts
          </div>
        )}
        {instagram && (
          <Link href={`https://instagram.com/${instagram}`} target="_blank">
            <MobileDrawerList
              icon={<MobileSnsIcons shape="instagram" />}
              title="instagram"
              border
              arrow={<MobileRightChevron />}
            />
          </Link>
        )}
        {discord && (
          <Link
            href={`https://discord.com/channels/${discord}`}
            target="_blank"
          >
            <MobileDrawerList
              icon={<MobileSnsIcons shape="discord" />}
              title="discord"
              border
              arrow={<MobileRightChevron />}
            />
          </Link>
        )}
        {twitter && (
          <Link href={`https://twitter.com/${twitter}`} target="_blank">
            <MobileDrawerList
              icon={<MobileSnsIcons shape="twitter" />}
              title="X(twitter)"
              border
              arrow={<MobileRightChevron />}
            />
          </Link>
        )}
        {youtube && (
          <Link href={`https://youtube.com/@${youtube}`} target="_blank">
            <MobileDrawerList
              icon={<MobileSnsIcons shape="youtube" />}
              title="youtube"
              arrow={<MobileRightChevron />}
            />
          </Link>
        )}
      </MobileDrawerContainer>
    </Drawer>
  );
};

export default MobileSnsLinks;
