import CryptoJS from 'crypto-js';
import { format } from 'date-fns';
import {
  LineController,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Filler,
  Chart,
  ChartTypeRegistry,
  Tooltip,
  Legend,
} from 'chart.js';
import _ from 'lodash';
import { getAnalytics, logEvent } from 'firebase/analytics';
import Compressor from 'compressorjs';
import libphonenumber from 'google-libphonenumber';

import Messages from '../constants/Messages';
import { Colors } from '../theme';
import {
  Encrypt,
  TicketStatus,
  GooglePlayLink,
  AppHost,
  PriceUnit,
  FormatTimeKeys,
  UploadUserAvatarAccept,
  CompressorConvertSize,
} from '../constants/General';
import firebaseApp from '@/firebase';

Chart.register(
  LineController,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY as string;

export const verificationApi = (response: any) =>
  response.code === 200 && response.message === 'OK';

export const qs = <T extends { [k: string]: string | boolean }>(
  search: string = globalThis.location
    ? globalThis.location.search.slice(1)
    : ''
): Partial<T> =>
  search
    .split('&')
    .filter(Boolean)
    .reduce<any>((o, keyValue) => {
      const [key, value] = keyValue.split('=');

      if (value === undefined) o[key] = true;
      else o[key] = value;

      return o;
    }, {});

export const dataEncryption = (data: any, type: string) => {
  let formatData = '{}';
  try {
    if (type === Encrypt) {
      formatData = CryptoJS.AES.encrypt(data, encryptionKey).toString();
    } else {
      formatData = CryptoJS.AES.decrypt(data, encryptionKey).toString(
        CryptoJS.enc.Utf8
      );
    }
  } catch (_) {}
  return formatData;
};

export const formatTimeStrByTimeString = (
  timeString: string,
  formatType: string
) => {
  try {
    if (timeString) {
      if (timeString.includes('T')) {
        const formatTimeString = timeString.split('T')[0];
        return format(
          new Date(formatTimeString.replace(/-/g, '/')),
          formatType
        );
      }
      return format(new Date(timeString.replace(/-/g, '/')), formatType);
    }
  } catch (_) {}
  return '-';
};

export const checkStatusIcon = (key: number) =>
  TicketStatus.find((item) => item.key === key)?.icon;

export const isEmail = (value: string) =>
  /* eslint-disable max-len */
  /* eslint-disable no-useless-escape */
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{1,1})+([^<>()\.,;:\s@\"]{2,}))$/.test(
    value
  );

export const isPassword = (value: string) =>
  /* eslint-disable max-len */
  /* eslint-disable no-useless-escape */
  /^\S*(?=\S{8,})\S*$/.test(value);

export const isUserName = (value: string) =>
  /* eslint-disable max-len */
  /* eslint-disable no-useless-escape */
  /^[a-zA-Z0-9\s]+$/.test(value);

export const getErrorMessage = (errorCode: number | undefined | string) => {
  let errorMessage = Messages.notFound.text;
  if (errorCode) {
    Object.values(Messages).forEach((item) => {
      if (errorCode === item.code) {
        errorMessage = item.text;
      }
    });
  }
  return errorMessage;
};

export const openApp = () => {
  const CallApp = require('callapp-lib');
  const options: any = {
    scheme: {
      protocol: process.env.NEXT_PUBLIC_APP_DEEP_LINK_PROTOCOL,
      host: AppHost,
    },
    intent: {
      package: process.env.NEXT_PUBLIC_APP_PACKAGE_NAME_ANDROID,
      scheme: process.env.NEXT_PUBLIC_APP_DEEP_LINK_PROTOCOL,
    },
    fallback: GooglePlayLink,
  };
  const callLib = new CallApp(options);
  callLib.open({ path: '' });
};

export const base64Decrypt = (code: string) => {
  try {
    const parsedWordArray = CryptoJS.enc.Base64.parse(code);
    const parsedStr = parsedWordArray.toString(CryptoJS.enc.Utf8);
    return JSON.parse(parsedStr);
  } catch (error) {
    return '';
  }
};

export const base64Encrypt = (parameters: {}) => {
  try {
    const wordArray = CryptoJS.enc.Utf8.parse(JSON.stringify(parameters));
    return CryptoJS.enc.Base64.stringify(wordArray);
  } catch (error) {
    return '';
  }
};

export const toPercent = (num: number, total: number) =>
  Math.round((num / total) * 10000) / 100;

export const getTimeDifference = (dateString: string) => {
  const currentTimeStamp = new Date().getTime();
  const targetTimeStamp = new Date(dateString).getTime();
  const difference = targetTimeStamp - currentTimeStamp;
  if (difference > 0) {
    return {
      days: Math.floor(difference / (24 * 3600 * 1000)),
      hours: Math.floor((difference % (24 * 3600 * 1000)) / (3600 * 1000)),
    };
  }
  return {
    days: 0,
    hours: 0,
  };
};

export const formatChartLabelDate = (value: string) =>
  value.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3');

export const bodyOverflow = (status: string) => {
  try {
    document.body.style.overflow = status;
  } catch (_) {}
};

export const loadChart = (
  ctx: any,
  labels: string[],
  data: number[],
  type: keyof ChartTypeRegistry
) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(11, 255, 255, 0.3)');
  gradient.addColorStop(0.5, 'rgba(11, 255, 255, 0.1)');
  gradient.addColorStop(1, 'rgba(11, 255, 255, 0)');
  let pointSize = 3;
  let hoverPointSize = 5;
  let maxValue: number | undefined = undefined;
  if (window.innerWidth <= 576) {
    pointSize = 4;
    hoverPointSize = 6;
  }
  if (_.max(data) !== 0) {
    maxValue = _.max(data);
  }
  new Chart(ctx, {
    type,
    data: {
      labels,
      datasets: [
        {
          data,
          fill: true,
          borderColor: Colors.chartBg,
          backgroundColor: gradient,
        },
      ],
    },
    options: {
      clip: false,
      elements: {
        point: {
          radius: pointSize,
          hoverRadius: hoverPointSize,
        },
      },
      scales: {
        x: {
          ticks: {
            color: Colors.grayScale40,
            font: {
              size: 12,
              weight: '300',
            },
          },
          grid: {
            display: false,
          },
        },
        y: {
          max: maxValue,
          min: 0,
          beginAtZero: false,
          ticks: {
            color: Colors.grayScale40,
            font: {
              size: 12,
              weight: '300',
            },
            autoSkip: false,
          },
          grid: {
            color: Colors.grayScale90,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
          intersect: false,
          external: function (context) {
            let tooltipEl = document.getElementById('chartjs-tooltip');
            if (!tooltipEl) {
              tooltipEl = document.createElement('div');
              tooltipEl.id = 'chartjs-tooltip';
              tooltipEl.innerHTML = '<table></table>';
              document.body.appendChild(tooltipEl);
            }
            const tooltipModel: any = context.tooltip;
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = '0';
              return;
            }
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
              tooltipEl.classList.add('no-transform');
            }
            function getBody(bodyItem: any) {
              return bodyItem.lines;
            }
            if (tooltipModel.body) {
              const titleLines = tooltipModel.title || [];
              const bodyLines = tooltipModel.body.map(getBody);
              let innerHtml = '<thead>';
              titleLines.forEach(function (title: string) {
                innerHtml += `<tr><th>${title}</th></tr>`;
              });
              innerHtml += '</thead><tbody>';
              bodyLines.forEach(function (body: string[]) {
                let value = '';
                if (body.length) {
                  value = `${body[0]} ${PriceUnit}`;
                }
                const span = `<span>${value}</span>`;
                innerHtml += `<tr><td>${span}</td></tr>`;
              });
              innerHtml += '</tbody>';
              let tableRoot: any = tooltipEl.querySelector('table');
              tableRoot.innerHTML = innerHtml;
            }
            const position = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.opacity = '1';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.left = `${
              position.left + window.pageXOffset + tooltipModel.caretX - 40
            }px`;
            tooltipEl.style.top = `${
              position.top + window.pageYOffset + tooltipModel.caretY - 10
            }px`;
            tooltipEl.style.padding = `${tooltipModel.padding}px ${tooltipModel.padding}px`;
            tooltipEl.style.pointerEvents = 'none';
          },
        },
      },
      responsive: true,
    },
  });
};

