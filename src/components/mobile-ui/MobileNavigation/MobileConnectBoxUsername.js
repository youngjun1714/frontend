import styles from './MobileConnectBoxUsername.module.scss';
import Link from 'next/link';

import Avatar from '@/components/ui/Avatar/Avatar';
import MobileRightChevron from '../MobileIcons/MobileRightChevron';
import MobileIsPartnerBadge from '../MobileIcons/MobileIsPartnerBadge';

const MobileConnectBoxUsername = (props) => {
  const { nickname, profileImgUrl, isPartner, artistName, id, onClose } = props;
  return (
    <Link href={`/artist/${id}`} onClick={onClose}>
      <div className={styles.nameWrapper}>
        <div className={styles.name}>
          <Avatar size="56px" username={nickname} image={profileImgUrl} />
          <article>
            <h1>
              {nickname} {isPartner && <MobileIsPartnerBadge />}
            </h1>
            {isPartner && <h2>@{artistName}</h2>}
          </article>
        </div>
        <button>
          <MobileRightChevron />
        </button>
      </div>
    </Link>
  );
};

export default MobileConnectBoxUsername;
