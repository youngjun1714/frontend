import QuestionCircle from '../Icons/QuestionCircle';

function GuideButton(props) {
  const { onClick } = props;

  return (
    <button
      onClick={onClick}
      style={{ width: '24px', height: '24px' }}
      aria-label="guide button"
    >
      <QuestionCircle color="var(--artiside-neutral2)" />
    </button>
  );
}

export default GuideButton;
