import React from 'react';
import styles from '@/components/ui/Typography/InfoTypography.module.scss';
import numberFormat from '@/utils/numberFormat';
import classNames from 'classnames';

/**
 *
 * @prop {string} content - '123123' (price)
 * @prop {string} endDecorator - 'ADF, 'USDT' (currency)
 * @prop {string} align - 'right'
 * @prop {string} size - 'sm'
 * @prop {number} decimals - 4
 * @returns
 */
function InfoTypography(props) {
  const {
    content,
    startDecorator,
    endDecorator,
    align = 'left',
    size = 'xs',
    decimals = 4,
    numberColor = 'inherit',
  } = props;

  const formattedNumber = content
    ? numberFormat(content, decimals)
    : numberFormat(0, decimals);
  const splitNumber = formattedNumber?.split('.');

  return (
    <div
      className={classNames(styles.number, {
        [styles[size]]: size,
      })}
      style={{
        justifyContent:
          align === 'right'
            ? 'flex-end'
            : align === 'left'
            ? 'initial'
            : 'center',
      }}
    >
      <div className={styles.numberDiv} style={{ color: numberColor }}>
        {startDecorator}
        {splitNumber[0] || 0}
        {decimals ? '.' : ''}
        {decimals ? (
          <span className={styles.decimal}>{splitNumber[1] || 0}</span>
        ) : (
          ''
        )}
      </div>
      <div className={styles.endDecorator}>{endDecorator}</div>
    </div>
  );
}

export default InfoTypography;

InfoTypography.defaultProps = {
  content: '',
  endDecorator: '',
  size: '',
};
