import { Dialog } from '@mui/material';
import { css } from '@emotion/react';

const styles = css`
  .policy__wrap {
    margin-top: 50px;
    margin-bottom: 50px;
    padding: 50px 80px;
    text-align: left;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 15px 40px 0px rgb(187 187 187 / 15%);
    @media (max-width: 480px) {
      padding: 50px 20px;
    }
  }

  .policy__box {
    box-shadow: none;
  }

  .terms-close {
    position: fixed;
    top: 40px;
    right: 40px;
    padding: 6px;

    & > svg {
      width: 36px;
      height: 36px;
    }
  }
`;

const TermsDialog = ({ open, children, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    sx={{
      zIndex: 1700,
    }}
    slotProps={{
      backdrop: {
        sx: {
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(6px)',
        },
      },
    }}
    PaperProps={{
      sx: {
        margin: 0,
        boxShadow: 'none',
        background: 'none',
        borderRadius: '20px',
        width: 'fit-content',
      },
    }}
    css={styles}
    scroll="body"
    fullWidth={true}
    maxWidth="lg"
  >
    {children}
  </Dialog>
);

export default TermsDialog;
