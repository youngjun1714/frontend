import React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './MobileNavigation.module.scss';
import { useRecoilValue } from 'recoil';
import { useRouter } from 'next/router';

import stores from '@/store';
import Avatar from '@/components/ui/Avatar/Avatar';
import MobileNavIcons from '@/components/mobile-ui/MobileIcons/MobileNavIcons';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import dynamic from 'next/dynamic';

const MobileCreate = dynamic(() => import('../MobileCreate/MobileCreate'));
const MobileConnectBox = dynamic(() =>
  import('@/components/mobile-ui/MobileNavigation/MobileConnectBox')
);
const MobileNavigation = (props) => {
  const { isHidden, isNeedNav, path, onChangePath, setPath } = props;

  const router = useRouter();

  const { query, pathname } = router;
  const { my, create } = query;

  const { my: queryMy, ...myRest } = query;

  const [menu, setMenu] = useState('creation');
  const [navOpen, setNavOpen] = useState(my === 'true');
  const [isCreateOpen, setIsCreateOpen] = useState(create);

  useEffect(() => {
    setNavOpen(false);
    setIsCreateOpen(false);
  }, [my, create]);

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  return (
    <nav
      className={styles.nav}
      style={{
        borderRadius: my ? 0 : '20px 20px 0 0',
        bottom: isHidden || !isNeedNav ? '-100px' : 0,
      }}
    >
      <Link href="/creation">
        <div
          className={styles.navItem}
          onClick={() => {
            onChangePath('/creation');
            setNavOpen(false);
          }}
        >
          <MobileNavIcons
            shape="creation"
            active={path === '/creation' || path === '/'}
          />
          <span>Creation</span>
        </div>
      </Link>
      <Link href="/feed">
        <div
          className={styles.navItem}
          onClick={() => {
            onChangePath('/feed');
            setNavOpen(false);
          }}
        >
          <MobileNavIcons shape="feed" active={path === '/feed'} />
          <span>Feed</span>
        </div>
      </Link>
      <AuthRequiredButtonWrapper
        // onClick={() => {
        //   setCreateOpen(true);
        // }}
        onClick={() => {
          if (isCreateOpen) {
            router.push(
              {
                pathname,
              },
              undefined,
              { shallow: true }
            );
          } else {
            router.push(
              {
                pathname,
                query: { ...query, create: true },
              },
              undefined,
              { shallow: true }
            );
          }
        }}
      >
        <div className={styles.navItem}>
          <MobileNavIcons shape="create" active={menu === 'create'} />
          <span>Create</span>
        </div>
      </AuthRequiredButtonWrapper>
      <AuthRequiredButtonWrapper
        onClick={() => {
          if (navOpen) {
            setPath('');
            router.push(
              {
                pathname,
              },
              undefined,
              { shallow: true }
            );
          } else {
            setPath('my');
            router.push(
              {
                pathname,
                query: { ...query, my: true },
              },
              undefined,
              { shallow: true }
            );
          }
          setNavOpen(!navOpen);
        }}
      >
        <div className={styles.navItem}>
          <div
            style={{
              border: my ? '2px solid var(--primary-color)' : 'none',
              borderRadius: 100,
            }}
          >
            <Avatar
              type="xs"
              username={me?.nickname}
              image={me?.profileImgUrl}
            />
          </div>
          <span>My</span>
        </div>
      </AuthRequiredButtonWrapper>
      {my && (
        <MobileConnectBox
          open={my}
          onClose={() =>
            router.push({ pathname, query: myRest }, undefined, {
              shallow: true,
            })
          }
        />
      )}
      {create && (
        <MobileCreate
          open={create === 'true'}
          onClose={() => router.back({ shallow: true })}
          isPartner={me?.isPartner}
        />
      )}
    </nav>
  );
};

export default MobileNavigation;
