import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Modal } from '@mui/material';

import ImageEventPopupLayout from './layout/ImageEventPopupLayout/ImageEventPopupLayout';
import NoImageEventPopupLayout from './layout/NoImageEventPopupLayout/NoImageEventPopupLayout';
import moment from 'moment';

const EventPopup = (props, ref) => {
  const {
    image,
    alt,
    type = 'sm',
    title,
    buttonText = 'Confirm',
    description,
    onClick,
    popupId,
    expiredAt,
  } = props;

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (
      sessionStorage.getItem(popupId) === 'false' ||
      (expiredAt && moment().isAfter(expiredAt))
    ) {
      setIsOpen(false);
    }
  }, []);

  return (
    <>
      {isOpen ? (
        <Modal
          open={isOpen}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 10px',
            zIndex: 1500,
            '& div': {
              outline: 'none',
            },
          }}
          ref={ref}
        >
          <div>
            {image ? (
              <ImageEventPopupLayout
                popupId={popupId}
                type={type}
                title={title}
                buttonText={buttonText}
                description={description}
                image={image}
                alt={alt}
                setIsOpen={setIsOpen}
                onClick={onClick}
              />
            ) : (
              <NoImageEventPopupLayout
                popupId={popupId}
                type={type}
                title={title}
                buttonText={buttonText}
                description={description}
                setIsOpen={setIsOpen}
                onClick={onClick}
              />
            )}
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

export default forwardRef(EventPopup);

EventPopup.propTypes = {
  image: PropTypes.string,
  alt: PropTypes.string,
  type: PropTypes.oneOf(['sm', 'md', 'lg']),
  title: PropTypes.oneOf([PropTypes.component, PropTypes.string]),
  description: PropTypes.string,
  onClick: PropTypes.func,
  popupId: PropTypes.string,
};
