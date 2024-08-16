import React from 'react';
import styles from './AcitivityLabel.module.scss';

const LABEL_INFO = {
  SEEDING: {
    label: 'Seeding',
    color: '#00B5B0',
    backgroundColor: '#E5F8F7',
  },
  UNSEEDING: {
    label: 'Unseeding',
    color: '#00B5B0',
    backgroundColor: '#E6E9EC',
  },
  REQUEST: {
    label: 'Request',
    color: '#1B1E24',
    backgroundColor: '#EFF2F3',
  },
  CLAIMED: {
    label: 'Seeding Claim',
    color: '#00B5B0',
    backgroundColor: '#E5F8F7',
  },
  IM_CLAIMED: {
    label: 'Seeding Claimed',
    color: '#00B5B0',
    backgroundColor: '#E5F8F7',
  },
  STAKING: {
    label: 'Stake',
    color: '#5F44FF',
    backgroundColor: '#F0EDFF',
  },
  UNSTAKING: {
    label: 'Unstake',
    color: '#5F44FF',
    backgroundColor: '#E6E9EC',
  },
  STAKING_CLAIMED: {
    label: 'Stake Claim',
    color: '#5F44FF',
    backgroundColor: '#F0EDFF',
  },
  VOTING_CLAIMED: {
    label: 'Voting Claim',
    color: '#5F44FF',
    backgroundColor: '#F0EDFF',
  },
  SEEDING_REWARD: {
    label: 'Seeding Reward',
    color: '#00B5B0',
    backgroundColor: '#E5F8F7',
  },
  STAKING_REWARD: {
    label: 'Staking Reward',
    color: '#5F44FF',
    backgroundColor: '#F0EDFF',
  },
};

const AcitivityLabel = ({ type }) => {
  const labelInfo = LABEL_INFO[type];

  return (
    <div
      className={styles.activityLabel}
      style={{
        backgroundColor: labelInfo?.backgroundColor,
        color: labelInfo?.color,
      }}
    >
      {labelInfo?.label}
    </div>
  );
};
export default AcitivityLabel;
