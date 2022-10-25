import styled from 'styled-components';
import { Colors } from '../theme';

const LandingPageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('../static/images/landing-page-background.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-left: 120px;
  padding-right: 120px;
  min-height: 100vh;
  .page-hearder {
    height: 90px;
    span {
      height: 100% !important;
    }
    .logo {
      width: 115px !important;
      height: 60px !important;
      min-width: 115px !important;
      min-height: 60px !important;
      right: unset !important;
    }
  }
  .page-content {
    display: flex;
    justify-content: space-between;
    .content-download {
      .download-left {
        padding-top: 70px;
      }
      .download-title {
        font-weight: 700;
        font-size: 72px;
        color: ${Colors.branding};
        margin-top: 0;
        margin-bottom: 0;
      }
      .red-line {
        margin-top: 36px;
        width: 60px;
        height: 1px;
        background: ${Colors.branding};
      }
      .download-description {
        margin-top: 36px;
        font-weight: 400;
        font-size: 20px;
        color: ${Colors.white};
        margin-bottom: 0;
      }
      .download-link {
        margin-top: 70px;
        a {
          margin-right: 16px !important;
        }
      }
    }
  }
  @media (max-width: 1024px) {
    padding-left: 0px;
    padding-right: 0px;
    .page-hearder {
      padding-left: 50px;
      padding-right: 50px;
    }
    .page-content {
      margin-top: 65px;
      display: block;
      text-align: center;
      .content-download {
        .red-line {
          margin: auto;
        }
        .download-left {
          padding-top: 0;
        }
        .download-title {
          margin-bottom: 26px;
        }
        .download-description {
          br {
            display: none;
          }
        }
        .download-link {
          margin-top: 50px;
        }
      }
      .content-detail {
        margin-top: 75px;
      }
    }
  }
  @media (max-width: 768px) {
    .page-hearder {
      height: 60px;
      padding-left: 12px;
      padding-right: 12px;
      .logo {
        width: 77px !important;
        height: 40px !important;
        min-width: 77px !important;
        min-height: 40px !important;
      }
    }
    .page-content {
      margin-top: 15px;
      padding: 10px 25px;
      .content-download {
        .download-title {
          font-size: 36px;
          margin-bottom: 15px;
        }
        .download-description {
          margin-top: 15px;
          font-size: 16px;
        }
        .download-link {
          margin-top: 22px;
          padding-left: 19px;
          padding-right: 19px;
          > :last-child {
            margin-right: 0 !important;
          }
          .app-store,
          .google-play {
            height: 40px !important;
            min-height: 40px !important;
          }
          .app-store {
            width: 120px !important;
            min-width: 120px !important;
          }
          .google-play {
            width: 134px !important;
            min-width: 134px !important;
          }
        }
      }
      .content-detail {
        margin-top: 25px;
        .phone-detail {
          width: 295px !important;
          height: 362px !important;
          min-width: 295px !important;
          min-height: 362px !important;
        }
      }
    }
  }
  @media (max-width: 414px) {
    .download-link {
      display: flex;
      justify-content: space-between;
    }
  }
`;

export { LandingPageContainer };
