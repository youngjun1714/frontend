import { css } from '@emotion/react';

const styles = css`
  background-color: rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(6px);

  @media (max-width: 480px) {
    padding: 0 20px;
  }

  .confirm-modal-div {
    position: relative;
    box-sizing: border-box;
    width: 420px;
    background-color: #ffffff;
    border: 1px solid #F4F4F4;
    box-shadow: 0px 26px 80px rgba(18, 18, 23, 0.1);
    border-radius: 10px;
    text-align: center;
    padding: 30px 40px 20px;
  }
  .confirm-modal__icon {
    margin-bottom: 20px;
  }
  .confirm-modal__icon-wrap {
    width: 34px;
    height: 34px;
    background-color: #EBE8FF;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 15px;
  }
  .bg-red {
    background-color: #FFDEDC;
  }
  .confirm-modal__title {
    color: #1B1B1E;
    font-size: 24px;
    line-height: 28px;
    font-weight: bold;
    @media (max-width: 480px) {
      font-size: 18px;
    }
  }
  .confirm-modal__msg {
    color: #555555;
    font-size: 14px;
    margin-top: 15px;
    font-family: 'acumin-pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }
  .confirm-modal__msg b {
    font-weight: 700;
  }
  .confirm-modal__btns {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 40px 0 0;
    margin: 0 -10px;
    gap: 10px;
  }
  button:first-of-type {
    width: 96px !important;
    margin: 0 !important;
  }
  button:last-of-type {
    width: 100% !important;
    margin: 0 auto !important;
  }
}`;

export default styles;
