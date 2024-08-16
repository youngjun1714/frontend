import React from 'react';
import PropTypes from 'prop-types';

import ArtworkFeedCard from '@/components/ui/Card/FeedCard/ArtworkFeedCard';
import InspirationFeedCard from '@/components/ui/Card/FeedCard/InspirationFeedCard';

const FeedContainer = ({ feeds }) => (
  <section>
    {feeds.map((feed) => {
      if (feed.feedType === 'ARTWORK') {
        return (
          <ArtworkFeedCard
            key={`artworkFeed.${feed.artwork.artworkId}`}
            artwork={feed.artwork}
          />
        );
      }
      return (
        <InspirationFeedCard
          key={`postFeed.${feed.post.id}`}
          post={feed.post}
        />
      );
    })}
  </section>
);

FeedContainer.propTypes = {
  feeds: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FeedContainer;
