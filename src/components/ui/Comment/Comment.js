import { useState } from 'react';
import styles from './Comment.module.scss';
import moment from 'moment';
import { gql, useMutation } from '@apollo/client';
import { useRecoilValue } from 'recoil';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import stores from '@/store';
import Avatar from '../Avatar/Avatar';
import HeartButton from '../Button/heartButton';
import { customToast } from '@/utils/customToast';
import AuthRequiredButtonWrapper from '../Button/AuthRequiredButtonWrapper';
import Delete from '../Icons/Delete';
import IsArtist from '../Icons/IsArtist';

const DeleteModal = dynamic(() =>
  import('@/components/ui/ConfirmModal/DeleteModal')
);
const ArtworkReport = dynamic(() =>
  import('@/views/artwork/components/artwork-report/ArtworkReport')
);

// Mutation
const LIKE_ARTWORK_COMMENT = gql`
  mutation LikeArtworkComment($artworkCommentId: ID!) {
    likeArtworkComment(artworkCommentId: $artworkCommentId) {
      id
      likeCount
      isLiked
      user {
        id
      }
    }
  }
`;

const DELETE_ARTWORK_REPLY = gql`
  mutation DeleteArtworkReply($artworkCommentId: ID!) {
    deleteArtworkComment(artworkCommentId: $artworkCommentId)
  }
`;

const REPORT_ARTWORK_COMMENT = gql`
  mutation ReportArtworkComment(
    $artworkCommentId: ID!
    $input: ReportArtworkCommentInput!
  ) {
    reportArtworkComment(artworkCommentId: $artworkCommentId, input: $input) {
      id
    }
  }
`;

const PAGE_SIZE = 5;

function Comment(props) {
  const { data, type, style, onClick, onReply, rootParent } = props;
  const { user } = data;

  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);

  const [report, setReport] = useState('');
  const INPUT_MAX_LENGTH = 500;
  const handleInput = (e) => {
    if (e.target.value.length > INPUT_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, INPUT_MAX_LENGTH);
    }
    setReport(e.target.value);
  };

  // for delete
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  // for report
  const [open, setOpen] = useState(false);

  const handleOpenReport = () => {
    if (
      me.lastReportAt &&
      moment(me.lastReportAt).add(24, 'hours').isAfter(moment.now())
    ) {
      customToast({
        toastType: 'error',
        msg: <>You can only report once a day</>,
        autoClose: 2000,
      });
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // like button
  const [toggle, setToggle] = useState(data?.isLiked);

  // view replies
  const [view, setView] = useState(false);

  const [limit, setLimit] = useState(PAGE_SIZE);

  // for Mutation
  const artworkCommentId = data.id;

  const [submit, { loading: commentLikeLoading }] =
    useMutation(LIKE_ARTWORK_COMMENT);
  const handleLike = async () => {
    try {
      await submit({ variables: { artworkCommentId } });
    } catch (e) {
      console.error(e);
    }
  };

  const [deleteComment, { loading: commentDeleteLoading }] = useMutation(
    DELETE_ARTWORK_REPLY,
    {
      refetchQueries: ['getArtworkComments', 'getArtwork'],
    }
  );

  const handleDelete = async () => {
    try {
      await deleteComment({ variables: { artworkCommentId } });
    } catch (e) {
      console.error(e);
    }
  };

  const [reportComment, { loading: commentReportLoading }] = useMutation(
    REPORT_ARTWORK_COMMENT,
    { refetchQueries: ['getArtworkComments', 'GetCurrentUser'] }
  );
  const handleReport = async (value) => {
    try {
      await reportComment({
        variables: {
          artworkCommentId,
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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.comment} style={{ ...style }}>
      <div className={styles.main}>
        <Link
          href={
            user?.isPartner
              ? `/artist/${user?.id}?list=artworks`
              : `/artist/${user?.id}?list=inspiration`
          }
        >
          <Avatar
            type="md"
            username={user?.nickname}
            image={user?.profileImgUrl}
          />
        </Link>
        <div className={styles.text}>
          <span className={styles.username}>
            {user?.nickname} {user.isPartner && <IsArtist />}
          </span>
          <span className={styles.content}>
            {!data?.isReported ? (
              <> {data?.content}</>
            ) : (
              <span className={styles.isReported}>
                This comment has been reported.
              </span>
            )}{' '}
          </span>

          <div className={styles.info}>
            <p>{moment(data?.createdAt).fromNowOrNow()}</p>
            {/* <button onClick={() => onClick(user.nickname)}>Reply</button> */}

            {type !== 'reply' ? (
              <button onClick={() => onClick(data)}>Reply</button>
            ) : (
              <button onClick={() => onReply(data, rootParent)}>Reply</button>
            )}
            {type !== 'reply' && data?.childComments?.length > 0 && (
              <button onClick={() => setView(!view)}>
                {view
                  ? `Hide replies (${data.childComments?.length})`
                  : `View replies (${data.childComments?.length})`}
              </button>
            )}
            <AuthRequiredButtonWrapper
              onClick={() => {
                handleLike();
                setToggle(!toggle);
              }}
            >
              <button
                type="button"
                className={styles.heart}
                disabled={commentLikeLoading}
                aria-label="like"
              >
                <HeartButton liked={toggle} />
                <span>{data.likeCount?.toLocaleString()}</span>
              </button>
            </AuthRequiredButtonWrapper>
            {user?.id === me?.id && (
              <>
                <button
                  className={styles.deleteButton}
                  type="button"
                  onClick={() => {
                    setOpenConfirm(true);
                  }}
                  disabled={commentDeleteLoading}
                  aria-label="delete"
                >
                  <Delete color="var(--artiside-neutral2)" />
                </button>
                {openConfirm && (
                  <DeleteModal
                    open={openConfirm}
                    title="Are you sure?"
                    confirm="Delete"
                    cancel="Cancel"
                    onCancel={handleConfirmClose}
                    onConfirm={handleDelete}
                  />
                )}
              </>
            )}
            {user?.id !== me?.id && me && (
              <button onClick={() => handleOpenReport()}>Report</button>
            )}
            {open && (
              <ArtworkReport
                onClick={handleReport}
                report={report}
                onHandleInput={handleInput}
                loading={commentReportLoading}
                onClose={handleClose}
                open={open}
              />
            )}
          </div>
          {view && (
            <div>
              {(data.childComments || []).slice(0, limit).map((item) => (
                <Comment
                  style={{ margin: '20px 0' }}
                  data={item}
                  key={item.id}
                  type="reply"
                  onClick={onClick}
                  onReply={onReply}
                  rootParent={artworkCommentId}
                />
              ))}
              {(data.childComments || []).length > limit && (
                <button
                  type="button"
                  className={styles.loadButton}
                  onClick={() => setLimit(limit + PAGE_SIZE)}
                >
                  + View more replies
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;

Comment.defaultProps = {
  type: 'comment',
};
