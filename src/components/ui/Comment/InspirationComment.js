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
const LIKE_POST_COMMENT = gql`
  mutation LikePostComment($postCommentId: ID!) {
    likePostComment(postCommentId: $postCommentId) {
      id
      likeCount
      isLiked
      user {
        id
      }
    }
  }
`;

const DELETE_POST_REPLY = gql`
  mutation DeletePostReply($postCommentId: ID!) {
    deletePostComment(postCommentId: $postCommentId)
  }
`;

const REPORT_POST_COMMENT = gql`
  mutation ReportPostComment(
    $postCommentId: ID!
    $input: ReportPostCommentInput!
  ) {
    reportPostComment(postCommentId: $postCommentId, input: $input) {
      id
    }
  }
`;

const PAGE_SIZE = 5;

function InspirationComment(props) {
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
  const postCommentId = data.id;

  const [submit, { loading: commentLikeLoading }] =
    useMutation(LIKE_POST_COMMENT);
  const handleLike = async () => {
    try {
      await submit({ variables: { postCommentId } });
    } catch (e) {
      console.error(e);
    }
  };

  const [deleteComment, { loading: commentDeleteLoading }] = useMutation(
    DELETE_POST_REPLY,
    {
      refetchQueries: ['getPostComments', 'getPost'],
    }
  );
  const handleDelete = async () => {
    try {
      await deleteComment({ variables: { postCommentId } });
    } catch (e) {
      console.error(e);
    }
  };

  const [reportComment, { loading: commentReportLoading }] = useMutation(
    REPORT_POST_COMMENT,
    {
      refetchQueries: ['getPostComments', 'GetCurrentUser'],
    }
  );
  const handleReport = async (value) => {
    try {
      await reportComment({
        variables: {
          postCommentId,
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
            type="sm"
            username={user?.nickname}
            image={user?.profileImgUrl}
          />
        </Link>
        <div className={styles.text}>
          <span className={styles.username}>
            {user?.nickname} {user?.isPartner && <IsArtist />}
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
              <button className={styles.heart} aria-label="like">
                <HeartButton liked={toggle} />
                <span>{data.likeCount?.toLocaleString()}</span>
              </button>
            </AuthRequiredButtonWrapper>
            {user?.id === me?.id && (
              // <button onClick={handleDelete}>delete</button>
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
            {user?.id !== me?.id && (
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
                <InspirationComment
                  style={{ margin: '20px 0' }}
                  data={item}
                  key={item.id}
                  type="reply"
                  onClick={onClick}
                  onReply={onReply}
                  rootParent={postCommentId}
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

export default InspirationComment;

InspirationComment.defaultProps = {
  type: 'comment',
};
