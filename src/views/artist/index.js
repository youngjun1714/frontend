import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import axios from 'axios';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { Container, Unstable_Grid2 as Grid } from '@mui/material';

import styles from '@/views/artist/Artist.module.scss';

import stores from '@/store';
import ArtistInfoCard from '@/views/artist/components/artist-info-card/ArtistInfoCard';
import ArtistAsideNav from '@/views/artist/components/artist-aside-nav/ArtistAsideNav';
import ArtistArticleLeft from '@/views/artist/components/artist-article/ArtistArticleLeft';
import ArtistArticleRight from '@/views/artist/components/artist-article/ArtistArticleRight';

import ArtistNotifications from './components/artist-notifications/ArtistNotifications';

import tokenStore from '@/adf-connect/utils/token-store';
import ArtistArtworks from './components/artist-artworks/ArtistArtworks';
import MyArtworks from './components/artist-artworks/MyArtworks';
import ArtistInspirations from './components/artist-inspirations/ArtistInspirations';
import ArtistFavorites from './components/artist-favorites/ArtistFavorites';

import { customToast } from '@/utils/customToast';
import MobileArtistDetail from './mobile/MobileArtistDetail/MobileArtistDetail';
import Pencil from '@/components/ui/Icons/Pencil';
import ArtistSeed from './components/artist-seeding/ArtistSeed';

const GET_USER = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      id
      wallet
      nickname
      profileImgUrl
      coverImgUrl
      followingCount
      followerCount
      artworkCreatedCount
      artworkOwnedCount
      artworkCreatedAndOwnedCount
      postCount
      bookmarkArtworkCount
      bookmarkPostCount
      isPartner
      createdAt
      partner {
        partnerId
        artistName
        birth
        instagram
        facebook
        twitter
        youtube
        discord
        bio {
          intro
          artStyle
          representativeArtwork
          rememberAs
          recommendArtist
          futureActivities
        }
        philosophy {
          values
          consideration
          message
          goodArtwork
        }
      }
    }
  }
