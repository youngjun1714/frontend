import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import { useRecoilValue } from 'recoil';
import stores from '@/store';
import { useConnectModalContext } from '@/adf-connect/contexts/ConnectModalContext';

const AuthRequiredButtonWrapper = (props) => {
  const { children, onClick, disabled } = props;
  const {
    common: { meState },
  } = stores;
  const me = useRecoilValue(meState);
  const { openModalPage } = useConnectModalContext();

  const handleClick = (event) => {
    if (disabled) return;
    if (!me) {
      event.preventDefault();
      openModalPage('SIGNIN');
    } else {
      onClick(event);
    }
  };

  return cloneElement(children, {
    onClick: handleClick,
  });
};

AuthRequiredButtonWrapper.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AuthRequiredButtonWrapper;
