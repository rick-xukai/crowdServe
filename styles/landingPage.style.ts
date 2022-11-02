import styled from 'styled-components';
import { Colors } from '../theme';

const LandingPageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('../static/images/landing-page-background.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  .page-header {
    max-width: 1140px;
    margin: auto;
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
    max-width: 1140px;
    margin: auto;
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
          margin-right: 16px;
        }
        .google-play-link {
          width: 168px;
          height: 50px;
          display: inline-block;
          span, img {
            height: 100% !important;
          }
        }
        .google-play {
          width: 168px !important;
          min-width: 168px !important;
        }
      }
    }
    .content-detail {
      height: 580px;
      span, img {
        height: 100% !important;
      }
      .phone-detail {
        width: 462px !important;
        min-width: 462px !important;
      }
    }
  }
  @media(min-width: 1140px) {
    .page-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 1140px;
      max-width: 1140px;
    }
  }
  @media (max-width: 1024px) {
    padding-left: 0;
    padding-right: 0;
    .page-header {
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
    .page-header {
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
        }
      }
      .content-detail {
        margin-top: 25px;
      }
    }
  }
  @media (max-width: 414px) {
    .page-content {
      .content-detail {
        height: 363px !important;
        .phone-detail {
          width: 290px !important;
          min-width: 290px !important;
        }
      }
      .content-download {
        .download-description {
          margin-bottom: 20px;
        }
        .download-link {
          max-width: 275px;
          margin: auto;
          padding-left: 0;
          padding-right: 0;
          display: flex;
          justify-content: space-between;
          a {
            width: 134px;
            height: 40px;
            margin-right: 0;
          }
          .google-play-link {
            width: 134px;
            height: 40px;
            margin-top: 2px;
          }
          .app-store {
            width: 120px !important;
            min-width: 120px !important;
            height: 40px !important;
            min-height: 40px !important;
          }
          .google-play {
            width: 134px !important;
            min-width: 134px !important;
          }
        }
      }
    }
  }
`;

export { LandingPageContainer };
