import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from './MobileImportArtwork.module.scss';
import { gql, useQuery, useMutation } from '@apollo/client';

import MobileBackChevron from '../MobileIcons/MobileBackChevron';
import MobileSearchIcon from '../MobileIcons/MobileSearchIcon';

import {
  CircularProgress,
  Unstable_Grid2 as Grid,
  Dialog,
} from '@mui/material';

import MobileNodataIcon from '../MobileIcons/MobileNodataIcon';
import MobilePickedIcon from '../MobileIcons/MobilePickedIcon';
import { customToast } from '@/utils/customToast';
import MobileInputClearIcon from '../MobileIcons/MobileInputClearIcon';
import Media from '@/components/ui/Media/Media';

const GET_CREATED_ARTWORKS = gql`
  query getCreatedArtworks($q: String, $currentPage: Int, $take: Int) {
    getCreatedArtworks(q: $q, currentPage: $currentPage, take: $take) {
      pageInfo {
        totalCount
      }
      artworks {
        artworkId
        name
        tokenId
        bondStatus
        artworkUrl
        mediaType
        likeCount
        viewCount
      }
    }
  }
`;

const IMPORT_ARTWORKS = gql`
  mutation importArtworks($artworkIds: [ID!]!) {
    importArtworks(artworkIds: $artworkIds) {
      artworkId
      name
      tokenId
      bondStatus
      likeCount
      viewCount
      favoriteCount
      commentCount
      artworkUrl
      mediaType
      artworkInfo {
        title
        creationYear
        edition
        medium
        width
        height
        about
      }
      createdAt
      creator {
        id
        wallet
        nickname
        profileImgUrl
        coverImgUrl
        isPartner
        artistName
      }
    }
  }
`;

