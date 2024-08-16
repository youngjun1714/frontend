import React from 'react';
import styles from '@/components/ui/Typography/InfoTypography.module.scss';
import numberFormat from '@/utils/numberFormat';

function DollarTypography(props) {
  const { content, align, size } = props;

  return (
    <div>
      <div
        className={styles.dollar}
        style={{ justifyContent: align === 'right' ? 'flex-end' : '' }}
      >
        <p style={{ fontSize: size === 'sm' ? '12px' : '' }}>
          $&nbsp;{numberFormat(content)}
        </p>
      </div>
    </div>
  );
}

export default DollarTypography;

DollarTypography.defaultProps = {
  content: '',
  size: '',
  align: '',
};
