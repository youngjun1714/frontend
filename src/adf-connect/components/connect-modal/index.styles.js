import { css } from '@emotion/react';
import adfLogo from '@/adf-connect/assets/images/logo.svg';
import googleLogo from '@/adf-connect/assets/images/google-logo.svg';
import appleLogo from '@/adf-connect/assets/images/apple-logo.svg';
import resetIcon from '@/adf-connect/assets/images/reset-icon.svg';

const styles = css`
  position: relative;
  outline: none;

  @media (max-width: 768px) {
    overflow-x: hidden;
  }

  .go-back-button {
    position: absolute;
    top: 35px;
    left: 35px;
    z-index: 1;
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    @media (max-width: 480px) {
      left: 20px;
      top: 18px;
    }
  }

  .info-email-container {
    z-index: 2;
  }

  .modal-container {
    position: relative;
    width: 560px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0px 15px 40px rgba(187, 187, 187, 0.15);
    border-radius: 10px;
    padding: 100px 50px 60px 40px;

    @media (max-width: 480px) {
      width: 100%;
      padding: 50px 30px 60px 20px;
      border-radius: 20px 20px 0 0;
      min-height: 70vh;
    }

    &.center-container {
      padding: 100px 70px 40px;
      @media (max-width: 480px) {
        padding: 80px 40px 60px;
      }
    }

    .adf-logo {
      width: 126px;
      height: 46px;
      background-image: url(${adfLogo.src});
      margin: 0 auto 60px;
    }

    .google-logo {
      width: 20px;
      height: 20px;
      background-image: url(${googleLogo.src});
      margin-right: 25px;
    }

    .apple-logo {
      width: 24px;
      height: 24px;
      background-image: url(${appleLogo});
      margin-right: 25px;
    }
    .modal-header {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 90px;
      color: #333;
      font-family: 'SUIT';
      font-weight: 600;
      font-size: 18px;
    }
    .modal-title {
      font-family: 'SUIT';
      font-size: 28px;
      font-weight: 500;
      margin-bottom: 40px;
      line-height: 120%;
      @media (max-width: 480px) {
        margin-bottom: 26px;
      }
    }
    .modal-desc {
      font-family: 'SUIT';
      font-size: 16px;
      font-weight: 400;
      color: #888888;
      margin-bottom: 50px;
      line-height: 140%;
      b {
        color: #333;
        font-weight: 600;
      }
    }
    .dividing-text {
      position: relative;
      text-align: center;
      margin-top: 40px;
      margin-bottom: 40px;
      color: #888888;
      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        right: 0;
        width: calc(50% - 30px);
        height: 1px;
        background-color: #eeeeee;
      }
      &::before {
        content: '';
        display: block;
        position: absolute;
        top: 50%;
        left: 0;
        width: calc(50% - 30px);
        height: 1px;
        background-color: #eeeeee;
      }
    }
    .login-button-container {
      margin-bottom: 50px;
    }

    .login-button {
      width: 100%;
      margin-bottom: 10px;
    }

    .bottom-button {
      width: 100%;
      margin-top: 40px;
      @media (max-width: 480px) {
        margin-top: 20px;
      }
    }

    .info-email-button {
      margin: 100px auto 0;
    }

    .create-info {
      width: 280px;
      margin: 0 auto;
      font-family: 'SUIT';
      font-weight: 300;
      font-size: 15px;
      color: #888888;
      text-align: center;
      margin-top: 30px;
      line-height: 140%;
    }

    .signup-form {
      margin-bottom: 50px;
      @media (max-width: 480px) {
        margin-bottom: 10px;
      }
    }

    .step-container {
      position: relative;
      display: flex;
      justify-content: space-between;
      padding-bottom: 50px;
      @media (max-width: 480px) {
        padding-bottom: 30px;
      }

      .step-no {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 100%;
        background: #5f44ff;
        color: #ffffff;
        font-family: 'SUIT';
        font-weight: 300;
        font-size: 14px;
        z-index: 1;
        &.disabled {
          background: #ddd;
        }
        @media (max-width: 480px) {
          width: 20px;
          height: 20px;
          font-size: 13px;
        }
      }

      &::before {
        display: block;
        content: '';
        position: absolute;
        top: 30px;
        left: 12px;
        height: calc(100% - 24px - 12px);
        border-left: 0.5px dashed #888;
        @media (max-width: 480px) {
          left: 10px;
        }
      }

      &:last-of-type::before {
        display: none;
      }

      .step-content {
        width: calc(100% - 44px);
        @media (max-width: 480px) {
          width: calc(100% - 24px);
        }
      }

      .step-title {
        position: relative;
        display: flex;
        align-items: center;
        width: fit-content;
        height: 24px;
        font-family: 'SUIT';
        font-weight: 500;
        font-size: 14px;
        margin-bottom: 10px;
        color: #888888;
        @media (max-width: 480px) {
          height: 20px;
        }
        &.active-step {
          color: #333;
        }
        &.active-step.is-required::after {
          display: block;
          content: '';
          position: absolute;
          top: 6px;
          right: -8px;
          width: 4px;
          height: 4px;
          border-radius: 100%;
          background-color: #d00037;
        }
      }

      .step-desc {
        font-family: 'SUIT';
        font-weight: 300;
        font-size: 12px;
      }
      .step-value {
        font-family: 'SUIT';
        font-weight: 400;
        font-size: 16px;
        @media (max-width: 768px) {
          font-size: 13px;
        }
      }
    }
    .input-container {
      margin-top: 20px;
      height: 50px;

      .input-label {
        position: relative;
        width: fit-content;
        font-family: 'SUIT';
        font-weight: 600;
        font-size: 14px;
        color: #1b1e24;
        margin-bottom: 10px;
        &::after {
          display: block;
          content: '';
          position: absolute;
          top: 0px;
          right: -8px;
          width: 4px;
          height: 4px;
          border-radius: 100%;
          background-color: #d00037;
        }
      }

      .input-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dddddd;
        padding-bottom: 6px;
        &.error {
          color: #d00037;
          border-bottom: 1px solid #d00037;
        }
        input {
          width: calc(100% - 90px);
          border: none;
          outline: none;
          font-family: 'SUIT';
          font-weight: 400;
          font-size: 20px;
          color: #1b1e24;

          @media (max-width: 768px) {
            font-size: 13px;
          }

          &.verification-code {
            width: calc(100% - 140px);
          }
        }

        .verify-time {
          font-family: 'SUIT';
          font-weight: 300;
          font-size: 16px;
          color: #f60b98;
        }

        .verify-button {
          width: 80px;
          height: 30px;
          font-family: 'SUIT';
          font-size: 14px;
        }
        .reset-button {
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
          border: none;
          outline: none;
          width: 32px;
          height: 32px;
          .reset-logo {
            width: 15px;
            height: 15px;
            background-image: url(${resetIcon.src});
          }
        }
      }

      .input-error-msg {
        font-family: 'SUIT';
        font-size: 12px;
        font-weight: 400;
        color: #d00037;
        margin-top: 4px;
      }
      .input-available-msg {
        font-family: 'SUIT';
        font-size: 12px;
        font-weight: 400;
        color: #00b5b0;
        margin-top: 4px;
      }
    }
    .dividing-line {
      border: 1px solid #eeeeee;
      margin-bottom: 40px;
    }
    .check-point-list {
      font-family: 'SUIT';
      font-weight: 400;
      font-size: 15px;
      line-height: 160%;
      color: #1b1e24;
      margin-bottom: 150px;
      b {
        font-weight: 600;
        color: #5f44ff;
      }
    }
  }
`;

export default styles;
