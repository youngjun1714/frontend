import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from '@/views/artwork/components/artwork-info-section/ArtworkInfoSection.module.scss';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useRecoilValue } from 'recoil';
import { TextareaAutosize, Tooltip } from '@mui/material';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  Menu,
  Modal,
} from '@mui/material';

import stores from '@/store';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import useBookmarkArtwork from '@/hooks/useBookmarkArtwork';
import Avatar from '@/components/ui/Avatar/Avatar';
import Button from '@/components/ui/Button/Button';

import ArrowIcon from '@/components/ui/Icons/ArrowIcon';
import FollowButton from '@/components/ui/Button/FollowButton';
import Comment from '@/components/ui/Comment/Comment';
import Link from 'next/link';
import { customToast } from '@/utils/customToast';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import shareArticle from '@/utils/shareArticle';
import moment from 'moment';
import BoostSuccessModal from './BoostSuccessModal';
import BookmarkOutline from '@/components/ui/Icons/BookmarkOutline';
import InfoCircle from '@/components/ui/Icons/InfoCircle';
import AboutRedLabel from '@/components/tooltip/AboutRedLabel/AboutRedLabel';
import ClapOutline from '@/components/ui/Icons/ClapOutline';
import ViewOutline from '@/components/ui/Icons/ViewOutline';
import Share from '@/components/ui/Icons/Share';
import Links from '@/components/ui/Icons/Links';
import Dots from '@/components/ui/Icons/Dots';
import Power from '@/components/ui/Icons/Power';
import UnView from '@/components/ui/Icons/UnView';
import CommentFilled from '@/components/ui/Icons/CommentFilled';
import ViewFilled from '@/components/ui/Icons/ViewFilled';
import ClapFilled from '@/components/ui/Icons/ClapFilled';
import Verified from '@/components/ui/Icons/Verified';
import InputSend from '@/components/ui/Icons/InputSend';
import NoResult from '@/components/ui/Icons/NoResult';
import QuestionFill from '@/components/ui/Icons/QuestionFill';
import Boosted from '@/components/ui/Icons/Boosted';

const BoostButtonWithHelper = (props) => {
  const { artwork, handleClick } = props;

  if (artwork.boostedCount >= 5) {
    return (
      <button className={styles.dotMenuButton} disabled={true}>
        <Power color="var(--artiside-neutral2)" />
        <Tooltip
          placement="top"
          arrow
          title={
            <>
              Boost older (Up to 3 days) art to top of recent list.
              <br />
              Max 5 boosts every 72h
            </>
          }
        >
          <span>
            Boost
            <QuestionFill color="#BBC1C7" />
          </span>
        </Tooltip>
        <div className={styles.buttonWarnText}>
          You have used all of your available Boosts.
        </div>
      </button>
    );
  }

  const nextAvailableAt = moment(
    artwork.lastBoostedAt || artwork.importedAt
  ).add(72, 'hours');

  if (!nextAvailableAt.isValid() || nextAvailableAt.isAfter(moment.now())) {
    const remainHours = nextAvailableAt.diff(moment.now(), 'hours') + 1;
    return (
      <button className={styles.dotMenuButton} disabled={true}>
        <Power color="var(--artiside-neutral2)" />
        <div className={styles.boostButton}>
          <div>
            <span>Boost</span>
            <Tooltip
              placement="top"
              arrow
              title={
                <>
                  Boost older (Up to 3 days) art to top of recent list.
                  <br />
                  Max 5 boosts every 72h
                </>
              }
            >
              <span>
                <QuestionFill color="#BBC1C7" />
              </span>
            </Tooltip>
          </div>
          <div
            className={styles.buttonHelpText}
            style={{ color: 'var(--artiside-neutral2)' }}
          >
            Available in <span>{isNaN(remainHours) ? '72' : remainHours}</span>{' '}
            hours
          </div>
        </div>
      </button>
    );
  }

  return (
    <button className={styles.dotMenuButton} onClick={handleClick}>
      <Power />
      <div>
        <Tooltip
          placement="top"
          arrow
          title={
            <>
              Boost older (Up to 3 days) art to top of recent list.
              <br />
              Max 5 boosts every 72h
            </>
          }
        >
          <span>
            Boost
            <QuestionFill color="#BBC1C7" />
          </span>
        </Tooltip>
        {artwork.boostedCount > 0 && (
          <div className={styles.buttonHelpText}>
            Number of Boosts used : <span>{artwork.boostedCount}</span>
          </div>
        )}
      </div>
    </button>
  );
};

