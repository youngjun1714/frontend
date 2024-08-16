import { css } from '@emotion/react';

const styles = css`
  background-color: rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: blur(6px);

  .confirm-modal-div {
    position: relative;
    box-sizing: border-box;
    width: 560px;
    background-color: #ffffff;
    border: 1px solid #f4f4f4;
    box-shadow: 0px 26px 80px rgba(18, 18, 23, 0.1);
    border-radius: 10px;
    text-align: center;
    padding: 40px 70px;
  }

  .confirm-modal-div.sm {
    width: 430px;
    padding: 30px;
  }

  .bg-red {
    background-color: #ffdedc;
  }

  .confirm-modal__title {
    color: #333333;
    font-size: 18px;
    font-weight: 600;
    font-family: SUIT;
    margin-bottom: 90px;
  }

  .confirm-modal__desc {
    color: #333333;
    font-size: 20px;
    font-family: SUIT;
    font-weight: 600;
    line-height: 120%;
  }

  .confirm-modal__sub-desc {
    color: #888888;
    font-size: 16px;
    font-family: SUIT;
    margin-top: 16px;
    line-height: 120%;
  }

  .confirm-modal__btns {
    box-sizing: border-box;
    margin-top: 70px;
  }

  .confirm-modal-div.sm .confirm-modal__btns {
    margin-top: 20px;
  }

  .confirm-modal__btns button {
    width: 100%;
    font-size: 16px;
  }

  .confirm-modal__btns button:nth-of-type(2) {
    margin-top: 10px;
  }
`;

export default styles;
