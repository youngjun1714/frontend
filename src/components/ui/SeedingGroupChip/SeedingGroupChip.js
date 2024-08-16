import React from 'react';
import styles from './SeedingGroupChip.module.scss';

const SeedingGroupChip = ({ group, GuideButton }) => (
  <div className={styles.seedingGroupChip}>
    {`${group}`}
    {GuideButton && GuideButton}
  </div>
);

export default SeedingGroupChip;