// artwork comments
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

const BOOST_ARTWORK = gql`
  mutation BoostArtwork($artworkId: ID!) {
    boostArtwork(artworkId: $artworkId) {
      artworkId
      lastBoostedAt
      boostedCount
    }
  }
`;

const SHOW_ARTWORK = gql`
  mutation ShowArtwork($artworkId: ID!) {
    showArtwork(artworkId: $artworkId) {
      artworkId
      isArtisideVisible
      artisideHiddenAt
    }
  }
`;

const HIDE_ARTWORK = gql`
  mutation HideArtwork($artworkId: ID!) {
    hideArtwork(artworkId: $artworkId) {
      artworkId
      isArtisideVisible
      artisideHiddenAt
    }
  }
`;

// GET_FOLLOWING_STATUS
const GET_FOLLOWING_STATUS = gql`
  query getFollowingStatus($userIds: [ID!]!) {
    getFollowingStatus(userIds: $userIds) {
      userId
      isFollowingYou
      isFollowedByYou
    }
  }
`;

const PAGE_SIZE = 5;

function ArtworkInfoSection(props) {
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  // data fetching
  const { data, toggleLike, dataLoading } = props;
  const { artworkInfo, creator, owner, artworkId } = data || {};

  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const [parentId, setParentId] = useState('');

  const [toggle, setToggle] = useState(data?.isLiked);
  useEffect(() => {
    setToggle(data?.isLiked);
  }, [data?.isLiked]);

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

  // Data Fetching : follow info
  const [
    updateFollowingStatus,
    {
      loading: followListLoading,
      data: followListData,
      refetch: followListRefetch,
    },
  ] = useLazyQuery(GET_FOLLOWING_STATUS);

  // GET_ARTWORK_COMMENTS
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

  const { getFollowingStatus } = followListData || {};
  const [followInfo] = getFollowingStatus || [];

  const [isFollow, setIsFollow] = useState(false);

  // isReadyData (FollowStatus)
  useEffect(() => {
    if (creator) {
      updateFollowingStatus({
        variables: {
          userIds: [creator.id],
        },
      });
    }
  }, [creator]);

  // update (FollowState)
  useEffect(() => {
    if (followInfo) {
      setIsFollow(followInfo.isFollowedByYou);
    }
  }, [followInfo]);

  // for Mutation
  // Follow
  const [follow, { loading: isFollowLoading }] = useFollowUser(creator?.id);
  const handleFollow = async () => {
    try {
      await follow({ variables: { userId: creator?.id } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  // // Unfollow
  const [unfollow, { loading: isUnfollowLoading }] = useUnfollowUser(
    creator?.id
  );
  const handleUnfollow = async () => {
    try {
      await unfollow({ variables: { userId: creator?.id } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  // Bookmark
  const [bookmark, { loading: isBookmarkLoading }] =
    useBookmarkArtwork(artworkId);
  const handleBookmark = async () => {
    const { data } = await bookmark();
    const { bookmarkArtwork } = data;
    if (bookmarkArtwork.isBookmarked) {
      customToast({
        msg: <>Saved</>,
      });
    }
  };

  // Comment
  const [submit, { loading: commentArtworkLoading }] =
    useMutation(COMMENT_ARTWORK);

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
          artworkId,
          input: { parentCommentId: parentId || null, content: comment },
        },
        update: (cache, { data: { commentArtwork } }) => {
          const newCommentRef = cache.writeFragment({
            data: commentArtwork,
            fragment: gql`
              fragment NewComment on ArtworkComment {
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
            const { getArtworkComments } = cache.readQuery({
              query: GET_ARTWORK_COMMENTS,
              variables: {
                artworkId,
                take: PAGE_SIZE,
              },
            });

            const newComments = {
              pageInfo: { ...getArtworkComments.pageInfo },
              comments: [
                commentArtwork,
                ...(getArtworkComments.comments || []),
              ],
            };

            cache.writeQuery({
              query: GET_ARTWORK_COMMENTS,
              variables: {
                artworkId,
                take: PAGE_SIZE,
              },
              data: {
                getArtworkComments: newComments,
              },
            });
          } else {
            cache.modify({
              id: `ArtworkComment:${parentId}`,
              fields: {
                childComments: (existing = []) => [newCommentRef, ...existing],
              },
            });
          }

          cache.updateFragment(
            {
              id: cache.identify(data),
              fragment: gql`
                fragment CommentCountOnArtwork on Artwork {
                  commentCount
                }
              `,
            },
            (data) => ({ ...data, commentCount: data.commentCount + 1 })
          );
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

  // Boost
  const [boostSubmit] = useMutation(BOOST_ARTWORK, {
    variables: {
      artworkId: data?.artworkId,
    },
    update(cache) {
      cache.modify({
        fields: {
          getArtworks() {
            return [];
          },
        },
      });
    },
  });

  // accordion
  const [expanded, setExpanded] = useState('panel1');

  const handleChange = (panel) => () => {
    setExpanded((prevExpanded) => {
      if (prevExpanded === panel) {
        return panel === 'panel1' ? 'panel2' : 'panel1';
      } else {
        return panel;
      }
    });
  };

  // open Menu(Mui)
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareAnchorEl, setShareAnchorEl] = useState(null);
  const [isOpenBoostModal, setIsOpenBoostModal] = useState(false);

  const handleShareMenuOpen = (event) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareMenuClose = () => {
    setShareAnchorEl(null);
  };

  const handleDotMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDotMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBoost = () => {
    setAnchorEl(null);
    boostSubmit();
    setIsOpenBoostModal(true);
    customToast({
      msg: <>Boosted!</>,
    });
  };

  const [showArtwork] = useMutation(SHOW_ARTWORK, {
    variables: {
      artworkId: data?.artworkId,
    },
    refetchQueries: ['getArtworks'],
  });

  const [hideArtwork] = useMutation(HIDE_ARTWORK, {
    variables: {
      artworkId: data?.artworkId,
    },
    refetchQueries: ['getArtworks'],
  });

  const handleShow = () => {
    setAnchorEl(null);
    showArtwork();
  };

  const handleHide = () => {
    setAnchorEl(null);
    hideArtwork();
    customToast({
      msg: <>Hidden</>,
    });
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
          <h1>{artworkInfo?.title}</h1>
        )}
        <div className={styles.countWrapper}>
          <button onClick={toggleLike} aria-label="like">
            <ClapFilled />
            {dataLoading ? (
              <Skeleton width={6} height={16} />
            ) : (
              <span>{Number(data?.likeCount).toLocaleString()}</span>
            )}
          </button>
          <div>
            <ViewFilled />
            {dataLoading ? (
              <Skeleton width={6} height={16} />
            ) : (
              <span>{Number(data?.viewCount).toLocaleString()}</span>
            )}
          </div>
          {/* <div>
            <Boosted />
            {dataLoading ? (
              <Skeleton width={6} height={16} />
            ) : (
              <span>{Number(data?.boostedCount).toLocaleString()}</span>
            )}
          </div> */}
        </div>
        <div className={styles.artist}>
          <div>
            {dataLoading ? (
              <Skeleton type="avatar" width={40} height={40} />
            ) : (
              <Avatar
                username={creator?.nickname}
                image={creator?.profileImgUrl}
                type="md"
              />
            )}
            <div>
              <Link
                href={`/artist/${creator?.id}?list=artworks`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {dataLoading ? (
                  <Skeleton width={140} height={20} />
                ) : (
                  <h1
                    style={{
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                    }}
                  >
                    {creator?.nickname} {creator?.isPartner && <Verified />}
                  </h1>
                )}
                {dataLoading ? (
                  <Skeleton width={100} height={12} />
                ) : (
                  <p>@{creator?.artistName}</p>
                )}
              </Link>
            </div>
            {creator?.id === me?.id ? (
              <></>
            ) : (
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
              <Share
                color={
                  shareAnchorEl
                    ? 'var(--artiside-neutral1)'
                    : 'var(--artiside-neutral2)'
                }
              />
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
                        handleDotMenuClose();
                        shareArticle(data?.artworkId, 'artwork');
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
            {me?.id === creator?.id && me?.id === owner?.id && (
              <AuthRequiredButtonWrapper onClick={handleDotMenuOpen}>
                <button className={styles.hoverBlack} aria-label="more">
                  <Dots
                    color={
                      anchorEl
                        ? 'var(--artiside-neutral1)'
                        : 'var(--artiside-neutral2)'
                    }
                  />
                </button>
              </AuthRequiredButtonWrapper>
            )}
            {Boolean(anchorEl) && (
              <Menu
                anchorEl={anchorEl}
                open={true}
                onClose={handleDotMenuClose}
                sx={{
                  '& .MuiMenu-list': {
                    padding: 0,
                    borderRadius: '15px',
                  },
                }}
              >
                <div className={styles.dotMenu}>
                  {data?.isArtisideVisible ? (
                    <>
                      {/* <BoostButtonWithHelper
                        artwork={data}
                        handleClick={() => handleBoost()}
                      /> */}
                      <button
                        className={styles.dotMenuButton}
                        onClick={() => handleHide()}
                      >
                        <UnView />
                        Hide
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.dotMenuButton}
                      onClick={() => {
                        handleShow();
                        customToast({
                          msg: <>Shown</>,
                          autoClose: true,
                        });
                      }}
                    >
                      <ViewOutline />
                      Show
                    </button>
                  )}
                </div>
              </Menu>
            )}
            {isOpenBoostModal && (
              <BoostSuccessModal
                open={true}
                artwork={data}
                handleClose={() => setIsOpenBoostModal(false)}
              />
            )}
          </div>
        </div>
        <div
          className={styles.aboutArtwork}
          style={{ height: comments?.length <= 0 ? 357 : '' }}
        >
          <Accordion
            expanded={expanded === 'panel1' || comments?.length === 0}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              sx={{
                cursor: comments?.length > 0 ? 'pointer' : 'default !important',
              }}
            >
              <button
                className={styles.arrowButton}
                style={{
                  cursor: comments?.length > 0 ? 'pointer ' : 'default',
                }}
              >
                <span>About Artworks</span>
                {comments?.length > 0 && !!comments?.length && (
                  <ArrowIcon
                    direction={expanded === 'panel1' ? 'up' : 'down'}
                  />
                )}
              </button>
            </AccordionSummary>
            <AccordionDetails sx={{ height: 221 }}>
              <article className={styles.article}>
                {dataLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                    }}
                  >
                    <Skeleton width="100%" height={16} />
                    <Skeleton width="100%" height={16} />
                    <Skeleton width="100%" height={16} />
                    <Skeleton width="100%" height={16} />
                    <Skeleton width="100%" height={16} />
                  </div>
                ) : (
                  <p>{artworkInfo?.about}</p>
                )}
              </article>
            </AccordionDetails>
          </Accordion>
          {comments?.length > 0 && (
            <Accordion
              expanded={expanded === 'panel2'}
              onChange={handleChange('panel2')}
              sx={{ marginBottom: '24px !important' }}
            >
              <AccordionSummary
                sx={{
                  backgroundColor:
                    expanded === 'panel2'
                      ? 'rgba(248, 250, 252, 1)'
                      : 'transparent',
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
                  height: 221,
                  backgroundColor: 'rgba(248, 250, 252, 1)',
                  borderBottom:
                    expanded === 'panel2'
                      ? '1px solid var(--artiside-neutral5)'
                      : '',
                }}
              >
                <div className={styles.commentPanel} ref={panelRef}>
                  {comments?.map((item) => (
                    <Comment
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
          <Avatar image={me?.profileImgUrl} username={me?.nickname} type="md" />
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
                  onKeyDown={handleKeyDown}
                  disabled={!me}
                />
                <div className={styles.interactionWrapper}>
                  {comment && (
                    <p className={styles.commentLength}>{comment.length}/500</p>
                  )}
                  <button
                    type="submit"
                    aria-label="send"
                    className={comment ? styles.on : ''}
                    disabled={commentArtworkLoading}
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
        <div className={styles.buttonWrapper}>
          <div className={styles.blank} />
          <Link
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_THE_FLUX_URL}/artwork/${artworkId}`}
          >
            <Button
              type="secondary"
              color={
                (data || {}).isOnSale
                  ? 'var(--artiside-neutral1)'
                  : 'var(--artiside-neutral2)'
              }
              disabled={!(data || {}).isOnSale}
            >
              {!(data || {}).isOnSale
                ? 'This artwork is not for sale'
                : 'Go to Marketplace'}
            </Button>
          </Link>
          <Button disabled={true}>
            <div>
              <h1 style={{ color: 'var(--artiside-neutral2)' }}>Red Label</h1>
              <p
                style={{ fontSize: '11px', color: 'var(--artiside-neutral3)' }}
              >
                Coming Soon
              </p>
            </div>
            {/* <Tooltip title={<AboutRedLabel />} placement="top" arrow>
              <span>
                <InfoCircle />
              </span>
            </Tooltip> */}
          </Button>
        </div>
      </article>
    </section>
  );
}

export default ArtworkInfoSection;
