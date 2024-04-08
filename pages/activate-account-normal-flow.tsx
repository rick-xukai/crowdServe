import React, { useEffect, useState, useRef } from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  message,
  Select,
  DatePicker,
  Drawer,
} from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CaretDownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  isPassword,
  getErrorMessage,
  base64Decrypt,
  generateRandomString,
  profileNameValidator,
  checkPhoneNumber,
} from '../utils/func';
import {
  TokenExpire,
  PasswordNotMatch,
  BirthdayNotVaild,
  RegisterVerifyType,
  VerificationCodeLength,
  ForgotPasswordAccountNotActivate,
  ActivateAccountFirst,
  AccountNotActivate,
  DefaultSelectCountry,
} from '../constants/General';
import { RouterKeys, CookieKeys, LocalStorageKeys } from '../constants/Keys';
import { LoginContainer } from '../styles/login-style';
import OpenAppComponent from '../components/openAppComponent';
import {
  selectData,
  loginAction,
  verificationCodeAction,
  selectError,
  selectLoading,
  reset,
  getUserGenderAction,
  selectUserGender,
  selectGetUserGenderLoading,
  selectLoginRedirectPage,
  resetLoginRedirectPage,
} from '../slice/user.slice';
import { resetTicketsCache } from '../slice/ticketsCache.slice';
import { resetTicketsListData } from '../slice/tickets.slice';
import { resetCrowdFundCache } from '../slice/crowdFundCache.slice';
import {
  resetEventCache,
  setEventDataForSearch,
} from '../slice/eventCache.slice';
import { resetMyTicketsCache } from '../slice/myTicketsCache.slice';
import { resetMyCollectiblesCache } from '../slice/myCollectiblesCache.slice';
import { resetCollectionDetailCache } from '../slice/collectionDetailCache.slice';
import AuthPageHearder from '@/components/authPageHearder';
import { resetMyRavesCache } from '@/slice/myRaves.slice';
import CountrySelecter from '@/components/countrySelecter';
import countryDataList from '@/utils/countrycode.data.json';
import { Images } from '@/theme';
import CountryCodePhoneNumber from '@/components/countryCodePhoneNumber';

