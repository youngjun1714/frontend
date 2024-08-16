const TermsBox = ({ onOpen }) => (
  <div className="create-info">
    By create your account, you agree to our{' '}
    <button onClick={() => onOpen('terms')}>Terms of Service</button> and our{' '}
    <button onClick={() => onOpen('policy')}>Privacy Policy</button>
  </div>
);

export default TermsBox;
