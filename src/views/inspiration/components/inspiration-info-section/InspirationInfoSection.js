import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './InspirationInfoSection.module.scss';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRecoilValue } from 'recoil';
import moment from 'moment';
import { TextareaAutosize } from '@mui/material';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Menu,
} from '@mui/material';

import stores from '@/store';
import Avatar from '@/components/ui/Avatar/Avatar';
import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import FollowButton from '@/components/ui/Button/FollowButton';
import InspirationComment from '@/components/ui/Comment/InspirationComment';
import useBookmarkPost from '@/hooks/useBookmarkPost';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import Link from 'next/link';
import { customToast } from '@/utils/customToast';
import { useRouter } from 'next/router';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import shareArticle from '@/utils/shareArticle';
import BookmarkOutline from '@/components/ui/Icons/BookmarkOutline';
import MenuList from '@/components/ui/MenuList/MenuList';
import ReportIcon from '@/components/ui/Icons/ReportIcon';
import ClapOutline from '@/components/ui/Icons/ClapOutline';
import Share from '@/components/ui/Icons/Share';
import Links from '@/components/ui/Icons/Links';
import Dots from '@/components/ui/Icons/Dots';
import CommentFilled from '@/components/ui/Icons/CommentFilled';
import ViewFilled from '@/components/ui/Icons/ViewFilled';
import ClapFilled from '@/components/ui/Icons/ClapFilled';
import Verified from '@/components/ui/Icons/Verified';
import InputSend from '@/components/ui/Icons/InputSend';
import IsArtist from '@/components/ui/Icons/IsArtist';
import NoResult from '@/components/ui/Icons/NoResult';
import Delete from '@/components/ui/Icons/Delete';
import Edit from '@/components/ui/Icons/Edit';
import dynamic from 'next/dynamic';

const ArtworkReport = dynamic(() =>
  import('@/views/artwork/components/artwork-report/ArtworkReport')
);
const UpdatePopup = dynamic(() =>
  import('@/components/ui/Popup/UpdatePopup/UpdatePopup')
);
const DeleteModal = dynamic(() =>
  import('@/components/ui/ConfirmModal/DeleteModal')
);

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

// Mutation : create comment
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

const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const REPORT_POST = gql`
  mutation ReportPost($postId: ID!, $input: ReportPostInput) {
    reportPost(postId: $postId, input: $input) {
      id
      reason
      description
      createdAt
    }
  }
`;

const PAGE_SIZE = 5;

