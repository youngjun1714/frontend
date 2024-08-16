import React from 'react';

import styles from '@/views/feed/components/feed-creator-wrapper/FeedCreatorWrapper.module.scss';

import Avatar from '@/components/ui/Avatar/Avatar';
import Link from 'next/link';

function FeedCreatorWrapper(props) {
  const { children, data } = props;

  return (
    <article className={styles.container}>
      <div className={styles.creatorWrapper}>
        {data?.map((item, idx) => {
          const { user } = item || {};
          return (
            <Link
              key={`FeedCreatorWrapper-${idx}`}
              href={`/artist/${user?.id}`}
            >
              <div className={styles.creator}>
                <Avatar
                  type="lg"
                  image={user?.profileImgUrl}
                  username={user?.nickname}
                />
                <p>{user?.nickname}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {children}
    </article>
  );
}

export default FeedCreatorWrapper;
