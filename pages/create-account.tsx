import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
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
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  isEmail,
  isPassword,
  getErrorMessage,
  base64Encrypt,
  isUserName,
} from '../utils/func';
import {
  TermsConditionsLink,
  PrivacyPolicyLink,
  TokenExpire,
  PasswordNotMatch,
  BirthdayNotVaild,
  RegisterVerifyType,
  DefaultSelectCountry,
  CountryItemProps,
  VerificationCodeLength,
} from '../constants/General';
import { RouterKeys, CookieKeys } from '../constants/Keys';
import { LoginContainer } from '../styles/login-style';
import {
  reset,
  selectData,
  selectError,
  selectLoading,
  verifyUserAction,
  registerAccountAction,
  RegisterAccountPayload,
  verificationCodeAction,
  getUserGenderAction,
  selectUserGender,
  selectGetUserGenderLoading,
} from '../slice/user.slice';
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';
// import GoogleLoginComponent from '../components/googleLoginComponent';
import Messages from '../constants/Messages';
import AuthPageHearder from '@/components/authPageHearder';
import countryDataList from '@/utils/countrycode.data.json';

const CreateAccount = () => {
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
  const [checked, setChecked] = useState<boolean>(false);
  const [isTextShak, setTextShak] = useState<boolean>(false);
  const [checkGoogleDoc, setCheckGoogleDoc] = useState<boolean>(false);
  const [googleDocLink, setgoogleDocLink] = useState<string>('');
  const [isVerificationEmail, setIsVerificationEmail] =
    useState<boolean>(false);
  const [isVerificationCode, setIsVerificationCode] = useState<boolean>(false);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>('');
  const [formatGenderData, setFormatGenderData] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);
  const [createAccountValue, setCreateAccountValue] =
    useState<RegisterAccountPayload>({
      email: '',
      username: '',
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
    if (!isVerificationEmail) {
      if (checked) {
        const result = await dispatch(
          verifyUserAction({ email: createAccountValue.email })
        );
        if (result.type === verifyUserAction.fulfilled.toString()) {
          router.push(
            `${RouterKeys.activateAccountNormalFlow}?${base64Encrypt({
              email: createAccountValue.email,
            })}`
          );
        }
      } else {
        setTextShak(true);
      }
      return;
    }
    if (!isVerificationCode) {
      const result = await dispatch(
        verificationCodeAction({
          ...values,
          email: createAccountValue.email,
          type: RegisterVerifyType,
        })
      );
      if (result.type === verificationCodeAction.fulfilled.toString()) {
        setIsVerificationCode(true);
      }
      return;
    }
    if (isVerificationEmail && isVerificationCode) {
      if (createAccountValue.password !== confirmPasswordValue) {
        setPasswordValue('');
        setConfirmPasswordValue('');
        setCreateAccountValue({
          ...createAccountValue,
          password: '',
        });
        message.open({
          content: PasswordNotMatch,
          className: 'error-message-event',
        });
        return;
      }
      if (
        new Date(createAccountValue.birthday).getTime() > new Date().getTime()
      ) {
        message.open({
          content: BirthdayNotVaild,
          className: 'error-message-event',
        });
        return;
      }
      dispatch(registerAccountAction(createAccountValue));
    }
  };

  const checkGoogleDocAction = (link: string) => {
    setCheckGoogleDoc(true);
    setgoogleDocLink(link);
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
      cookies.setCookie(CookieKeys.userLoginEmail, createAccountValue.email, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      router.push(RouterKeys.eventList);
    }
  }, [data]);

  useEffect(() => {
    if (!isFirstRender && error) {
      if (error.code === Messages.continueToRegister.code) {
        setIsVerificationEmail(true);
      } else {
        message.open({
          content:
            (error.code === Messages.activateAccountUserAlreadyExist.code &&
              'This email address is already registered. Please log in or use a different email address.') ||
            getErrorMessage(error.code),
          className: 'error-message-login',
        });
      }
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
          style={{ paddingBottom: showCountryItems ? '100vh' : '' }}
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
          {(!checkGoogleDoc && (
            <div className="page-main">
              <div
                className={
                  (showCountryItems &&
                    'main-form-content country-items-show') ||
                  'main-form-content'
                }
              >
                <div>
                  <Row className="main-title">
                    <Col span={24} className="title">
                      CREATE AN ACCOUNT
                    </Col>
                  </Row>
                  {!isVerificationEmail && (
                    <Form onFinish={onFinish}>
                      <Form.Item name="email">
                        <Input
                          className={`${
                            (createAccountValue.email && 'border-white') || ''
                          }`}
                          placeholder="Email"
                          bordered={false}
                          onChange={(e) =>
                            setCreateAccountValue({
                              ...createAccountValue,
                              email:
                                (isEmail(e.target.value) && e.target.value) ||
                                '',
                            })
                          }
                        />
                      </Form.Item>
                      <Form.Item>
                        <Input
                          className={`${
                            (createAccountValue.username && 'border-white') ||
                            ''
                          }`}
                          placeholder="User name (at least 3 chars)"
                          value={createAccountValue.username}
                          maxLength={20}
                          bordered={false}
                          onChange={(e) =>
                            setCreateAccountValue({
                              ...createAccountValue,
                              username: e.target.value.replace(
                                /[^a-zA-Z0-9\s]/g,
                                ''
                              ),
                            })
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        className={(isTextShak && 'text-shak') || ''}
                      >
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
                                onClick={() =>
                                  checkGoogleDocAction(TermsConditionsLink)
                                }
                              >
                                Terms&Conditions
                              </span>
                              and{' '}
                              <span
                                className="agreement-label-action"
                                onClick={() =>
                                  checkGoogleDocAction(PrivacyPolicyLink)
                                }
                              >
                                Privacy Policy.
                              </span>
                            </span>
                          </div>
                        </div>
                      </Form.Item>
                      <Form.Item>
                        <Button
                          className="signin-btn"
                          disabled={
                            !createAccountValue.email ||
                            loading ||
                            !isUserName(createAccountValue.username) ||
                            createAccountValue.username.length < 3
                          }
                          type="primary"
                          htmlType="submit"
                          onClick={() => setTextShak(false)}
                        >
                          CONTINUE
                        </Button>
                      </Form.Item>
                      {/* <Divider>OR</Divider>
                <GoogleLoginComponent buttonText="CONTINUE WITH GOOGLE" /> */}
                    </Form>
                  )}
                  {!isVerificationCode && isVerificationEmail && (
                    <>
                      <Row className="code-sent">
                        <Col span={24} className="title">
                          Verification code has been sent to
                        </Col>
                        <Col span={24} className="value">
                          {createAccountValue.email}
                        </Col>
                      </Row>
                      <Form onFinish={onFinish}>
                        <Form.Item name="code">
                          <Input
                            className={`${
                              (createAccountValue.code && "border-white") || ""
                            }`}
                            placeholder="Enter verification code"
                            bordered={false}
                            onChange={(e) =>
                              setCreateAccountValue({
                                ...createAccountValue,
                                code: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button
                            className="signin-btn"
                            disabled={
                              createAccountValue.code.length <
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
                  {isVerificationCode && isVerificationEmail && (
                    <Form onFinish={onFinish}>
                      <Form.Item>
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
                            setCreateAccountValue({
                              ...createAccountValue,
                              password:
                                (isPassword(e.target.value) &&
                                  e.target.value) ||
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
                            (createAccountValue.genderId &&
                              'gender-select border-white') ||
                            'gender-select'
                          }`}
                          defaultValue={undefined}
                          placeholder="Gender"
                          onChange={(e) =>
                            setCreateAccountValue({
                              ...createAccountValue,
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
                            (createAccountValue.birthday && 'border-white') ||
                            ''
                          }`}
                          format="MMM DD, YYYY"
                          showToday={false}
                          popupClassName="birth-picker-dropdown"
                          allowClear={false}
                          placeholder="Date of Birth"
                          onChange={(_, dateString) =>
                            setCreateAccountValue({
                              ...createAccountValue,
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
                            onClick={() =>
                              setShowCountryItems(!showCountryItems)
                            }
                          >
                            <div className="content">
                              <span className="country-flag">
                                {countryDataList.find(
                                  (item) =>
                                    item.country === createAccountValue.country
                                )?.flag || ''}
                              </span>
                              <span className="country-name">
                                {
                                  countryDataList.find(
                                    (item) =>
                                      item.country ===
                                      createAccountValue.country
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
                                sortCountryList.map(
                                  (item: CountryItemProps) => (
                                    <div
                                      key={`${item.code}-${item.country}`}
                                      className="content"
                                      onClick={() => {
                                        setShowCountryItems(false);
                                        setCreateAccountValue({
                                          ...createAccountValue,
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
                                  )
                                )) || (
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
                      <Form.Item>
                        <Button
                          className="signin-btn"
                          disabled={
                            !isPassword(confirmPasswordValue) ||
                            !createAccountValue.password ||
                            !createAccountValue.birthday ||
                            !createAccountValue.genderId ||
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
          )) || (
            <GoogleDocComponent
              docLink={googleDocLink}
              checkGoogleDoc={setCheckGoogleDoc}
            />
          )}
          <OpenAppComponent setIsOpenAppShow={setIsOpenAppShow} />
        </LoginContainer>
      )}
    </>
  );
};

export default CreateAccount;
