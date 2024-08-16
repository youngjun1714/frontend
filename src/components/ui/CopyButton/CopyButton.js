import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './CopyButton.module.scss';
import CopyNew from '../Icons/CopyNew';

function CopyButton({ text, height }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window) {
      const userAgent = window.navigator.userAgent;
      const isMobileOrTablet =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      setIsMobile(isMobileOrTablet);
    }
  }, []);

  const [copied, setCopied] = useState(false);
  const handleCopied = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };
  return (
    <button
      className={classNames(styles.copyButton, {
        [styles.hasHover]: !isMobile,
      })}
      style={{ height: height }}
      onClick={handleCopied}
    >
      <CopyNew />
      <div
        className={classNames(styles.copied, {
          [styles.show]: copied,
        })}
      >
        {isMobile ? (
          <span>Copied!</span>
        ) : (
          <span>{copied ? 'Copied!' : 'Copy?'}</span>
        )}
      </div>
    </button>
  );
}

export default CopyButton;

CopyButton.defaultProps = {
  height: '40px',
};
