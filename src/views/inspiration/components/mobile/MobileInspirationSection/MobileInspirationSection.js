import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import styles from './MobileInspirationSection.module.scss';
import { useRouter } from 'next/router';

import MobileInspirationInteraction from '../MobileInspirationInteraction/MobileInspirationInteraction';
import MobileAboutInspiration from '../MobileAboutInspiration/MobileAboutInspiration';
import MobileCommentsPost from '@/components/mobile-ui/MobileCommentsPost/MobileCommentsPost';
import dynamic from 'next/dynamic';

const Drawer = dynamic(() => import('@mui/material/Drawer'));

const GET_POST_COMMENTS = gql`
  query getPostComments($postId: ID!, $currentPage: Int, $take: Int) {
    getPostComments(postId: $postId, currentPage: $currentPage, take: $take) {
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

const PAGE_SIZE = 5;

const MobileInspirationSection = (props) => {
  const {
    likeCount,
    viewCount,
    toggleLike,
    postId,
    createdAt,
    text,
    title,
    author,
    commentCount,
    isLiked,
    isBookmarked,
  } = props;

  const router = useRouter();

  const handleOpen = () => {
    setCommentOpen(true);
    router.push({
      pathname: `/inspiration/${postId}`,
      query: { commentOpen: true },
    });
  };

  const { query } = router;

  const [commentOpen, setCommentOpen] = useState(false);
  useEffect(() => {
    setCommentOpen(!!query.commentOpen);
  }, [query]);

  const {
    loading: commentLoading,
    data: commentsData,
    fetchMore,
  } = useQuery(GET_POST_COMMENTS, {
    variables: {
      postId,
      take: PAGE_SIZE,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });
  const { getPostComments } = commentsData || {};
  const { comments, pageInfo } = getPostComments || {};

  return (
    <section className={styles.section}>
      <MobileInspirationInteraction
        postId={postId}
        likeCount={likeCount}
        viewCount={viewCount}
        toggleLike={toggleLike}
        onCommentOpen={handleOpen}
        isBookmarked={isBookmarked}
        isLiked={isLiked}
      />
      <MobileAboutInspiration
        postId={postId}
        createdAt={createdAt}
        title={title}
        text={text}
        pageInfo={pageInfo}
        author={author}
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
              zIndex: 1500,
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
          <MobileCommentsPost
            postId={postId}
            comments={comments}
            onClose={() => {
              setCommentOpen(false);
              router.back({ shallow: true });
            }}
            pageInfo={pageInfo}
            fetchMore={fetchMore}
          />
        </Drawer>
      )}
    </section>
  );
};

export default MobileInspirationSection;
