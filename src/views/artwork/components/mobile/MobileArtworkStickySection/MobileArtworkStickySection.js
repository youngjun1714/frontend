import styles from './MobileArtworkStickySection.module.scss';

import Button from '@/components/ui/Button/Button';
import MobileClapLargeIcon from '@/components/mobile-ui/MobileIcons/MobileClapLargeIcon';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';

const MobileArtworkStickySection = (props) => {
  const { artworkId, isOnSale, onClick, isLiked, isHidden } = props;

  return (
    <div
      className={styles.container}
      style={{ bottom: isHidden ? '-100px' : 0 }}
    >
      <Button
        size="lg"
        type="secondary"
        color="var(--artiside-neutral1)"
        disabled={true}
        // onClick={() => {
        //   if (isOnSale) {
        //     // window.location.href = `${process.env.NEXT_PUBLIC_THE_FLUX_URL}/artwork/${artworkId}`;
        //     window.open(
        //       `${process.env.NEXT_PUBLIC_THE_FLUX_URL}/artwork/${artworkId}`,
        //       '_blank'
        //     );
        //   }
        // }}
      >
        {isOnSale ? <>PC purchase only</> : <>This artwork is not for sale</>}
      </Button>
      <AuthRequiredButtonWrapper onClick={onClick}>
        <button className={isLiked ? styles.isLiked : ''} aria-label="like">
          <MobileClapLargeIcon isLiked={isLiked} />
        </button>
      </AuthRequiredButtonWrapper>
    </div>
  );
};

export default MobileArtworkStickySection;
