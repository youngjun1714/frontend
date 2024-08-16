import { useState } from 'react';
import styles from './ArtistNodata.module.scss';

import Button from '@/components/ui/Button/Button';
import PencilDoodle from '@/components/ui/Icons/PencilDoodle';
import dynamic from 'next/dynamic';

const CreatePopup = dynamic(() =>
  import('@/components/layout/TopNav/CreatePopup/CreatePopup')
);
const MobileCreate = dynamic(() =>
  import('@/components/mobile-ui/MobileCreate/MobileCreate')
);

function ArtistInspirationNodata({ me }) {
  // web create
  const [open, setOpen] = useState(false);

  // mobile create
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleModalClose = () => {
    setOpen(false);
  };

  return (
    <section className={styles.section}>
      <div>
        <PencilDoodle />
        <h1>
          {me ? 'Create and share your inspiration' : 'No Inspiration yet'}
        </h1>
      </div>
      {me && (
        <>
          <Button
            className="webOnly"
            type="secondary"
            size="sm"
            color="var(--artiside-neutral1)"
            onClick={() => setOpen(true)}
          >
            Create
          </Button>
          <Button
            className="mobileOnly"
            type="secondary"
            size="sm"
            color="var(--artiside-neutral1)"
            onClick={() => setMobileOpen(true)}
          >
            Create
          </Button>
          {open && <CreatePopup onClose={handleModalClose} open={open} />}
          {mobileOpen && (
            <MobileCreate
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
            />
          )}
        </>
      )}
    </section>
  );
}

export default ArtistInspirationNodata;
