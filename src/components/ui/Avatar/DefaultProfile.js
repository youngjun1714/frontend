import getRandomColor from '@/utils/randomProfile';
import FaceHappy from '../Icons/FaceHappy';

function DefaultProfile(props) {
  const { className, username } = props;

  return (
    <div className={className} style={{ background: 'white' }}>
      <FaceHappy color={getRandomColor(username)} />
    </div>
  );
}

export default DefaultProfile;