function InspirationInfoSection(props) {
  //open ConfirmModal
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  // data fetching
  const { data, postId, toggleLike, refetch, postRefetch, dataLoading } = props;
  const router = useRouter();

  // GET_POST_COMMENT
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

  const { images, tags, user } = data || {};
  const { comments, pageInfo } = getPostComments || {};

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

  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const [parentId, setParentId] = useState('');
  const [isReply, setIsReply] = useState(false);

  const [toggle, setToggle] = useState(data?.isLiked);
  useEffect(() => {
    setToggle(data?.isLiked);
  }, [data?.isLiked]);

  const handleReply = (data) => {
    setParentId(data.id);
    setComment(`@${data.user?.nickname} `);
    inputRef.current.focus();
  };

  const handleReplySubmit = (data, parent) => {
    setParentId(parent);
    setComment(`@${data.user?.nickname} `);
    inputRef.current.focus();
  };

  // Data Fetching : follow info
  const {
    loading: followListLoading,
    data: followListData,
    refetch: followListRefetch,
  } = useQuery(GET_FOLLOWING_STATUS, {
    variables: { userIds: [user?.id] },
  });
  const { getFollowingStatus } = followListData || {};
  const [followInfo] = getFollowingStatus || [];

  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    if (followInfo) {
      setIsFollow(followInfo.isFollowedByYou);
    }
  }, [followInfo]);
  const [follow, { loading: isFollowLoading }] = useFollowUser(user?.id);
  const handleFollow = async () => {
    try {
      await follow({ variables: { userId: user?.id } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  // // Unfollow
  const [unfollow, { loading: isUnfollowLoading }] = useUnfollowUser(user?.id);

  const handleUnfollow = async () => {
    try {
      await unfollow({ variables: { userId: user?.id } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  // for Mutation
  // report
  const [report, setReport] = useState('');
  const INPUT_MAX_LENGTH = 500;
  const handleInputReport = (e) => {
    if (e.target.value.length > INPUT_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, INPUT_MAX_LENGTH);
    }
    setReport(e.target.value);
  };

  const [reportPost, { loading: reportLoading, data: reportData }] =
    useMutation(REPORT_POST, {
      refetchQueries: ['getPosts', 'GetCurrentUser'],
    });

  const handleReport = async (value) => {
    try {
      await reportPost({
        variables: {
          postId: postId,
          input: {
            reason: value[0].description,
            description: report,
          },
        },
      });
      customToast({
        msg: <>Your report has been successfully submitted.</>,
        autoClose: 2000,
      });
      setShowReportModal(false);

      setTimeout(() => {
        router.push('/creation?tab=inspiration');
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  // bookmark
  const [bookmark, { loading: isBookmarkLoading }] = useBookmarkPost(data?.id);
  const handleBookmark = async () => {
    const { data } = await bookmark();
    const { bookmarkPost } = data;
    if (bookmarkPost.isBookmarked) {
      customToast({
        msg: <>Saved</>,
      });
    }
  };

  // comment
  const [submit, { loading: commentPostLoading }] = useMutation(COMMENT_POST, {
    refetchQueries: ['getPost'],
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (comment.trim() === '') {
        customToast({
          msg: <>please input your comments</>,
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
              fragment NewPostComment on PostComment {
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
      if (expanded !== 'panel2') {
        setExpanded('panel2');
      }
      setComment('');
      setParentId('');
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

  const [deletePost, { loading: deleteLoading }] = useMutation(DELETE_POST);
  const handleDeletePost = async () => {
    try {
      await deletePost({ variables: { postId } });
      customToast({
        msg: <>Deleted</>,
      });
      setTimeout(() => {
        router.push('/creation?tab=inspiration').then(() => {
          window.location.href = window.location.href;
        });
      }, 1000);
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  /** @param {import('react').SyntheticEvent} e */
  const handleKeyDown = (e) => {
    if (
      e.key === 'Enter' &&
      document.activeElement &&
      !e.nativeEvent.isComposing
    ) {
      handleSubmit(e);
    }
  };

  // accordion
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : 'panel1');
  };

  // open Menu(Mui)
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleShareMenuOpen = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareMenuClose = () => {
    setShareAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // open Modal
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const handleOpenReport = () => {
    if (
      me.lastReportAt &&
      moment(me.lastReportAt).add(24, 'hours').isAfter(moment.now())
    ) {
      customToast({
        toastType: 'error',
        msg: <>You can only report once a day</>,
        autoClose: 1000,
      });
      return;
    }

    handleClose();
    setShowReportModal(true);
  };

  // comment
  const [comment, setComment] = useState('');

  const COMMENT_MAX_LENGTH = 500;
  const handleInput = (e) => {
    if (e.target.value.length > COMMENT_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, COMMENT_MAX_LENGTH);
    }
    setComment(e.target.value);
  };

  return (
    <section className={styles.section}>
      <article className={styles.heading}>
        {dataLoading ? (
          <Skeleton width={260} height={42} />
        ) : (
          <h1>{data?.title}</h1>
        )}

        <div className={styles.countWrapper}>
          <AuthRequiredButtonWrapper onClick={toggleLike}>
            <button aria-label="like">
              <ClapFilled />
              {dataLoading ? (
                <Skeleton width={6} height={16} />
              ) : (
                <span>{Number(data?.likeCount).toLocaleString() || 0}</span>
              )}
            </button>
          </AuthRequiredButtonWrapper>
          <div>
            <ViewFilled />
            {dataLoading ? (
              <Skeleton width={6} height={16} />
            ) : (
              <span>{Number(data?.viewCount).toLocaleString() || 0}</span>
            )}
          </div>
        </div>
        <div className={styles.artist}>
          <div>
            <Link href={`/artist/${user?.id}?list=inspiration`}>
              {dataLoading ? (
                <Skeleton type="avatar" width={40} height={40} />
              ) : (
                <Avatar
                  username={user?.nickname}
                  image={user?.profileImgUrl}
                  type="md"
                />
              )}
              <div>
                {dataLoading ? (
                  <Skeleton width={140} height={20} />
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                    }}
                  >
                    <h1
                      style={{
                        display: 'flex',
                        gap: '5px',
                        alignItems: 'center',
                      }}
                    >
                      {user?.nickname} {user?.isPartner && <Verified />}
                    </h1>
                    {user?.isPartner && (
                      <p
                        style={{
                          color: 'var(--artiside-neutral2)',
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      >
                        @{user?.artistName}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Link>
            {me?.id !== user?.id && (
              <>
                <AuthRequiredButtonWrapper
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isFollow) {
                      handleFollow();
                    } else {
                      handleUnfollow();
                    }
                  }}
                >
                  <FollowButton
                    style={{ height: '28px', padding: '0 16px', fontSize: 14 }}
                    svgSize={16}
                    data={isFollow}
                  />
                </AuthRequiredButtonWrapper>
              </>
            )}
          </div>
          <div className={styles.buttons}>
            <AuthRequiredButtonWrapper
              onClick={() => {
                toggleLike();
              }}
            >
              <button
                className={
                  toggle
                    ? `${styles.isLiked} ${styles.hoverPrimary}`
                    : styles.hoverPrimary
                }
                aria-label="like"
              >
                {data?.isLiked ? (
                  <ClapOutline color="var(--primary-color)" />
                ) : (
                  <ClapOutline color="var(--artiside-neutral2)" />
                )}
              </button>
            </AuthRequiredButtonWrapper>
            <AuthRequiredButtonWrapper onClick={() => handleBookmark()}>
              <button
                className={
                  data?.isBookmarked
                    ? `${styles.hoverFavorite} ${styles.hoverFavoriteSelected}`
                    : styles.hoverFavorite
                }
                aria-label="bookmark"
              >
                <BookmarkOutline
                  fill={
                    data?.isBookmarked ? 'var(--artiside-neutral2)' : 'none'
                  }
                  color="var(--artiside-neutral2)"
                />
              </button>
            </AuthRequiredButtonWrapper>
            <button
              className={styles.hoverBlack}
              onClick={handleShareMenuOpen}
              aria-label="share"
            >
              <Share color="var(--artiside-neutral2)" />
            </button>
            {Boolean(shareAnchorEl) && (
              <Menu
                anchorEl={shareAnchorEl}
                open={true}
                onClose={handleShareMenuClose}
                sx={{
                  '& .MuiMenu-list': {
                    padding: 0,
                    borderRadius: '15px',
                  },
                }}
              >
                <div className={styles.dotMenu}>
                  <button
                    className={styles.dotMenuButton}
                    onClick={() => {
                      try {
                        handleShareMenuClose();
                        shareArticle(data?.id, 'inspiration');
                        customToast({
                          msg: <>Copied</>,
                        });
                      } catch (e) {
                        console.log(e);
                        customToast({
                          toastType: 'error',
                          msg: <>Error</>,
                        });
                      }
                    }}
                  >
                    <Links />
                    Copy Link
                  </button>
                </div>
              </Menu>
            )}
            <AuthRequiredButtonWrapper onClick={handleClick}>
              <button className={styles.hoverBlack} aria-label="more">
                <Dots color="var(--artiside-neutral2)" />
              </button>
            </AuthRequiredButtonWrapper>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            sx={{ borderRadius: '10px' }}
          >
            <div className={styles.buttonWrapper}>
              {me?.id === user?.id ? (
                <>
                  <div
                    className={styles.menuList}
                    onClick={() => {
                      handleClose();
                      setShowUpdateModal(true);
                    }}
                  >
                    <MenuList icon={<Edit />} text="Edit" />
                  </div>
                  <div
                    className={styles.menuList}
                    onClick={() => setOpenConfirm(true)}
                  >
                    <MenuList icon={<Delete />} text="Delete" />
                  </div>
                  {openConfirm && (
                    <DeleteModal
                      open={openConfirm}
                      title="Are you sure?"
                      confirm="Delete"
                      onConfirm={handleDeletePost}
                      cancel="Cancel"
                      onCancel={handleConfirmClose}
                      onClick={() => setOpenConfirm(false)}
                    />
                  )}
                </>
              ) : (
                <div
                  className={styles.menuList}
                  onClick={() => handleOpenReport()}
                >
                  <MenuList icon={<ReportIcon />} text="Report" />
                </div>
              )}
            </div>
          </Menu>
          {showReportModal && (
            <ArtworkReport
              onClick={handleReport}
              onClose={() => setShowReportModal(false)}
              report={report}
              onHandleInput={handleInputReport}
              open={true}
            />
          )}
          {showUpdateModal && (
            <UpdatePopup
              onClose={() => setShowUpdateModal(false)}
              data={data}
              refetch={postRefetch}
              open={true}
            />
          )}
        </div>
        <div
          className={styles.aboutArtwork}
          style={{
            height: 468,
            overflow: 'hidden',
            backgroundColor: 'rgba(248, 250, 252, 1)',
          }}
        >
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              sx={{
                backgroundColor: 'rgba(248, 250, 252, 1)',
                cursor: 'default !important',
                marginBottom: '10px !important',
                borderBottom: '1px solid var(--artiside-neutral5)',
              }}
            >
              <div className={styles.descriptionWrapper}>
                {dataLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <Skeleton width="100%" height={16} />
                  </div>
                ) : (
                  <>
                    <Avatar
                      username={user?.nickname}
                      image={user?.profileImgUrl}
                      type="sm"
                    />
                    <div className={styles.description}>
                      <p>
                        <b>
                          {user?.nickname}&nbsp;
                          {user?.isPartner && <IsArtist />}&nbsp;
                        </b>
                        {data?.description.length
                          ? data?.description
                          : data?.title}
                      </p>
                      <p>{moment(data?.createdAt).fromNowOrNow()}</p>
                    </div>
                  </>
                )}
              </div>
            </AccordionSummary>
          </Accordion>
          {comments?.length > 0 && (
            <Accordion
              expanded={expanded === 'panel2'}
              onChange={handleChange('panel2')}
              sx={{
                marginBottom: '24px !important',
                '&:before': { opacity: '0' },
                overflow: 'auto',
              }}
            >
              <AccordionSummary
                sx={{
                  backgroundColor: 'rgba(248, 250, 252, 1)',
                  minHeight: 'unset !important',
                }}
              >
                <button className={styles.arrowButton}>
                  <CommentFilled />
                  <span>{data?.commentCount || 0} comments</span>
                  <ArrowIcon
                    direction={expanded === 'panel2' ? 'up' : 'down'}
                  />
                </button>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: 'rgba(248, 250, 252, 1)',
                }}
              >
                <div className={styles.commentPanel} ref={panelRef}>
                  {comments?.map((item) => (
                    <InspirationComment
                      key={item.id}
                      data={item}
                      onClick={handleReply}
                      onReply={handleReplySubmit}
                    />
                  ))}
                  {(comments || []).length < (pageInfo || {}).totalCount && (
                    <button
                      type="button"
                      className={styles.loadButton}
                      onClick={() => handleMore()}
                      disabled={commentLoading}
                    >
                      + View more replies
                    </button>
                  )}
                  {!comments?.length && (
                    <div className={styles.noItem}>
                      <NoResult />
                      No comments
                    </div>
                  )}
                </div>
              </AccordionDetails>
            </Accordion>
          )}
        </div>
        <div
          className={styles.inputWrapper}
          style={{ alignItems: comment ? 'flex-start' : 'center' }}
        >
          {/* Todo : username={global state current username} */}
          <Avatar username={me?.nickname} image={me?.profileImgUrl} type="md" />
          <AuthRequiredButtonWrapper onClick={() => {}}>
            <form onSubmit={handleSubmit}>
              <div
                className={
                  comment ? styles.input : `${styles.input} ${styles.downsize}`
                }
              >
                <TextareaAutosize
                  minRows={1}
                  maxRows={4}
                  value={comment}
                  onChange={handleInput}
                  placeholder="Add a Comment..."
                  spellCheck={false}
                  ref={inputRef}
                  required={true}
                  onKeyDown={handleKeyDown}
                  disabled={!me}
                />
                <div className={styles.interactionWrapper}>
                  {comment && (
                    <p className={styles.commentLength}>{comment.length}/500</p>
                  )}
                  <button
                    type="submit"
                    // onClick={handleSubmit}
                    aria-label="send"
                    className={comment ? styles.on : ''}
                    disabled={commentPostLoading}
                  >
                    <InputSend
                      color={
                        comment && comment.length <= COMMENT_MAX_LENGTH
                          ? '#FFFFFF'
                          : '#CED3D8'
                      }
                    />
                  </button>
                </div>
              </div>
            </form>
          </AuthRequiredButtonWrapper>
        </div>
      </article>
    </section>
  );
}

export default InspirationInfoSection;
