import styles from './MobileArtistFollow.module.scss';

import MobileArtistFollowers from './MobileArtistFollowers';
import MobileArtistFollowing from './MobileArtistFollowing';

const MobileArtistFollowTable = (props) => {
  const { menu, userId, onClose, isMe } = props;

  return (
    <article className={styles.article}>
      {menu === 'followers' && (
        <MobileArtistFollowers userId={userId} onClose={onClose} isMe={isMe} />
      )}
      {menu === 'following' && (
        <MobileArtistFollowing userId={userId} onClose={onClose} isMe={isMe} />
      )}
    </article>
  );
};

export default MobileArtistFollowTable;
