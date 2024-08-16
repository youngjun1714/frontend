import { Modal, Stack } from '@mui/material';

import styles from './Modal.module.scss';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import Close from '@/components/ui/Icons/Close';
import Picture from '@/components/ui/Picture/Picture';
import Avatar from '@/components/ui/Avatar/Avatar';
import IsArtist from '@/components/ui/Icons/IsArtist';

const LatestSelectedArtistModal = ({ open, onClose, data }) => {
  const { accumVp, candidatePartnerInfo, nickname, artistName, profileImgUrl } =
    data || {};

  const { promotionThumbnailUrl } = candidatePartnerInfo || {};

  return (
    <Modal open={open} onClose={onClose} className={styles.modal}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={`${styles.headerTitle} ${styles.center}`}>
            Selected <b>Artist!</b>
          </div>
          <button
            aria-label="close button"
            className={styles.closeButton}
            onClick={onClose}
          >
            <Close />
          </button>
        </div>
        <div className={styles.latestSelectedArtistModal}>
          <div className={styles.artworkWrap}>
            <Picture
              url={promotionThumbnailUrl}
              objectFit="cover"
              loading="lazy"
              placeholder="blur"
              alt={nickname}
              blurDataURL="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVR42mN8//HLfwYiAOOoQvoqBABbWyZJf74GZgAAAABJRU5ErkJggg=="
              sizes="400px"
              style={{ objectFit: 'cover' }}
              fill={true}
            />
          </div>
          <div className={styles.voteForm}>
            <div className={styles.flexDiv}>
              <div className={styles.label}>
                <Stack direction="row" alignItems="center" gap="10px">
                  <Avatar
                    image={profileImgUrl}
                    username={nickname}
                    type="mdl"
                  />
                  <div className={styles.nameWrap}>
                    <div className={styles.userName}>
                      {nickname}
                      <IsArtist />
                    </div>
                    <div className={styles.artistName}>@{artistName}</div>
                  </div>
                </Stack>
              </div>

              <div className={styles.value}>
                <div className={styles.artistName}>Total VP Received</div>
                <InfoTypography content={accumVp} size="md" decimals={0} />
              </div>
            </div>

            <button className={styles.goBtn} onClick={onClose}>
              Ok
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default LatestSelectedArtistModal;
