import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './MobileInspirationTitle.module.scss';
import { gql, useQuery, useMutation } from '@apollo/client';
import moment from 'moment';

import { Menu } from '@mui/material';

import AuthRequiredButtonWrapper from '@/components/ui/Button/AuthRequiredButtonWrapper';
import useFollowUser from '@/hooks/useFollowUser';
import useUnfollowUser from '@/hooks/useUnfollowUser';
import Avatar from '@/components/ui/Avatar/Avatar';
import MobileFollowButton from '@/components/mobile-ui/MobileFollowButton/MobileFollowButton';
import MobileMoreButtonIcon from '@/components/mobile-ui/MobileIcons/MobileMoreButtonIcon';
import MobileDropdown from '@/components/mobile-ui/MobileDropdown/MobileDropdown';
import MobileDropdownRow from '@/components/mobile-ui/MobileDropdown/MobileDropdownRow';
import { customToast } from '@/utils/customToast';
import dynamic from 'next/dynamic';

const MobileUpdatePost = dynamic(() =>
  import('@/components/mobile-ui/MobileUpdatePost/MobileUpdatePost')
);
const DeleteModal = dynamic(() =>
  import('@/components/ui/ConfirmModal/DeleteModal')
);
const MobileReport = dynamic(() =>
  import('@/components/mobile-ui/MobileReport/MobileReport')
);

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

const INPUT_MAX_LENGTH = 500;

const MobileInspirationTitle = (props) => {
  const { data, user, me, isMe } = props;
  const router = useRouter();

  // Modal content state
  const [modalMenu, setModalMenu] = useState('');

  //Dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Dropdown menu select
  const [select, setSelect] = useState('');

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

  /**
   * Mutation: follow
   */
  const [follow, { loading: isFollowLoading }] = useFollowUser(user?.id);
  const handleFollow = async () => {
    try {
      await follow({ variables: { userId: user?.id } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * Mutation: unfollow
   */
  const [unfollow, { loading: isUnfollowLoading }] = useUnfollowUser(user?.id);
  const handleUnfollow = async () => {
    try {
      await unfollow({ variables: { userId: user?.id } });
      setIsFollow(!isFollow);
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * Mutation: report
   */
  const [report, setReport] = useState('');
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
          postId: data?.id,
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
      setModalMenu('');

      setTimeout(() => {
        router.push('/creation?tab=inspiration');
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

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
    setModalMenu('report');
  };

  /**
   * Mutation: delete
   */
  const [deletePost, { loading: deleteLoading }] = useMutation(DELETE_POST);

  const handleDeletePost = async () => {
    try {
      await deletePost({ variables: { postId: data?.id } });
      customToast({
        msg: <>Deleted</>,
      });
      setTimeout(() => {
        router.push('/creation?tab=inspiration').then(() => {
          window.location.href = window.location.href;
        });
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.mobileTitle}>
      <h1>{data?.title}</h1>

      <div className={styles.mobileInfoSection}>
        <Link href={`/artist/${user?.id}`}>
          <div className={styles.left}>
            <Avatar
              type="sm"
              username={user?.nickname}
              image={user?.profileImgUrl}
            />
            <h1>
              {user?.nickname}{' '}
              <span>· {moment(data?.createdAt).fromNowOrNow()}</span>
            </h1>
          </div>
        </Link>

        <div className={styles.right}>
          {!isMe && (
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
              <MobileFollowButton
                isFollow={isFollow}
                width="unset"
                icon={false}
              />
            </AuthRequiredButtonWrapper>
          )}
          <AuthRequiredButtonWrapper
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <button className={styles.moreButton} aria-label="more">
              <MobileMoreButtonIcon />
            </button>
          </AuthRequiredButtonWrapper>

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
            open={open}
            onClose={() => setAnchorEl(null)}
          >
            <MobileDropdown>
              {isMe ? (
                <>
                  <MobileDropdownRow
                    title="edit"
                    onClick={() => {
                      setModalMenu('edit');
                      setAnchorEl(null);
                    }}
                  />
                  <MobileDropdownRow
                    title="delete"
                    onClick={() => {
                      setModalMenu('delete');
                      setAnchorEl(null);
                    }}
                  />
                </>
              ) : (
                <MobileDropdownRow
                  title="report"
                  onClick={() => {
                    handleOpenReport();
                    setAnchorEl(null);
                  }}
                />
              )}
            </MobileDropdown>
          </Menu>

          {modalMenu === 'edit' && (
            <MobileUpdatePost
              open={modalMenu === 'edit'}
              onClose={() => setModalMenu('')}
              data={data}
            />
          )}
          {modalMenu === 'delete' && (
            <DeleteModal
              open={modalMenu === 'delete'}
              title="Are you sure?"
              confirm="Delete"
              cancel="Cancel"
              onConfirm={handleDeletePost}
              onCancel={() => setModalMenu('')}
              onClick={() => setModalMenu('')}
            />
          )}
          {modalMenu === 'report' && (
            <MobileReport
              open={modalMenu === 'report'}
              onClose={() => setModalMenu('')}
              onClick={handleReport}
              report={report}
              onHandleInput={handleInputReport}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileInspirationTitle;
