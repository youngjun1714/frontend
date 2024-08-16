import { CircularProgress, Modal, Stack } from '@mui/material';

import styles from './Modal.module.scss';
import InfoTypography from '@/components/ui/Typography/InfoTypography';
import StatusLabel from '@/components/ui/StatusLabel/StatusLabel';
import Close from '@/components/ui/Icons/Close';
import CheckSquare from '@/components/ui/Icons/CheckSquare';
import { NumericFormat } from 'react-number-format';
import Picture from '@/components/ui/Picture/Picture';
import Avatar from '@/components/ui/Avatar/Avatar';

const VoteModal = ({
  open,
  onClose,
  onOpenVoteConfirm,
  selectedArtist,
  loading,
  amount,
  onChangeAmount,
  availableVp,
  roundNo,
}) => {
  const { nickname, artistName, profileImgUrl, promotionThumbnailUrl } =
    selectedArtist || {};

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      className={styles.modal}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <div className={styles.headerTitle}>
            <div>Round {roundNo}</div>
            <StatusLabel label="LIVE" />
          </div>
          <button
            aria-label="close button"
            className={styles.closeButton}
            onClick={loading ? () => {} : onClose}
          >
            <Close />
          </button>
        </div>
        <div className={styles.voteModal}>
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
              <div className={styles.label}>Vote to</div>
              <div className={styles.value}>
                <Stack direction="row" alignItems="center" gap="10px">
                  <Avatar image={profileImgUrl} username={nickname} type="md" />
                  <div className={styles.nameWrap}>
                    <div className={styles.userName}>{nickname}</div>
                    <div className={styles.artistName}>@{artistName}</div>
                  </div>
                </Stack>
              </div>
            </div>

            <div className={styles.flexDiv}>
              <div className={styles.label}>Available</div>
              <div className={styles.value}>
                <InfoTypography
                  content={availableVp}
                  endDecorator="VP"
                  size="md"
                  decimals={0}
                />
              </div>
            </div>

            <div className={styles.flexDiv}>
              <div className={styles.label}>
                <b>VP to Use</b>
              </div>
              <div className={styles.value}>
                <div className={styles.input}>
                  <NumericFormat
                    decimalScale={0}
                    onValueChange={(values) => {
                      onChangeAmount(values.floatValue);
                    }}
                    allowNegative={false}
                    placeholder="Enter the number of VP to use"
                    thousandSeparator=","
                    value={amount}
                    disabled={loading}
                    maxLength={12}
                  />
                  <span>VP</span>
                </div>
              </div>
            </div>
            <button
              className={styles.voteBtn}
              onClick={onOpenVoteConfirm}
              disabled={
                !amount || loading || !availableVp || availableVp < amount
              }
            >
              {loading && (
                <CircularProgress
                  thickness={5}
                  sx={{
                    width: '24px !important',
                    height: '24px !important',
                    color: 'var(--artiside-neutral2) !important',
                    marginRight: 2,
                  }}
                />
              )}
              <CheckSquare /> Vote
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default VoteModal;
