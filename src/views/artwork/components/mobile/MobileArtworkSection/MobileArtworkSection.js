import { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import styles from './MobileArtworkSection.module.scss';
import { useRouter } from 'next/router';

import MobileArtworkInteraction from '../MobileArtworkInteraction/MobileArtworkInteraction';
import MobileAboutArtwork from '../MobileAboutArtwork/MobileAboutArtwork';
import MobileComments from '@/components/mobile-ui/MobileComments/MobileComments';
import dynamic from 'next/dynamic';

const Drawer = dynamic(() => import('@mui/material/Drawer'));

const GET_ARTWORK_COMMENTS = gql`
  query getArtworkComments($artworkId: ID!, $currentPage: Int, $take: Int) {
    getArtworkComments(
      artworkId: $artworkId
      currentPage: $currentPage
      take: $take
    ) {
      pageInfo {
        totalCount
        take
        currentPage
      }
      comments {
        id
        user {
          id
          wallet
          nickname
          profileImgUrl
          coverImgUrl
          isPartner
        }
        content
        likeCount
        hasChild
        isLiked
        isReported
        createdAt
        updatedAt
        childComments {
          id
          user {
            id
            wallet
            nickname
            profileImgUrl
            isPartner
          }
          content
          likeCount
          isLiked
          isReported
          createdAt
          updatedAt
        }
      }
    }
  }
`;

// Mutation
const COMMENT_ARTWORK = gql`
  mutation CommentArtwork($artworkId: ID!, $input: CreateArtworkCommentInput!) {
    commentArtwork(artworkId: $artworkId, input: $input) {
      id
      user {
        id
        wallet
        nickname
        profileImgUrl
        coverImgUrl
        isPartner
      }
      content
      likeCount
      hasChild
      isLiked
      isReported
      createdAt
      updatedAt
      childComments {
        id
        user {
          id
          wallet
          nickname
          profileImgUrl
          isPartner
        }
        content
        likeCount
        isLiked
        isReported
        createdAt
        updatedAt
      }
    }
  }
`;

const PAGE_SIZE = 5;

const MobileArtworkSection = (props) => {
  const {
    likeCount,
    viewCount,
    artworkId,
    createdAt,
    text,
    commentCount,
    isBookmarked,
  } = props;

  const router = useRouter();

  const handleOpen = () => {
    setCommentOpen(true);
    router.push({
      pathname: `/artwork/${artworkId}`,
      query: { commentOpen: true },
    });
  };

  const { query } = router;

  const [commentOpen, setCommentOpen] = useState(false);
  useEffect(() => {
    setCommentOpen(!!query.commentOpen);
  }, [query]);

  const [
    fetchComments,
    { loading: commentLoading, data: commentsData, fetchMore },
  ] = useLazyQuery(GET_ARTWORK_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (artworkId) {
      fetchComments({
        variables: {
          artworkId,
          take: PAGE_SIZE,
        },
      });
    }
  }, [artworkId]);

  const { getArtworkComments } = commentsData || {};
  const { comments, pageInfo } = getArtworkComments || {};

  return (
    <section className={styles.section}>
      <MobileArtworkInteraction
        artworkId={artworkId}
        likeCount={likeCount}
        viewCount={viewCount}
        onCommentOpen={handleOpen}
        isBookmarked={isBookmarked}
      />
      <MobileAboutArtwork
        artworkId={artworkId}
        createdAt={createdAt}
        text={text}
        onCommentOpen={handleOpen}
        commentCount={commentCount}
      />
      {commentOpen && (
        <Drawer
          sx={{
            backdropFilter: 'blur(6px)',
            '@media (min-width: 481px)': {
              display: 'none',
            },
            '&': {
              zIndex: 1560,
            },
            '& > .MuiPaper-root': {
              backgroundColor: 'transparent',
            },
          }}
          transitionDuration={200}
          anchor="bottom"
          open={commentOpen}
          onClose={() => {
            setCommentOpen(false);
            router.back({ shallow: true });
          }}
        >
          <MobileComments
            artworkId={artworkId}
            comments={comments}
            onClose={() => {
              setCommentOpen(false);
              router.back({ shallow: true });
            }}
            commentCount={commentCount}
            pageInfo={pageInfo}
            fetchMore={fetchMore}
          />
        </Drawer>
      )}
    </section>
  );
};

export default MobileArtworkSection;
