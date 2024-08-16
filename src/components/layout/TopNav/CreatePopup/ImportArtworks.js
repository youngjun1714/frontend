import { useState } from 'react';
import styles from './ImportArtworks.module.scss';
import { gql, useQuery, useMutation } from '@apollo/client';

import { CircularProgress, Unstable_Grid2 as Grid, Modal } from '@mui/material';

import ImportArtworkCard from './ImportArtworkCard';
import { customToast } from '@/utils/customToast';
import { useRouter } from 'next/router';
import Search from '@/components/ui/Icons/Search';
import Close from '@/components/ui/Icons/Close';
import CloseCircle from '@/components/ui/Icons/CloseCircle';
import NoResult from '@/components/ui/Icons/NoResult';

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

function ImportArtworks(props) {
  const { onClose, open } = props;
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleChangeInput = (e) => {
    setSearch(e.target.value);
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

  const [pickedId, setPickedId] = useState(null);
  const handlePick = (value) => {
    setPickedId(value);
  };

  const [submit, { loading: createLoading }] = useMutation(IMPORT_ARTWORKS);
  const handleSubmit = async () => {
    try {
      await submit({ variables: { artworkIds: [pickedId] } });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      open={open}
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <div className={styles.box}>
        <div className={styles.nextHeader}>
          <div className={styles.searchBar}>
            <Search color={search && 'var(--artiside-neutral1)'} />
            <input
              value={search}
              onChange={handleChangeInput}
              placeholder="Search"
            />
            {search && (
              <button onClick={() => setSearch('')} aria-label="close">
                <CloseCircle />
              </button>
            )}
          </div>
          <button onClick={onClose} aria-label="close">
            <Close />
          </button>
        </div>

        <div className={styles.cardList}>
          <div
            className={
              !!artworks?.length
                ? styles.cardWrapper
                : `${styles.cardWrapper} ${styles.noArtworks}`
            }
          >
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
                <CircularProgress thickness={5} />
              </div>
            ) : (
              <Grid container spacing={1}>
                {!!artworks?.length ? (
                  artworks?.map((artwork) => (
                    <Grid key={artwork?.artworkId} xs={4}>
                      <ImportArtworkCard
                        data={artwork}
                        onClick={handlePick}
                        pickedId={pickedId}
                      />
                    </Grid>
                  ))
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 10,
                      color: 'var(--artiside-neutral2)',
                    }}
                  >
                    <NoResult />
                    <h1>No Artworks to Share</h1>
                  </div>
                )}
              </Grid>
            )}
          </div>
        </div>
        <div className={styles.buttonWrapper}>
          <button
            disabled={!pickedId}
            className={styles.shareButton}
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
      </div>
    </Modal>
  );
}

export default ImportArtworks;
