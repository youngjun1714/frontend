import getRandomColor from '@/utils/randomProfile';
import FaceHappy from '../Icons/FaceHappy';

function DefaultProfileImg(props) {
  const { size = 40, username } = props;

  return (
    <div style={{ width: size, height: size }}>
      <FaceHappy color={getRandomColor(username)} />
    </div>
  );
}

export default DefaultProfileImg;
