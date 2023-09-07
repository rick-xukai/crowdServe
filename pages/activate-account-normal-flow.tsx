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
} from 'antd';
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CaretDownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import { isEmpty, cloneDeep } from 'lodash';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { isPassword, getErrorMessage, base64Decrypt } from '../utils/func';
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
  CountryItemProps,
} from '../constants/General';
import { RouterKeys, CookieKeys } from '../constants/Keys';
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
} from '../slice/user.slice';
import AuthPageHearder from '@/components/authPageHearder';
import countryDataList from '@/utils/countrycode.data.json';

const ActivateAccountNormalFlow = ({
  accountEmail,
}: {
  accountEmail: string;
}) => {
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userLoginEmail,
  ]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const countryListSelect = useRef<any>(null);
  const searchInputSelect = useRef<any>(null);

  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const getUserGenderLoading = useAppSelector(selectGetUserGenderLoading);
  const userGender = useAppSelector(selectUserGender);

  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [isOpenAppShow, setIsOpenAppShow] = useState<boolean>(true);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('');
  const [verificationCodeSuccess, setVerificationCodeSuccess] =
    useState<boolean>(false);
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
    country: DefaultSelectCountry,
  });
  const [sortCountryList, setSortCountryList] = useState<CountryItemProps[]>(
    []
  );
  const [showCountryItems, setShowCountryItems] = useState<boolean>(false);

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
    if (verificationCodeSuccess) {
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
      }
      if (
        new Date(activateAccountValue.birthday).getTime() > new Date().getTime()
      ) {
        message.open({
          content: BirthdayNotVaild,
          className: 'error-message-event',
        });
        return;
      }
      dispatch(loginAction(activateAccountValue));
    }
  };

  const sortData = (list: CountryItemProps[]) => {
    const listSort: CountryItemProps[] = cloneDeep(list).sort(
      (x: CountryItemProps, y: CountryItemProps) =>
        x.country.localeCompare(y.country)
    );
    return listSort;
  };

  const searchCountryOnChange = (e: string) => {
    const searchItems: CountryItemProps[] = [];
    countryDataList.map((item: CountryItemProps) => {
      if (item.country.toLowerCase().includes(e)) {
        searchItems.push(item);
      }
    });
    setSortCountryList(sortData(searchItems));
  };

  const clickCallback = (e: any) => {
    if (
      countryListSelect.current.contains(e.target) ||
      searchInputSelect.current.contains(e.target)
    ) {
      return;
    }
    setShowCountryItems(false);
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
      cookies.setCookie(CookieKeys.userLoginEmail, activateAccountValue.email, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      router.push(RouterKeys.myTickets);
    }
  }, [data]);

  useEffect(() => {
    const { query } = router;
    if (query && !isEmpty(query)) {
      const parameters = base64Decrypt(Object.keys(query)[0]);
      if (parameters.source) {
        if (parameters.source === ForgotPasswordAccountNotActivate) {
          message.open({
            content: ActivateAccountFirst,
            className: 'error-message-login',
          });
        }
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
    if (!showCountryItems) {
      setSortCountryList(sortData(countryDataList));
    } else {
      document.addEventListener('click', clickCallback, false);
    }
    return () => {
      document.removeEventListener('click', clickCallback, false);
    };
  }, [showCountryItems]);

  useEffect(() => {
    dispatch(getUserGenderAction());
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
    };
  }, []);

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
                {verificationCodeSuccess && (
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
                    <Form.Item name="genderId">
                      <Select
                        popupClassName="gender-select-dropdown"
                        className={`${
                          (activateAccountValue.genderId &&
                            'gender-select border-white') ||
                          'gender-select'
                        }`}
                        defaultValue={undefined}
                        placeholder="Gender"
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
                    <Form.Item name="birthday">
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
                      <>
                        <div
                          ref={countryListSelect}
                          className="search-select-country"
                          onClick={() => setShowCountryItems(!showCountryItems)}
                        >
                          <div className="content">
                            <span className="country-flag">
                              {countryDataList.find(
                                (item) =>
                                  item.country === activateAccountValue.country
                              )?.flag || ''}
                            </span>
                            <span className="country-name">
                              {
                                countryDataList.find(
                                  (item) =>
                                    item.country ===
                                    activateAccountValue.country
                                )?.country
                              }
                            </span>
                          </div>
                          <CaretDownOutlined />
                        </div>
                        {showCountryItems && (
                          <div className="country-items">
                            <div
                              ref={searchInputSelect}
                              className="search-input-content"
                            >
                              <Input
                                placeholder="Search country"
                                onChange={(e) => {
                                  searchCountryOnChange(
                                    e.target.value.toLowerCase()
                                  );
                                }}
                              />
                            </div>
                            {(sortCountryList.length &&
                              sortCountryList.map((item: CountryItemProps) => (
                                <div
                                  key={`${item.code}-${item.country}`}
                                  className="content"
                                  onClick={() => {
                                    setShowCountryItems(false);
                                    setActivateAccountValue({
                                      ...activateAccountValue,
                                      country: item.country,
                                    });
                                  }}
                                >
                                  <span className="country-flag">
                                    {item.flag}
                                  </span>
                                  <span className="country-name">
                                    {item.country}
                                  </span>
                                </div>
                              ))) || (
                              <div className="content no-data">
                                <span className="country-name">
                                  No data found
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 25 }}>
                      <Button
                        className="signin-btn"
                        disabled={
                          !activateAccountValue.password ||
                          !isPassword(confirmPasswordValue) ||
                          !activateAccountValue.birthday ||
                          !activateAccountValue.genderId ||
                          loading
                        }
                        type="primary"
                        htmlType="submit"
                      >
                        DONE
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
                  onClick={() => router.push(RouterKeys.login)}
                >
                  LOGIN
                </p>
              </div>
            </div>
          </div>
          <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
        </LoginContainer>
      )}
    </>
  );
};

ActivateAccountNormalFlow.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let accountEmail = '';
  try {
    const parameters = base64Decrypt(Object.keys(query)[0]);
    accountEmail = parameters.email;
  } catch (_) {}
  return { accountEmail };
};

export default ActivateAccountNormalFlow;
