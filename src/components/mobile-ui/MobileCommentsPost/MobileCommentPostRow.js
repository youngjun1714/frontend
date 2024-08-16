import { useState } from 'react';
import styles from './MobileCommentPostRow.module.scss';
import moment from 'moment';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

import { Menu } from '@mui/material';

import Avatar from '@/components/ui/Avatar/Avatar';
import MobileHeartIcon from '../MobileIcons/MobileHeartIcon';
import MobileIsPartnerBadge from '../MobileIcons/MobileIsPartnerBadge';
import MobileVerticalMoreIcon from '../MobileIcons/MobileVerticalMoreIcon';
import MobileChildCommentRow from './MobileChildCommentPostRow';
import MobileDropdown from '../MobileDropdown/MobileDropdown';
import MobileDropdownRow from '../MobileDropdown/MobileDropdownRow';
import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import { customToast } from '@/utils/customToast';
import dynamic from 'next/dynamic';

const MobileDeleteModal = dynamic(() =>
  import('@/components/ui/ConfirmModal/MobileDeleteModal')
);
const MobileReport = dynamic(() =>
  import('@/components/mobile-ui/MobileReport/MobileReport')
);

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

const MobileCommentPostRow = (props) => {
  const { data, me, id, onClick, onReply } = props;
  const { childComments, user } = data || {};

  const router = useRouter();

  const PARENT_ID = data?.id;

  // view/hide replies
  const [isOpen, setIsOpen] = useState(false);

  // view more menu
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  // view delete modal
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleConfirmClose = () => {
    setOpenConfirm(false);
  };

  // delete mutation
  const [deleteComment, { loading: commentDeleteLoading }] = useMutation(
    DELETE_POST_REPLY,
    {
      refetchQueries: ['getPostComments', 'getPost'],
    }
  );

  const handleDelete = async () => {
    try {
      await deleteComment({ variables: { postCommentId: id } });
    } catch (e) {
      console.error(e);
    }
  };

  // like mutation
  const [submit, { loading: commentLikeLoading }] =
    useMutation(LIKE_POST_COMMENT);
  const handleLike = async () => {
    try {
      await submit({ variables: { postCommentId: id } });
    } catch (e) {
      console.error(e);
    }
  };

  // Report Open
  const [reportOpen, setReportOpen] = useState(false);
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
    setReportOpen(true);
  };

  // Handle Report
  const [reportComment, { loading: commentReportLoading }] = useMutation(
    REPORT_POST_COMMENT,
    { refetchQueries: ['getPostComments', 'GetCurrentUser'] }
  );
  const handleReport = async (value) => {
    try {
      await reportComment({
        variables: {
          postCommentId: id,
          input: {
            reason: value,
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

  const [report, setReport] = useState('');
  const INPUT_MAX_LENGTH = 500;
  const handleInput = (e) => {
    if (e.target.value.length > INPUT_MAX_LENGTH) {
      e.target.value = e.target.value.slice(0, INPUT_MAX_LENGTH);
    }
    setReport(e.target.value);
  };

  return (
    <article className={styles.article}>
      <div className={styles.avatar}>
        <span onClick={() => router.push(`/artist/${user?.id}`)}>
          <Avatar
            type="md"
            username={user?.nickname}
            image={user?.profileImgUrl}
          />
        </span>
        {isOpen && <div className={styles.verticalLine} />}
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.contentHeader}>
          <h1 onClick={() => router.push(`/artist/${user?.id}`)}>
            {user?.nickname}{' '}
            {user?.isPartner && <MobileIsPartnerBadge size={'sm'} />}
          </h1>
          <div className={styles.date}>
            <h1>{moment(data?.createdAt).fromNowOrNow()}</h1>
            <button
              onClick={(e) => setAnchorEl(e.currentTarget)}
              aria-label="more"
            >
              <MobileVerticalMoreIcon />
            </button>
            <Menu
              sx={{
                '&.MuiPopover-root': {
                  zIndex: '1600 !important',
                  backgroundColor: 'transparent !important',
                },
                '& > .MuiPaper-root': {
                  borderRadius: '10px !important',
                  backgroundColor: 'transparent !important',
                  boxShadow: '0px 10px 60px 0px rgba(59, 59, 59, 0.3)',
                  '& > .MuiMenu-list': {
                    paddingTop: '0 !important',
                    paddingBottom: '0 !important',
                  },
                },
                '& > .MuiList-root': {
                  backgroundColor: 'transparent !important',
                  borderRadius: '10px !important',
                },
              }}
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
            >
              <MobileDropdown>
                {me?.id === user?.id ? (
                  <MobileDropdownRow
                    title="delete"
                    onClick={() => {
                      setOpenConfirm(true);
                      setAnchorEl(null);
                    }}
                  />
                ) : (
                  <AuthRequiredButtonWrapper
                    onClick={() => {
                      handleOpenReport();
                      setAnchorEl(null);
                    }}
                  >
                    <MobileDropdownRow title="report" />
                  </AuthRequiredButtonWrapper>
                )}
              </MobileDropdown>
            </Menu>

            {openConfirm && (
              <MobileDeleteModal
                open={openConfirm}
                title="Are you sure?"
                confirm="Delete"
                cancel="Cancel"
                onCancel={handleConfirmClose}
                onConfirm={handleDelete}
              />
            )}
            {reportOpen && (
              <MobileReport
                open={reportOpen}
                onClose={() => setReportOpen(false)}
                onClick={handleReport}
                report={report}
                onHandleInput={handleInput}
              />
            )}
          </div>
        </div>

        <div>
          <p className={styles.content}>
            {!data?.isReported ? (
              <>{data?.content}</>
            ) : (
              <span className={styles.isReported}>
                This comment has been reported.
              </span>
            )}
          </p>
        </div>

        <div className={styles.replyWrapper}>
          <div className={styles.like}>
            <AuthRequiredButtonWrapper onClick={() => handleLike()}>
              <button aria-label="like">
                <MobileHeartIcon isLiked={data?.isLiked} />
              </button>
            </AuthRequiredButtonWrapper>
            <p>{data?.likeCount}</p>
          </div>

          <AuthRequiredButtonWrapper onClick={() => onClick(data)}>
            <button className={styles.replyAction}>Reply</button>
          </AuthRequiredButtonWrapper>

          {data?.childComments?.length > 0 ? (
            <div className={styles.viewReplies}>
              <div className={styles.line} />
              <button onClick={() => setIsOpen(!isOpen)}>
                {!isOpen ? 'View replies' : 'Hide replies'}(
                {data?.childComments?.length})
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
        {isOpen && childComments?.length > 0 && (
          <div>
            {childComments.map((childComment) => {
              const { user } = childComment;
              return (
                <MobileChildCommentRow
                  me={me}
                  isMe={me?.id === user?.id}
                  id={childComment?.id}
                  key={childComment?.id}
                  data={childComment}
                  onClick={onReply}
                  parentId={PARENT_ID}
                />
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

export default MobileCommentPostRow;