const ActivateAccountNormalFlow = ({
  accountEmail,
  redirectPage,
  currentTicketEventSlug,
  ticketIdFormEmailLink,
}: {
  accountEmail: string;
  redirectPage: string;
  currentTicketEventSlug: string;
  ticketIdFormEmailLink: string;
}) => {
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
    CookieKeys.userLoginId,
    CookieKeys.userProfileInfo,
  ]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const inputRefs = useRef<any>({});

  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const getUserGenderLoading = useAppSelector(selectGetUserGenderLoading);
  const userGender = useAppSelector(selectUserGender);
  const loginRedirectPage = useAppSelector(selectLoginRedirectPage);

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(true);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('');
  const [verificationCodeSuccess, setVerificationCodeSuccess] =
    useState<boolean>(false);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [formatGenderData, setFormatGenderData] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const [activateAccountValue, setActivateAccountValue] = useState({
    email: accountEmail,
    code: '',
    password: '',
    birthday: '',
    genderId: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    phoneShortCode: '',
    country: DefaultSelectCountry,
  });
  const [showCountryItems, setShowCountryItems] = useState<boolean>(false);
  const [currentSelectCountry, setCurrentSelectCountry] =
    useState<string>(DefaultSelectCountry);
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [selectPhoneCode, setSelectPhoneCode] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [showPhoneCodeItems, setShowPhoneCodeItems] = useState<boolean>(false);
  const [phoneCodeItems, setPhoneCodeItems] = useState<any[]>([]);
  const [showPhoneShortCodeError, setShowPhoneShortCodeError] =
    useState<boolean>(false);

  const onFinishFailed = (error: any) => {
    const firstErrorField = error.errorFields[0];
    if (firstErrorField) {
      const { name } = firstErrorField;
      const inputElement = inputRefs.current[name[0]];
      if (inputElement) {
        inputElement.focus();
      }
    }
  };

  const onFinish = async (values: any) => {
    if (!verificationCodeSuccess) {
      const result = await dispatch(
        verificationCodeAction({
          ...values,
          email: activateAccountValue.email,
          type: RegisterVerifyType,
        })
      );
      if (result.type === verificationCodeAction.fulfilled.toString()) {
        setVerificationCodeSuccess(true);
      }
      return;
    }
    if (verificationCodeSuccess && !passwordSuccess) {
      if (activateAccountValue.password !== confirmPasswordValue) {
        setPasswordValue('');
        setConfirmPasswordValue('');
        setActivateAccountValue({
          ...activateAccountValue,
          password: '',
        });
        message.open({
          content: PasswordNotMatch,
          className: 'error-message-event',
        });
        return;
      } else {
        setPasswordSuccess(true);
      }
    }
    if (verificationCodeSuccess && passwordSuccess) {
      if (
        new Date(activateAccountValue.birthday).getTime() > new Date().getTime()
      ) {
        message.open({
          content: BirthdayNotVaild,
          className: 'error-message-event',
        });
        return;
      }
      if (
        !checkPhoneNumber(
          activateAccountValue.phoneNumber,
          activateAccountValue.phoneShortCode
        )
      ) {
        setPhoneNumberError(true);
        return;
      } else {
        setPhoneNumberError(false);
      }
      dispatch(
        loginAction({
          ...activateAccountValue,
          phoneNumber: `${selectPhoneCode}-${activateAccountValue.phoneNumber}`,
        })
      );
    }
  };

  const selectCountryCodeChange = (e: string) => {
    setShowPhoneShortCodeError(false);
    const country = e.split('-')[1];
    const phoneCode = e.split('-')[0];
    const countryCode = countryDataList.find(
      (item) => item.country === country
    );
    setActivateAccountValue({
      ...activateAccountValue,
      phoneShortCode: countryCode?.shortCode || '',
    });
    setSelectPhoneCode(phoneCode);
    setPhoneNumberError(false);
  };

  const countryCodePhoneNumberProps = {
    selectPhoneCode: selectPhoneCode,
    selectDefaultValue: null,
    selectCountryCodeChange: selectCountryCodeChange,
    setDrawerOpen: setDrawerOpen,
  };

  const handleResetPageCache = () => {
    dispatch(resetTicketsListData());
    dispatch(resetTicketsCache());
    dispatch(resetEventCache());
    dispatch(resetMyTicketsCache());
    dispatch(resetMyCollectiblesCache());
    dispatch(resetCollectionDetailCache());
    dispatch(resetCrowdFundCache());
    dispatch(setEventDataForSearch([]));
    dispatch(resetMyRavesCache());
  };

  useEffect(() => {
    setActivateAccountValue({
      ...activateAccountValue,
      country: currentSelectCountry,
    });
  }, [currentSelectCountry]);

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
      cookies.setCookie(CookieKeys.userLoginEmail, activateAccountValue.email, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      cookies.setCookie(CookieKeys.userLoginId, data.user.userId, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      cookies.setCookie(CookieKeys.userProfileInfo, data.user, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      localStorage.setItem(
        LocalStorageKeys.pageViewTrackKeys,
        generateRandomString()
      );
      handleResetPageCache();
      dispatch(resetLoginRedirectPage());
      if (ticketIdFormEmailLink && !currentTicketEventSlug) {
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
      } else {
        let currentRedirectPage = RouterKeys.eventList;
        if (redirectPage) {
          currentRedirectPage = redirectPage;
        } else if (loginRedirectPage) {
          currentRedirectPage = loginRedirectPage;
        }
        if (router.query.raves) {
          router.push({
            pathname: redirectPage || currentRedirectPage,
            query: `raves=${router.query.raves}`,
          });
        } else {
          router.push(redirectPage || currentRedirectPage);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    const { query } = router;
    if (query && !isEmpty(query)) {
      const { source, redirect, raves } = query;
      let currentSource = '';
      if (redirect && raves) {
        currentSource = (source as string) || '';
      } else {
        const parameters = base64Decrypt(Object.keys(query)[0]);
        currentSource = parameters.source;
      }
      if (currentSource && currentSource === ForgotPasswordAccountNotActivate) {
        message.open({
          content: ActivateAccountFirst,
          className: 'error-message-login',
        });
      } else {
        message.open({
          content: AccountNotActivate,
          className: 'error-message-login',
        });
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (error && !isFirstRender) {
      message.open({
        content: getErrorMessage(error.code),
        className: 'error-message-login',
      });
    }
  }, [error]);

  useEffect(() => {
    dispatch(getUserGenderAction());
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (!drawerOpen) {
      setPhoneCodeItems([]);
      setShowPhoneCodeItems(false);
    } else {
      const items = (selectPhoneCode &&
        countryDataList.filter((item) =>
          item.code.includes(selectPhoneCode)
        )) || [...countryDataList];
      setPhoneCodeItems(items);
      if (items.length) {
        setShowPhoneCodeItems(true);
      }
    }
  }, [drawerOpen]);

  return (
    <>
      {(getUserGenderLoading && (
        <LoginContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </LoginContainer>
      )) || (
        <LoginContainer
          className={
            (isOpenAppShow &&
              `${
                (showCountryItems && 'open-app-show country-items-index') ||
                'open-app-show'
              }`) ||
            ''
          }
        >
          <img
            className="page-background"
            src={Images.AnimatedBackground.src}
            alt=""
          />
          <AuthPageHearder
            skipClick={() => router.push(RouterKeys.eventList)}
          />
          <div className="page-main">
            <div
              className={
                (showCountryItems && 'main-form-content country-items-show') ||
                'main-form-content'
              }
            >
              <div>
                <Row className="main-title">
                  <Col span={24} className="title">
                    ACTIVATE YOUR ACCOUNT
                  </Col>
                </Row>
                {!verificationCodeSuccess && (
                  <>
                    <Row className="code-sent">
                      <Col span={24} className="title">
                        Verification code has been sent to
                      </Col>
                      <Col span={24} className="value">
                        {activateAccountValue.email}
                      </Col>
                    </Row>
                    <Form onFinish={onFinish}>
                      <Form.Item name="code">
                        <Input
                          className={`${
                            (activateAccountValue.code && 'border-white') || ''
                          }`}
                          placeholder="Enter verification code"
                          bordered={false}
                          onChange={(e) =>
                            setActivateAccountValue({
                              ...activateAccountValue,
                              code: e.target.value,
                            })
                          }
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          className="signin-btn"
                          disabled={
                            activateAccountValue.code.length <
                              VerificationCodeLength || loading
                          }
                          type="primary"
                          htmlType="submit"
                        >
                          NEXT
                        </Button>
                      </Form.Item>
                    </Form>
                  </>
                )}
                {verificationCodeSuccess && !passwordSuccess && (
                  <Form onFinish={onFinish}>
                    <Form.Item>
                      <Input.Password
                        value={passwordValue}
                        className={`${(passwordValue && 'border-white') || ''}`}
                        placeholder="Set your password (at least 8 characters)"
                        bordered={false}
                        maxLength={20}
                        iconRender={(visible) =>
                          visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                        }
                        onChange={(e) => {
                          setPasswordValue(e.target.value);
                          setActivateAccountValue({
                            ...activateAccountValue,
                            password:
                              (isPassword(e.target.value) && e.target.value) ||
                              '',
                          });
                        }}
                      />
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
                    <Form.Item>
                      <Button
                        className="signin-btn"
                        disabled={
                          !activateAccountValue.password ||
                          !isPassword(confirmPasswordValue)
                        }
                        type="primary"
                        htmlType="submit"
                      >
                        NEXT
                      </Button>
                    </Form.Item>
                  </Form>
                )}
                {verificationCodeSuccess && passwordSuccess && (
                  <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item
                      name="firstName"
                      rules={[{ validator: profileNameValidator }]}
                      getValueFromEvent={(e) => {
                        const { value } = e.target;
                        return value
                          .replace(/[0-9]/g, '')
                          .replace(/[^\w^\s^\u4e00-\u9fa5]/gi, '');
                      }}
                    >
                      <Input
                        ref={(input) => (inputRefs.current.firstName = input)}
                        className={`${
                          (activateAccountValue.firstName && 'border-white') ||
                          ''
                        }`}
                        placeholder="First name (at least 2 characters)"
                        maxLength={20}
                        bordered={false}
                        onChange={(e) =>
                          setActivateAccountValue({
                            ...activateAccountValue,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: 'Last name is required',
                        },
                      ]}
                      getValueFromEvent={(e) => {
                        const { value } = e.target;
                        return value
                          .replace(/[0-9]/g, '')
                          .replace(/[^\w^\s^\u4e00-\u9fa5]/gi, '');
                      }}
                    >
                      <Input
                        ref={(input) => (inputRefs.current.lastName = input)}
                        className={`${
                          (activateAccountValue.lastName && 'border-white') ||
                          ''
                        }`}
                        placeholder="Last name (at least 1 character)"
                        maxLength={20}
                        bordered={false}
                        onChange={(e) =>
                          setActivateAccountValue({
                            ...activateAccountValue,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                    <Row>
                      <Col xs={24} sm={0}>
                        <CountryCodePhoneNumber
                          isMobile
                          formItemClassName={
                            (phoneNumberError && 'phone-number-item error') ||
                            'phone-number-item'
                          }
                          inputOnChange={(value: string) => {
                            setPhoneNumberError(false);
                            setActivateAccountValue({
                              ...activateAccountValue,
                              phoneNumber: value,
                            });
                          }}
                          {...countryCodePhoneNumberProps}
                        />
                      </Col>
                      <Col xs={0} sm={24}>
                        <CountryCodePhoneNumber
                          isMobile={false}
                          formItemClassName={
                            (phoneNumberError && 'phone-number-item error') ||
                            'phone-number-item'
                          }
                          inputOnChange={(value: string) => {
                            setPhoneNumberError(false);
                            setActivateAccountValue({
                              ...activateAccountValue,
                              phoneNumber: value,
                            });
                          }}
                          {...countryCodePhoneNumberProps}
                        />
                      </Col>
                    </Row>
                    {showPhoneShortCodeError && (
                      <div
                        className="phone-number-error"
                        style={{
                          marginTop: '-5px',
                          marginBottom: '10px',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#ff4d4f',
                        }}
                      >
                        Country is required
                      </div>
                    )}
                    {phoneNumberError && (
                      <div className="phone-number-error">
                        Invalid phone number
                      </div>
                    )}
                    <Form.Item
                      name="genderId"
                      rules={[
                        {
                          required: true,
                          message: 'Sex is required',
                        },
                      ]}
                    >
                      <Select
                        popupClassName="gender-select-dropdown"
                        className={`${
                          (activateAccountValue.genderId &&
                            'gender-select border-white') ||
                          'gender-select'
                        }`}
                        defaultValue={undefined}
                        placeholder="Sex"
                        onChange={(e) =>
                          setActivateAccountValue({
                            ...activateAccountValue,
                            genderId: e || '',
                          })
                        }
                        options={formatGenderData}
                        suffixIcon={<CaretDownOutlined />}
                      />
                    </Form.Item>
                    <Form.Item
                      name="birthday"
                      rules={[
                        {
                          required: true,
                          message: 'Birthday is required',
                        },
                      ]}
                    >
                      <DatePicker
                        inputReadOnly
                        className={`${
                          (activateAccountValue.birthday && 'border-white') ||
                          ''
                        }`}
                        format="MMM DD, YYYY"
                        showToday={false}
                        popupClassName="birth-picker-dropdown"
                        allowClear={false}
                        placeholder="Date of Birth"
                        onChange={(_, dateString) =>
                          setActivateAccountValue({
                            ...activateAccountValue,
                            birthday: format(
                              new Date(dateString),
                              'yyyy-MM-dd'
                            ),
                          })
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      className="form-country"
                      style={{ marginBottom: 0 }}
                    >
                      <CountrySelecter
                        showCountryItems={showCountryItems}
                        currentCountry={activateAccountValue.country}
                        setShowCountryItems={setShowCountryItems}
                        setCurrentSelectCountry={setCurrentSelectCountry}
                      />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 25 }}>
                      <Button
                        className="signin-btn"
                        disabled={loading}
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                          if (
                            activateAccountValue.phoneNumber &&
                            !activateAccountValue.phoneShortCode
                          ) {
                            setShowPhoneShortCodeError(true);
                          }
                        }}
                      >
                        DONE
                        {loading && <LoadingOutlined />}
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </div>
              <div
                className={
                  (isOpenAppShow && 'page-bottom open-app') || 'page-bottom'
                }
              >
                <p className="registered">Already have an account?</p>
                <p
                  className="activate"
                  onClick={() => {
                    if (redirectPage || loginRedirectPage) {
                      router.push({
                        pathname: RouterKeys.login,
                        query: `redirect=${redirectPage || loginRedirectPage}`,
                      });
                    } else {
                      router.push(RouterKeys.login);
                    }
                  }}
                >
                  LOGIN
                </p>
              </div>
            </div>
          </div>
          <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
          <Drawer
            open={drawerOpen}
            placement="bottom"
            onClose={() => setDrawerOpen(false)}
            getContainer={false}
            rootClassName="phone-code-drawer"
            destroyOnClose
          >
            <Input
              defaultValue={selectPhoneCode}
              placeholder="Country"
              onChange={(e) => {
                const items = (e.target.value &&
                  countryDataList.filter(
                    (item) =>
                      item.code.includes(e.target.value) ||
                      item.country
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                  )) || [...countryDataList];
                setPhoneCodeItems(items);
                setShowPhoneCodeItems(true);
              }}
            />
            {(showPhoneCodeItems && phoneCodeItems.length && (
              <>
                {phoneCodeItems.map((item: any) => (
                  <div
                    key={`${item.code}-${item.country}`}
                    className="code-items"
                    onClick={() => {
                      selectCountryCodeChange(`${item.code}-${item.country}`);
                      setDrawerOpen(false);
                    }}
                  >
                    <span>{item.code}</span>
                    <span>{item.country}</span>
                  </div>
                ))}
              </>
            )) ||
              null}
          </Drawer>
        </LoginContainer>
      )}
    </>
  );
};

ActivateAccountNormalFlow.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let accountEmail = '';
  let currentTicketEventSlug = '';
  let ticketIdFormEmailLink = '';
  let redirectPage = '';
  try {
    if (!isEmpty(query)) {
      const { redirect, raves, email } = query;
      if (raves && redirect) {
        redirectPage = `${redirect}&raves=${raves}`;
        const { email: currentEmail } =
          base64Decrypt(email.replaceAll('=', '')) || {};
        accountEmail = currentEmail || '';
      } else {
        const parameters = base64Decrypt(Object.keys(query)[0]);
        currentTicketEventSlug = parameters.eventSlug;
        ticketIdFormEmailLink = parameters.ticketId;
        redirectPage = query.redirect || '';
        accountEmail = parameters.email;
      }
    }
  } catch (_) {}
  return {
    accountEmail,
    redirectPage,
    currentTicketEventSlug,
    ticketIdFormEmailLink,
  };
};

export default ActivateAccountNormalFlow;