export const formatLocation = (location: string, address: string) => {
  if (location && address) {
    return `${location}, ${address}`;
  }
  if (location && !address) {
    return location;
  }
  return '-';
};

export const formatDescription = (text: string) =>
  (text && text.replaceAll('\n', '<br />')) || '';

export const checkOperatingSys = () => {
  const userAgent = navigator.userAgent;
  let operatingSys = '';
  if (userAgent.indexOf('Windows NT 10.0') !== -1) {
    operatingSys = 'Windows 10';
  } else if (userAgent.indexOf('Windows NT 6.2') !== -1) {
    operatingSys = 'Windows 8';
  } else if (userAgent.indexOf('Windows NT 6.1') !== -1) {
    operatingSys = 'Windows 7';
  } else if (userAgent.indexOf('Windows NT 6.0') !== -1) {
    operatingSys = 'Windows Vista';
  } else if (userAgent.indexOf('Windows NT 5.1') !== -1) {
    operatingSys = 'Windows XP';
  } else if (userAgent.indexOf('Mac') !== -1) {
    operatingSys = 'Mac OS';
  } else if (userAgent.indexOf('X11') !== -1) {
    operatingSys = 'Unix';
  } else if (userAgent.indexOf('Linux') !== -1) {
    operatingSys = 'Linux';
  }
  return operatingSys;
};