const MobileImportArtwork = (props) => {
  const { open, onClose, onCloseAll } = props;
  const router = useRouter();

  // page
  const [isSearch, setIsSearch] = useState(false);

  // search input
  const [search, setSearch] = useState('');
  const handleChangeInput = (e) => {
    setSearch(e.target.value);
  };

  const [pickedId, setPickedId] = useState(null);
  const handlePick = (value) => {
    setPickedId(value);
  };

  const [submit, { loading: createLoading }] = useMutation(IMPORT_ARTWORKS, {
    refetchQueries: ['getArtworks'],
  });
  const handleSubmit = async () => {
    try {
      await submit({ variables: { artworkIds: [pickedId] } });
    } catch (e) {
      console.log(e);
    }
  };

  const { loading: artworksLoading, data: artworksData } = useQuery(
    GET_CREATED_ARTWORKS,
    {
      variables: {
        q: search,
        take: 99999, // TODO pagination if need
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );
  const { getCreatedArtworks } = artworksData || {};
  const { artworks } = getCreatedArtworks || {};

  const [isFocus, setIsFocus] = useState(false);

  const inputRef = useRef(null);

  return (
    <Dialog
      open={open}
      sx={{
        zIndex: 1500,
        transition: '300ms',
        '@media (min-width: 1023px)': { display: 'none' },
      }}
      fullScreen
    >
      {isSearch ? (
        <section className={styles.section}>
          <div className={styles.header}>
            <button
              className={styles.back}
              onClick={() => {
                setIsSearch(false);
                setSearch('');
              }}
              aria-label="back"
            >
              <MobileBackChevron />
            </button>
            <h1>Create</h1>
            <button
              className={styles.submit}
              disabled={!pickedId}
              onClick={(e) => {
                {
                  if (pickedId) {
                    handleSubmit();
                    customToast({
                      msg: <>Your Artwork has been successfully uploaded</>,
                      autoClose: 2000,
                    });
                    router.push(`/artwork/${pickedId}`);
                    onClose();
                    onCloseAll();
                  } else {
                    e.preventDefault();
                    customToast({
                      msg: <>Artwork Import Failed</>,
                      autoClose: 1000,
                      toastType: 'error',
                    });
                  }
                }
              }}
            >
              Share
            </button>
          </div>

          <div className={styles.searchSection}>
            <div
              className={styles.searchBar}
              style={{
                border: isFocus
                  ? '1px solid var(--artiside-neutral1)'
                  : '1px solid var(--artiside-neutral5)',
              }}
            >
              <div className={styles.icon}>
                <MobileSearchIcon />
              </div>
              <div className={styles.input}>
                <input
                  placeholder="Search"
                  value={search}
                  onChange={handleChangeInput}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  ref={inputRef}
                />
              </div>
              {search && (
                <button
                  className={styles.clear}
                  onClick={() => {
                    setSearch('');
                    inputRef.current.focus();
                  }}
                  aria-label="clear"
                >
                  <MobileInputClearIcon />
                </button>
              )}
            </div>
          </div>

          <section className={styles.container}>
            {artworksLoading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >
                <CircularProgress
                  thickness={5}
                  sx={{ color: 'var(--artiside-neutral3) !important' }}
                />
              </div>
            ) : artworks.length > 0 ? (
              <article className={styles.searchArticle}>
                {artworks?.map((artwork) => (
                  <Card
                    key={artwork?.artworkId}
                    artworkId={artwork?.artworkId}
                    onClick={handlePick}
                    imageUrl={artwork?.artworkUrl}
                    mediaType={artwork?.mediaType}
                    pickedId={pickedId}
                  />
                ))}
              </article>
            ) : (
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'var(--artiside-neutral2)',
                }}
              >
                <MobileNodataIcon />
                <h1 style={{ fontWeight: 600 }}>No Results found</h1>
              </div>
            )}
          </section>
        </section>
      ) : (
        <section className={styles.section}>
          <div className={styles.header}>
            <button
              className={styles.back}
              onClick={() => {
                onClose();
                setIsSearch(false);
                setPickedId(null);
              }}
              aria-label="back"
            >
              <MobileBackChevron />
            </button>
            <h1>Create</h1>
            <button
              className={styles.submit}
              disabled={!pickedId}
              onClick={(e) => {
                {
                  if (pickedId) {
                    handleSubmit();
                    customToast({
                      msg: <>Your Artwork has been successfully uploaded</>,
                      autoClose: 2000,
                    });
                    router.push(`/artwork/${pickedId}`);
                    onClose();
                    onCloseAll();
                  } else {
                    e.preventDefault();
                    customToast({
                      msg: <>Artwork Import Failed</>,
                      autoClose: 1000,
                      toastType: 'error',
                    });
                  }
                }
              }}
            >
              Share
            </button>
          </div>

          <article className={styles.article}>
            <div
              className={styles.searchButton}
              onClick={() => setIsSearch(true)}
            >
              <MobileSearchIcon color="var(--artiside-neutral2)" />
              <p>Search</p>
            </div>
            {artworks?.map((artwork) => (
              <Card
                key={artwork?.artworkId}
                artworkId={artwork?.artworkId}
                imageUrl={artwork?.artworkUrl}
                mediaType={artwork?.mediaType}
                onClick={handlePick}
                pickedId={pickedId}
                title={artwork?.name}
              />
            ))}
          </article>
          {artworks?.length === 0 && (
            <div className={styles.nodata}>
              <span>
                <MobileNodataIcon />
              </span>
              No Artworks to Share
            </div>
          )}
        </section>
      )}
    </Dialog>
  );
};

const Card = (props) => {
  const { artworkId, imageUrl, mediaType, pickedId, onClick, title } = props;

  return (
    <div
      className={
        artworkId === pickedId ? `${styles.card} ${styles.pick}` : styles.card
      }
      onClick={() => onClick(artworkId)}
    >
      <Media
        url={imageUrl}
        mediaType={mediaType}
        objectFit="cover"
        alt={imageUrl}
      />

      {artworkId === pickedId && (
        <div className={styles.pickIcon}>
          <MobilePickedIcon />
        </div>
      )}
      {artworkId === pickedId && <p className={styles.cardTitle}>{title}</p>}
    </div>
  );
};

export default MobileImportArtwork;
