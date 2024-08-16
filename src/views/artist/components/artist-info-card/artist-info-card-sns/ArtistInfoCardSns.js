import React from 'react';
import styles from './ArtistInfoCardSns.module.scss';
import PropTypes from 'prop-types';
import Links from '@/components/ui/Icons/Links';
import Instagram from '@/components/ui/Icons/Instagram';
import Twitter from '@/components/ui/Icons/Twitter';
import Facebook from '@/components/ui/Icons/Facebook';
import Discord from '@/components/ui/Icons/Discord';
import Youtube from '@/components/ui/Icons/Youtube';

const ArtistInfoCardSns = (props) => {
  const getSnsUrl = (link, type) => {
    if (type === 'instagram') return `https://www.instagram.com/${link}`;
    if (type === 'twitter') return `https://twitter.com/${link}`;
    if (type === 'facebook') return `https://www.facebook.com/${link}`;
    if (type === 'discord') return `https://discord.gg/${link}`;
    if (type === 'youtube') return `https://www.youtube.com/@${link}`;
  };

  const handleClick = (link, type) => {
    window.open(getSnsUrl(link, type));
  };

  return (
    <div className={styles.snsButton}>
      <div className={styles.linkWrap}>
        <Links color="var(--artiside-neutral2)" />
      </div>
      <div className={styles.snsWrap}>
        {Object.keys(props).map(
          (key) =>
            props[key]?.trim() && (
              <button
                key={`sns-${key}`}
                className={styles[key]}
                onClick={() => handleClick(props[key], key)}
                aria-label={key}
              >
                {key === 'instagram' && <Instagram />}
                {key === 'twitter' && <Twitter />}
                {key === 'facebook' && <Facebook />}
                {key === 'discord' && <Discord />}
                {key === 'youtube' && <Youtube />}
              </button>
            )
        )}
      </div>
    </div>
  );
};

ArtistInfoCardSns.propTypes = {
  instagram: PropTypes.string,
  twitter: PropTypes.string,
  facebook: PropTypes.string,
  discord: PropTypes.string,
  youtube: PropTypes.string,
};

export default ArtistInfoCardSns;
