import Button from '@/adf-connect/components/ui/button/button';

const InfoEmailCode = (props) => {
  const { email, onConfirm } = props;

  return (
    <div className="modal-container info-email-container">
      <div className="modal-header">Email verification</div>
      <div className="modal-title" style={{ marginTop: 20 }}>
        Didn&apos;t receive email code?
      </div>
      <div className="modal-desc">
        We sent you the code to your email.
        <br />
        If you have not received the code, please try:
      </div>
      <hr className="dividing-line" />
      <ul className="check-point-list">
        <li>1. Check your junk/spam mail.</li>
        <li>
          2. Make sure your email address is <b>{email || 'test@test.com'}</b>
        </li>
        <li>
          3. The message may be delayed for a few minutes. Try again later.
        </li>
        <li>4.We do not send the code if the address already exists.</li>
      </ul>
      <Button className="bottom-button" onClick={onConfirm}>
        Confirm
      </Button>
    </div>
  );
};

export default InfoEmailCode;
