import { useState } from 'react';
import styles from './ArtistNodata.module.scss';

import Button from '@/components/ui/Button/Button';
import PencilDoodle from '@/components/ui/Icons/PencilDoodle';
import dynamic from 'next/dynamic';

const ImportArtworks = dynamic(() =>
  import('@/components/layout/TopNav/CreatePopup/ImportArtworks')
);

function ArtistArtworkNodata({ me }) {
  const [open, setOpen] = useState(false);

  return (
    <section className={styles.section}>
      <div>
        <PencilDoodle />
        <h1>{me ? 'Create and share your Artwork' : 'No Artwork yet'}</h1>
      </div>
      {me && (
        <Button
          type="secondary"
          size="sm"
          color="var(--artiside-neutral1)"
          onClick={() => setOpen(true)}
        >
          Create
        </Button>
      )}
      {open && <ImportArtworks open={open} onClose={() => setOpen(false)} />}
    </section>
  );
}

export default ArtistArtworkNodata;
