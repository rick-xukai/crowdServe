import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Checkbox,
  Select,
  DatePicker,
} from 'antd';
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  CaretDownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { CookieKeys, RouterKeys } from '../constants/Keys';
import {
  loginAction,
  selectError,
  selectLoading,
  selectData,
  reset,
  getUserGenderAction,
  selectUserGender,
  selectGetUserGenderLoading,
} from '../slice/user.slice';
import { isPassword, base64Decrypt, getErrorMessage } from '../utils/func';
import {
  TokenExpire,
  PrivacyPolicyLink,
  TermsConditionsLink,
  PasswordNotMatch,
  BirthdayNotVaild,
  DefaultSelectCountry,
} from '../constants/General';
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';
import AuthPageHearder from '@/components/authPageHearder';
import { ActivateAccountContainer } from '@/styles/activateAccount.style';
import countryDataList from '@/utils/countrycode.data.json';

const ActivateAccount = ({
  defultEmail,
  activateCode,
  currentTicketId,
  currentTicketEventSlug,
}: {
  defultEmail: string;
  activateCode: string;
  currentTicketId: string;
  currentTicketEventSlug: string;
}) => {
  const cookies = useCookie([CookieKeys.userLoginToken]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const data = useAppSelector(selectData);
  const getUserGenderLoading = useAppSelector(selectGetUserGenderLoading);
  const userGender = useAppSelector(selectUserGender);

  const [checked, setChecked] = useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isTextShak, setTextShak] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [googleDocLink, setGoogleDocLink] = useState<string>('');
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('');
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(false);
  const [formatCountryData, setFormatCountryData] = useState([]);
  const [formatGenderData, setFormatGenderData] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const [activateAccountFormValue, setActivateAccountFormValue] = useState<any>(
    {
      email: defultEmail,
      code: activateCode,
      password: '',
      birthday: '',
      genderId: '',
      country: DefaultSelectCountry,
    }
  );

  const onFinish = () => {
    if (checked) {
      if (activateAccountFormValue.password !== confirmPasswordValue) {
        setPasswordValue('');
        setConfirmPasswordValue('');
        setActivateAccountFormValue({
          ...activateAccountFormValue,
          password: '',
        });
        message.open({
          content: PasswordNotMatch,
          className: 'error-message-event',
        });
        return;
      }
      if (
        new Date(activateAccountFormValue.birthday).getTime() >
        new Date().getTime()
      ) {
        message.open({
          content: BirthdayNotVaild,
          className: 'error-message-event',
        });
        return;
      }
      dispatch(loginAction(activateAccountFormValue));
    } else {
      setTextShak(true);
    }
  };

  const getFormatCountryData = () => {
    const countryData: any = [];
    countryDataList.map((item) => {
      countryData.push({
        value: item.country,
        label: (
          <div className="country-items-content">
            <span className="country-flag">{item.flag}</span>
            <span>{item.country}</span>
          </div>
        ),
      });
    });
    setFormatCountryData(countryData);
  };

  useEffect(() => {
    if (userGender.length) {
      const genderOptions: any = [];
      userGender.forEach((item) => {
        genderOptions.push({
          value: item.id,
          label: item.label,
        });
      });
      setFormatGenderData(genderOptions);
    }
  }, [userGender]);

  useEffect(() => {
    if (data.token) {
      const currentDate = new Date();
      cookies.setCookie(CookieKeys.userLoginToken, data.token, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      cookies.setCookie(
        CookieKeys.userLoginEmail,
        activateAccountFormValue.email,
        {
          expires: new Date(currentDate.getTime() + TokenExpire),
          path: '/',
          domain: window.location.hostname,
        }
      );
      cookies.setCookie(
        CookieKeys.userLoginEmail,
        activateAccountFormValue.email,
        {
          expires: new Date(currentDate.getTime() + TokenExpire),
          path: '/',
          domain: window.location.hostname,
        }
      );
      if (currentTicketId && !currentTicketEventSlug) {
        router.push(RouterKeys.myTickets);
        return;
      }
      if (currentTicketEventSlug) {
        router.push(
          RouterKeys.myTicketsEventDetail.replace(
            ':slug',
            currentTicketEventSlug
          )
        );
        return;
      }
      router.push(RouterKeys.myTickets);
    }
  }, [data.token]);

  useEffect(() => {
    if (error && !isFirstRender) {
      message.open({
        content: getErrorMessage(error.code),
        className: 'error-message-login',
      });
    }
  }, [error]);

  useEffect(() => {
    getFormatCountryData();
    dispatch(getUserGenderAction());
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

  return (
    <>
      {(getUserGenderLoading && (
        <ActivateAccountContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </ActivateAccountContainer>
      )) || (
        <ActivateAccountContainer
          className={(isOpenAppShow && 'open-app-show') || ''}
        >
          <AuthPageHearder
            skipClick={() => router.push(RouterKeys.eventList)}
          />
          {(!checkGoogleDoc && (
            <div className="page-main">
              <div className="main-form-content">
                <div>
                  <Row className="main-title">
                    <Col span={24} className="title">
                      ACTIVATE YOUR ACCOUNT
                    </Col>
                  </Row>
                  <Form onFinish={onFinish}>
                    <div className="tips">Signup with</div>
                    <div className="tips signup-email">{defultEmail}</div>
                    {activateAccountFormValue.password && (
                      <div className="tips password">
                        Set your password (at least 8 characters)
                      </div>
                    )}
                    <Form.Item>
                      <div>
                        <Input.Password
                          value={passwordValue}
                          className={`${
                            (passwordValue && 'border-white') || ''
                          }`}
                          placeholder="Set your password (at least 8 characters)"
                          bordered={false}
                          maxLength={20}
                          iconRender={(visible) =>
                            visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                          }
                          onChange={(e) => {
                            setPasswordValue(e.target.value);
                            setActivateAccountFormValue({
                              ...activateAccountFormValue,
                              password: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </Form.Item>
                    <Form.Item>
                      <Input.Password
                        value={confirmPasswordValue}
                        className={`${
                          (confirmPasswordValue && 'border-white') || ''
                        }`}
                        iconRender={(visible) =>
                          visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                        }
                        placeholder="Confirm your password"
                        bordered={false}
                        maxLength={20}
                        onChange={(e) =>
                          setConfirmPasswordValue(e.target.value)
                        }
                      />
                    </Form.Item>
                    <Form.Item name="genderId">
                      <Select
                        popupClassName="gender-select-dropdown"
                        className={`${
                          (activateAccountFormValue.genderId &&
                            'gender-select border-white') ||
                          'gender-select'
                        }`}
                        defaultValue={undefined}
                        placeholder="Gender"
                        onChange={(e) =>
                          setActivateAccountFormValue({
                            ...activateAccountFormValue,
                            genderId: e,
                          })
                        }
                        options={formatGenderData}
                        suffixIcon={<CaretDownOutlined />}
                      />
                    </Form.Item>
                    <Form.Item name="birthday">
                      <DatePicker
                        inputReadOnly
                        className={`${
                          (activateAccountFormValue.birthday &&
                            'border-white') ||
                          ''
                        }`}
                        format="MMM DD, YYYY"
                        showToday={false}
                        popupClassName="birth-picker-dropdown"
                        allowClear={false}
                        placeholder="Date of Birth"
                        onChange={(_, dateString) =>
                          setActivateAccountFormValue({
                            ...activateAccountFormValue,
                            birthday: format(
                              new Date(dateString),
                              'yyyy-MM-dd'
                            ),
                          })
                        }
                      />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0 }}>
                      <Select
                        showSearch
                        popupClassName="gender-select-dropdown"
                        className={`${
                          (activateAccountFormValue.country &&
                            'gender-select country border-white') ||
                          'gender-select country'
                        }`}
                        defaultValue={DefaultSelectCountry}
                        placeholder="Select Country"
                        onChange={(e) =>
                          setActivateAccountFormValue({
                            ...activateAccountFormValue,
                            country: e || '',
                          })
                        }
                        options={formatCountryData}
                        suffixIcon={<CaretDownOutlined />}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        className="signin-btn"
                        disabled={
                          !isPassword(activateAccountFormValue.password) ||
                          !isPassword(confirmPasswordValue) ||
                          !activateAccountFormValue.email ||
                          !activateAccountFormValue.genderId ||
                          !activateAccountFormValue.birthday ||
                          loading
                        }
                        type="primary"
                        htmlType="submit"
                        onClick={() => setTextShak(false)}
                      >
                        ACTIVATE
                      </Button>
                    </Form.Item>
                    <Form.Item className={(isTextShak && 'text-shak') || ''}>
                      <div className="agreement-wrapper">
                        <Checkbox
                          className={`${
                            (!checked && 'checkbox-show-error') || ''
                          }`}
                          checked={checked}
                          onChange={(e) => setChecked(e.target.checked)}
                        />
                        <div style={{ marginLeft: 8 }}>
                          <span className="agreement-label">
                            I agree to CrowdServe{' '}
                            <span
                              className="agreement-label-action"
                              onClick={() => {
                                setGoogleDocLink(TermsConditionsLink);
                                setCheckGoogleDoc(true);
                              }}
                            >
                              Terms&Conditions
                            </span>
                            and{' '}
                            <span
                              className="agreement-label-action"
                              onClick={() => {
                                setGoogleDocLink(PrivacyPolicyLink);
                                setCheckGoogleDoc(true);
                              }}
                            >
                              Privacy Policy.
                            </span>
                          </span>
                        </div>
                      </div>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          )) || (
            <GoogleDocComponent
              docLink={googleDocLink}
              checkGoogleDoc={setCheckGoogleDoc}
            />
          )}
          <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
        </ActivateAccountContainer>
      )}
    </>
  );
};

ActivateAccount.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let defultEmail = '';
  let activateCode = '';
  let currentTicketId = '';
  let currentTicketEventSlug = '';
  try {
    const parameters = base64Decrypt(Object.keys(query)[0]);
    defultEmail = parameters.email;
    activateCode = parameters.code;
    currentTicketId = parameters.ticketId;
    currentTicketEventSlug = parameters.eventSlug;
  } catch (_) {}
  return { defultEmail, activateCode, currentTicketId, currentTicketEventSlug };
};

export default ActivateAccount;
