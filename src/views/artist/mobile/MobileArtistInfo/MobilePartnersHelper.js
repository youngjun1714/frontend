import styles from './MobilePartnersHelper.module.scss';

import { Drawer } from '@mui/material';

import MobileDrawerContainer from '@/components/mobile-ui/MobileDrawer/MobileDrawerContainer';

const MobilePartnersHelper = (props) => {
  const { open, onClose } = props;
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
        <section className={styles.section}>
          <div className={styles.header}>
            <h1>Partners Account</h1>
          </div>

          <div className={styles.body}>
            <p>
              <b>Partners</b> is a paid membership program that allows artists
              to register tradable NFTs. Through <b>Partners</b>, artists can
              sell their registered art or even receive patronage through the
              <span> ADF Token Seeding</span> program on Artiside.
            </p>
          </div>

          <div className={styles.line} />

          <div className={styles.button}>
            <button
              onClick={() => window.open('https://partners.artdefinance.io')}
            >
              Go to Partner Site
            </button>
          </div>
        </section>
      </MobileDrawerContainer>
    </Drawer>
  );
};

export default MobilePartnersHelper;