`;

const ArtistDetail = (props) => {
  const { artistId } = props;
  const router = useRouter();
  const { query } = router;

  const {
    common: { meState },
  } = stores;
  const [me, setMe] = useRecoilState(meState);

  // GET_USER
  const {
    loading: userDataLoading,
    data: userData,
    error,
  } = useQuery(GET_USER, {
    fetchPolicy: 'cache-and-network',
    variables: {
      userId: artistId,
    },
  });

  const { getUser } = userData || {};
  const { partner } = getUser || {};
  const { bio, philosophy } = partner || {};

  const {
    list = getUser?.isPartner ? 'artworks' : 'inspiration',
    tab = 'artworks',
  } = query;

  useEffect(() => {
    if (error && (error.message || '').includes('not found')) {
      router.replace('/');
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  const isMe = useMemo(() => {
    if (!me) {
      return false;
    }
    return artistId === me.id;
  }, [artistId, me]);

  const isPartner = useMemo(() => {
    if (isMe) {
      return me.isPartner;
    }
    if (userDataLoading) {
      return false;
    }
    return getUser?.isPartner;
  }, [isMe, userDataLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChangeMenu = (value) => {
    router.push(
      {
        pathname: `/artist/${artistId}`,
        query: { list: value },
      },
      undefined,
      { scroll: false, shallow: true }
    );
  };

  const handleChangeTab = (value) => {
    router.push(
      {
        pathname: `/artist/${artistId}`,
        query: { list, tab: value },
      },
      undefined,
      { scroll: false, shallow: true }
    );
  };

  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);

  const IMG_MAX_SIZE = 100_000_000;
  const handleFile = async (files) => {
    if (!files) return;

    const file = files[0];

    if (file.size > IMG_MAX_SIZE)
      return customToast({
        msg: <>File size should not exceed 100 MB.</>,
        autoClose: 2000,
        toastType: 'alert',
      });

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const accessToken = tokenStore.get('accessToken');

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/me/cover-img`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setMe({
        ...me,
        coverImgUrl: response?.data?.coverImgUrl,
      });
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
    }
  };

  return (
    <>
      <section className={styles.section}>
        <div
          className={classNames(styles.banner, {
            [styles.isSettingBanner]: isMe,
            [styles.defaultBanner]: getUser?.coverImgUrl,
          })}
        >
          {isMe ? (
            <Image
              src={
                isUploading
                  ? URL.createObjectURL(fileRef?.current?.files?.[0])
                  : me?.coverImgUrl
                  ? me?.coverImgUrl
                  : '/assets/images/component/default-banner.png'
              }
              fill={true}
              alt="cover"
              style={{ objectFit: 'cover' }}
              quality={100}
            />
          ) : getUser?.coverImgUrl ? (
            <Image
              src={getUser?.coverImgUrl}
              fill={true}
              alt="cover"
              style={{ objectFit: 'cover' }}
              quality={100}
            />
          ) : (
            <></>
          )}
          {isMe && (
            <button
              className={styles.edit}
              onClick={() => fileRef.current.click()}
              aria-label="create"
            >
              <Pencil color="#FFFFFF" />
            </button>
          )}
          <input
            type="file"
            style={{ display: 'none' }}
            accept="image/*"
            ref={fileRef}
            onChange={(e) => handleFile(e.target.files)}
          />
          {/* <button className={styles.backButton} onClick={() => router.back()}>
            <MobileBackChevron isWhite />
          </button> */}
        </div>
        <Container
          sx={{
            maxWidth: '1600px !important',
            '@media (max-width: 899px)': { display: 'none' },
          }}
        >
          <Grid spacing={3} container xs={12}>
            <Grid
              sx={{ marginTop: '-50px', zIndex: '1' }}
              xs={12}
              sm={12}
              md={isPartner ? 8 : 12}
            >
              <ArtistInfoCard
                isMe={isMe}
                isPartner={isPartner}
                data={getUser}
                userLoading={userDataLoading}
                userId={artistId}
              />
            </Grid>
            {isPartner && <ArtistSeed user={getUser || me} />}
          </Grid>

          <Grid sx={{ marginTop: '85px' }} spacing={3} container xs={12}>
            <Grid xs={12} sm={12} md={3}>
              <ArtistAsideNav
                menu={list}
                onClick={handleChangeMenu}
                isMe={isMe}
                isPartner={isPartner}
                nickname={getUser?.nickname}
              />
            </Grid>

            {list === 'short-bio' && isPartner && (
              <Grid container spacing={25} xs={12} md={9}>
                <Grid xs={12} sm={12} md={6}>
                  <ArtistArticleLeft article={bio} />
                </Grid>
                <Grid xs={12} sm={12} md={6}>
                  <ArtistArticleRight article={bio} />
                </Grid>
              </Grid>
            )}
            {list === 'philosophy' && isPartner && (
              <Grid container spacing={25} xs={12} md={9}>
                <Grid xs={12} sm={12} md={6}>
                  <ArtistArticleLeft article={philosophy} type="philosophy" />
                </Grid>
                <Grid xs={12} sm={12} md={6}>
                  <ArtistArticleRight article={philosophy} type="philosophy" />
                </Grid>
              </Grid>
            )}
            {list === 'artworks' &&
              isPartner &&
              (isMe ? (
                <MyArtworks artistId={artistId} />
              ) : (
                <ArtistArtworks artistId={artistId} />
              ))}
            {list === 'inspiration' && (
              <ArtistInspirations artistId={artistId} />
            )}

            {list === 'favorites' && (
              <ArtistFavorites
                user={getUser}
                tab={tab}
                artistId={artistId}
                handleChangeTab={handleChangeTab}
              />
            )}

            {list === 'notifications' && isMe && <ArtistNotifications />}
          </Grid>
        </Container>

        {/* Mobile */}
        <MobileArtistDetail
          isMe={isMe}
          isPartner={isPartner}
          data={getUser}
          artistId={artistId}
        />
      </section>
    </>
  );
};

export default ArtistDetail;
