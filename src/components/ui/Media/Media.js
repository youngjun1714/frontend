import PropTypes from 'prop-types';
import Picture from '../Picture/Picture';
import Video from '../Video/Video';

const Media = ({ mediaType, thumbnailUrl, ...otherProps }) => {
  if (mediaType === 'IMAGE') {
    return <Picture {...otherProps} />;
  }
  if (mediaType === 'VIDEO') {
    return <Video thumbnailUrl={thumbnailUrl} {...otherProps} />;
  }
};

Media.propTypes = {
  mediaType: PropTypes.oneOf(['IMAGE', 'VIDEO']),
};

export default Media;