export const generateRandomString = () => {
  const wordArray = CryptoJS.lib.WordArray.random(8);
  const randomString = CryptoJS.enc.Hex.stringify(wordArray);
  return randomString;
};

export const generateRandomLetters = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result.split('');
};

export const firebaseTrackMethod = (eventName: string, payload: any) => {
  const analytics = getAnalytics(firebaseApp);
  logEvent(analytics, eventName, {
    ...payload,
    webTimestamp: format(new Date(), FormatTimeKeys.norm),
  });
};

export const profileNameValidator = (_: object, value: string) => {
  if (!value) {
    return Promise.reject(new Error('First name is required'));
  }
  if (value.length < 2) {
    return Promise.reject(new Error('Must be greater than two characters'));
  }
  return Promise.resolve();
};

export const compressorImage = (compressorFile: File, qualitySize: number) => {
  return new Promise((resolve) => {
    new Compressor(compressorFile, {
      quality: qualitySize,
      convertTypes: UploadUserAvatarAccept,
      convertSize: CompressorConvertSize,
      success(result) {
        resolve(result);
      },
      error() {
        resolve(compressorFile);
      },
    });
  });
};

export const checkPhoneNumber = (phoneNumber: string, countryCode: string) => {
  const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
  const number = phoneUtil.parseAndKeepRawInput(phoneNumber, countryCode);
  return phoneUtil.isValidNumber(number);
};

export const verificationCodeValidator = (_: object, value: string) => {
  if (value.length < 6) {
    return Promise.reject(new Error('Invalid code'));
  }
  return Promise.resolve();
};

export const emailValidator = (_: object, value: string) => {
  if (!value) {
    return Promise.reject(new Error('Email is required'));
  }
  if (!isEmail(value)) {
    return Promise.reject(new Error('Please enter a valid email address'));
  }
  return Promise.resolve();
};

export const passwordValidator = (_: object, value: string) => {
  if (!value) {
    return Promise.reject(new Error('Password is required'));
  }
  if (value.length < 8) {
    return Promise.reject(new Error('Must be greater than eight characters'));
  }
  return Promise.resolve();
};