import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './MobileCommentsPost.module.scss';
import { useRecoilValue } from 'recoil';
import { gql, useMutation } from '@apollo/client';

import { TextareaAutosize } from '@mui/material';

import stores from '@/store';
import MobileBackChevron from '../MobileIcons/MobileBackChevron';
import MobileCommentPostRow from './MobileCommentPostRow';
import Avatar from '@/components/ui/Avatar/Avatar';
import MobileSendIcon from '../MobileIcons/MobileSendIcon';
import { customToast } from '@/utils/customToast';
import MobileNodataIcon from '../MobileIcons/MobileNodataIcon';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';

const COMMENT_POST = gql`
  mutation CommentPOST($postId: ID!, $input: CreatePostCommentInput!) {
    commentPost(postId: $postId, input: $input) {
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

function MobileCommentsPost(props) {
  const { comments, onClose, postId, pageInfo, fetchMore } = props;

  const handleMore = useCallback(() => {
    if (
      ((pageInfo || {}).currentPage + 1) * PAGE_SIZE <
      (pageInfo || {}).totalCount
    ) {
      // if more item exists
      fetchMore({
        variables: {
          currentPage: pageInfo.currentPage + 1,
        },
      });
    }
  }, [pageInfo, fetchMore]);

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const inputRef = useRef(null);
  const panelRef = useRef(null);

  // Write Comment
  const [comment, setComment] = useState('');

  // Reply
  const [parentId, setParentId] = useState('');

  const handleReply = (data) => {
    setParentId(data?.id);
    setComment(`@${data?.user?.nickname} `);
    inputRef.current.focus();
  };

  const handleReplySubmit = (data, parent) => {
    setParentId(parent);
    setComment(`@${data?.user?.nickname} `);
    inputRef.current.focus();
  };

  const COMMENT_MAX_LENGTH = 500;

  const handleInput = (e) => {
    if (e.target.value.length > COMMENT_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, COMMENT_MAX_LENGTH);
    }
    setComment(e.target.value);
  };

  const [submit, { loading: commentPostLoading }] = useMutation(COMMENT_POST, {
    refetchQueries: ['getPost'],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comment.trim() === '') {
        customToast({
          msg: <>Please input your comments</>,
          autoClose: 1000,
          toastType: 'error',
        });
        return;
      }

      await submit({
        variables: {
          postId,
          input: { parentCommentId: parentId || null, content: comment },
        },
        update: (cache, { data: { commentPost } }) => {
          const newCommentRef = cache.writeFragment({
            data: commentPost,
            fragment: gql`
              fragment NewComment on PostComment {
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
            `,
          });
          setComment('');
          setParentId('');
          if (!parentId) {
            const { getPostComments } = cache.readQuery({
              query: GET_POST_COMMENTS,
              variables: {
                postId,
                take: PAGE_SIZE,
              },
            });

            const newComments = {
              pageInfo: { ...getPostComments.pageInfo },
              comments: [commentPost, ...(getPostComments.comments || [])],
            };

            cache.writeQuery({
              query: GET_POST_COMMENTS,
              variables: {
                postId,
                take: PAGE_SIZE,
              },
              data: {
                getPostComments: newComments,
              },
            });
          } else {
            cache.modify({
              id: `PostComment:${parentId}`,
              fields: {
                childComments: (existing = []) => [newCommentRef, ...existing],
              },
            });
          }
        },
      });
      if (!parentId) {
        setTimeout(
          () =>
            panelRef.current.scrollTo({
              top: 0,
              behavior: 'smooth',
            }),
          0
        );
      }
    } catch (e) {
      customToast({
        toastType: 'error',
        msg: (
          <>
            Please sign in to perform this action and access the requested
            feature.
          </>
        ),
        autoClose: 3000,
      });
      console.error(e);
    }
  };

  const [numberOfLines, setNumberOfLines] = useState(1);

  const handleResize = () => {
    if (inputRef.current) {
      const lineHeight = parseInt(
        getComputedStyle(inputRef.current).lineHeight,
        10
      );
      const newNumberOfLines = Math.floor(
        inputRef.current.scrollHeight / lineHeight
      );
      setNumberOfLines(newNumberOfLines);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    handleResize();
  }, [comment]);

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <button onClick={onClose} aria-label="close">
          <MobileBackChevron />
        </button>
      </div>

      <article ref={panelRef}>
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <MobileCommentPostRow
              me={me}
              id={comment?.id}
              data={comment}
              key={comment?.id}
              onClick={handleReply}
              onReply={handleReplySubmit}
            />
          ))
        ) : (
          <h1 className={styles.nodata}>
            <button aria-label="no data">
              <MobileNodataIcon />
            </button>
            Be the first to comments
          </h1>
        )}
        {(comments || []).length < (pageInfo || {}).totalCount && (
          <button className={styles.moreButton} onClick={() => handleMore()}>
            + View more replies
          </button>
        )}
      </article>

      <div className={styles.commentInput}>
        <div style={{ alignSelf: numberOfLines > 1 ? 'flex-end' : 'center' }}>
          <Avatar type="md" username={me?.nickname} image={me?.profileImgUrl} />
        </div>
        <div
          className={styles.textarea}
          style={{
            transition: 300,
            border: comment
              ? '1px solid var(--artiside-neutral1)'
              : '1px solid var(--artiside-neutral5)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextareaAutosize
              ref={inputRef}
              placeholder={me ? 'Add a comment...' : 'You need to sign in'}
              minRows={1}
              maxRows={4}
              spellCheck={false}
              disabled={!me}
              value={comment}
              onChange={handleInput}
            />
          </form>
          <AuthRequiredButtonWrapper onClick={handleSubmit}>
            <button type="submit" aria-label="submit">
              <MobileSendIcon isWrite={!!comment} />
            </button>
          </AuthRequiredButtonWrapper>
        </div>
      </div>
    </section>
  );
}

export default MobileCommentsPost;
