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
  Drawer,
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
  verificationCodeAction,
} from '../slice/user.slice';
import { verifyUserAction } from '../slice/user.slice';
import {
  isPassword,
  base64Decrypt,
  getErrorMessage,
  profileNameValidator,
  checkPhoneNumber,
  verificationCodeValidator,
  passwordValidator,
} from '../utils/func';
import {
  TokenExpire,
  PrivacyPolicyLink,
  TermsConditionsLink,
  PasswordNotMatch,
  BirthdayNotVaild,
  DefaultSelectCountry,
  CodeExpired,
} from '../constants/General';
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';
import AuthPageHearder from '@/components/authPageHearder';
import { ActivateAccountContainer } from '@/styles/activateAccount.style';
import CountrySelecter from '@/components/countrySelecter';
import countryDataList from '@/utils/countrycode.data.json';
import { Images } from '@/theme';
import CountryCodePhoneNumber from '@/components/countryCodePhoneNumber';

let timer: NodeJS.Timer | null = null;

const ActivateAccount = ({
  redirectPage,
  defultEmail,
  activateCode,
  currentTicketId,
  currentTicketEventSlug,
  codeStatusExpired,
}: {
  redirectPage: string;
  defultEmail: string;
  activateCode: string;
  currentTicketId: string;
  currentTicketEventSlug: string;
  codeStatusExpired: boolean;
}) => {
  const cookies = useCookie([
    CookieKeys.userLoginToken,
    CookieKeys.userProfileInfo,
  ]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const inputRefs = useRef<any>({});
  const formRef = useRef<any>(null);

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
  const [currentSelectCountry, setCurrentSelectCountry] =
    useState<string>(DefaultSelectCountry);
  const [showCountryItems, setShowCountryItems] = useState<boolean>(false);
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
      firstName: '',
      lastName: '',
      phoneNumber: '',
      phoneShortCode: '',
      country: DefaultSelectCountry,
    }
  );
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [selectPhoneCode, setSelectPhoneCode] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [showPhoneCodeItems, setShowPhoneCodeItems] = useState<boolean>(false);
  const [phoneCodeItems, setPhoneCodeItems] = useState<any[]>([]);
  const [showCodeExpiredRequestButton, setShowCodeExpiredRequestButton] =
    useState<boolean>(false);
  const [countdownNumber, setCountdownNumber] = useState<
    number | ((prevTime: number) => void)
  >(0);
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

  const onFinish = async () => {
    if (!passwordSuccess && checked) {
      if (activateAccountFormValue.password !== confirmPasswordValue) {
        message.open({
          content: PasswordNotMatch,
          className: 'error-message-event',
        });
        return;
      } else {
        if (showCodeExpiredRequestButton) {
          const response = await dispatch(
            verificationCodeAction({
              code: activateAccountFormValue.code,
              email: activateAccountFormValue.email,
              type: 1,
            })
          );
          if (response.type === verificationCodeAction.fulfilled.toString()) {
            setPasswordSuccess(true);
          }
        } else {
          setPasswordSuccess(true);
        }
      }
      return;
    }
    if (checked) {
      if (
        !checkPhoneNumber(
          activateAccountFormValue.phoneNumber,
          activateAccountFormValue.phoneShortCode
        )
      ) {
        setPhoneNumberError(true);
        return;
      } else {
        setPhoneNumberError(false);
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
      dispatch(
        loginAction({
          ...activateAccountFormValue,
          phoneNumber: `${selectPhoneCode}-${activateAccountFormValue.phoneNumber}`,
        })
      );
    } else {
      setTextShak(true);
    }
  };

  const selectCountryCodeChange = (e: string) => {
    setShowPhoneShortCodeError(false);
    const country = e.split('-')[1];
    const phoneCode = e.split('-')[0];
    const countryCode = countryDataList.find(
      (item) => item.country === country
    );
    setActivateAccountFormValue({
      ...activateAccountFormValue,
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

  const timeMethod = () => {
    setCountdownNumber(60);
    if (timer) {
      clearInterval(timer);
    }
    timer = setInterval(() => {
      setCountdownNumber((prevTime: number) => {
        if (prevTime > 0) {
          return prevTime - 1;
        }
        return 0;
      });
    }, 1000);
  };

  const requestNewCode = () => {
    dispatch(verifyUserAction({ email: activateAccountFormValue.email }));
    timeMethod();
  };

  useEffect(() => {
    setActivateAccountFormValue({
      ...activateAccountFormValue,
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
      cookies.setCookie(CookieKeys.userProfileInfo, data.user, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
      if (currentTicketId && !currentTicketEventSlug) {
        router.push(RouterKeys.eventList);
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
      if (redirectPage) {
        router.push(redirectPage);
        return;
      }
      router.push(RouterKeys.eventList);
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
    dispatch(getUserGenderAction());
    setIsFirstRender(false);
    return () => {
      dispatch(reset());
      clearInterval(Number(timer));
    };
  }, []);

  useEffect(() => {
    if (codeStatusExpired) {
      message.open({
        content: CodeExpired,
        className: 'error-message-event',
      });
      setShowCodeExpiredRequestButton(true);
    }
  }, [codeStatusExpired]);

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
        <ActivateAccountContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </ActivateAccountContainer>
      )) || (
        <ActivateAccountContainer
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
                {!passwordSuccess && (
                  <Form
                    ref={formRef}
                    initialValues={{
                      ...activateAccountFormValue,
                      passwordConfirm: confirmPasswordValue,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                  >
                    <div className="tips">Signup with</div>
                    <div className="tips signup-email">{defultEmail}</div>
                    {showCodeExpiredRequestButton && (
                      <>
                        <Form.Item
                          name="code"
                          rules={[{ validator: verificationCodeValidator }]}
                        >
                          <Row>
                            <Col span={24}>
                              <div className="request-code-content">
                                <Input
                                  ref={(input) =>
                                    (inputRefs.current.code = input)
                                  }
                                  className={`${
                                    (passwordValue && 'border-white') || ''
                                  }`}
                                  placeholder="Verification code"
                                  bordered={false}
                                  maxLength={6}
                                  onChange={(e) => {
                                    setActivateAccountFormValue({
                                      ...activateAccountFormValue,
                                      code: e.target.value,
                                    });
                                  }}
                                />
                                {((countdownNumber as number) > 0 && (
                                  <div className="request-code-button show-count-number">
                                    <div className="button">
                                      {`(${countdownNumber}s)`}
                                    </div>
                                  </div>
                                )) || (
                                  <div
                                    className="request-code-button"
                                    onClick={requestNewCode}
                                  >
                                    <div className="button">REQUEST</div>
                                  </div>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </Form.Item>
                        <Form.Item className="auto-complete-hidden">
                          <Input />
                        </Form.Item>
                        <Form.Item className="auto-complete-hidden">
                          <Input.Password />
                        </Form.Item>
                      </>
                    )}
                    <Form.Item
                      name="password"
                      rules={[{ validator: passwordValidator }]}
                    >
                      <Input.Password
                        ref={(input) => (inputRefs.current.password = input)}
                        className={`${(passwordValue && 'border-white') || ''}`}
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
                            password:
                              (isPassword(e.target.value) && e.target.value) ||
                              '',
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item
                      name="passwordConfirm"
                      rules={[{ validator: passwordValidator }]}
                    >
                      <Input.Password
                        ref={(input) =>
                          (inputRefs.current.passwordConfirm = input)
                        }
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
                    <Form.Item
                      className={(isTextShak && 'text-shak') || ''}
                      style={{ marginBottom: 0 }}
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
                    <Form.Item>
                      <Button
                        className="signin-btn"
                        type="primary"
                        htmlType="submit"
                        onClick={() => setTextShak(false)}
                      >
                        NEXT
                      </Button>
                    </Form.Item>
                  </Form>
                )}
                {passwordSuccess && (
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
                          (activateAccountFormValue.firstName &&
                            'border-white') ||
                          ''
                        }`}
                        placeholder="First name (at least 2 characters)"
                        maxLength={20}
                        bordered={false}
                        onChange={(e) =>
                          setActivateAccountFormValue({
                            ...activateAccountFormValue,
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
                          (activateAccountFormValue.lastName &&
                            'border-white') ||
                          ''
                        }`}
                        placeholder="Last name (at least 1 character)"
                        maxLength={20}
                        bordered={false}
                        onChange={(e) =>
                          setActivateAccountFormValue({
                            ...activateAccountFormValue,
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
                            setActivateAccountFormValue({
                              ...activateAccountFormValue,
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
                            setActivateAccountFormValue({
                              ...activateAccountFormValue,
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
                          fontSize: '12px',
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
                          (activateAccountFormValue.genderId &&
                            'gender-select border-white') ||
                          'gender-select'
                        }`}
                        value={activateAccountFormValue.genderId}
                        placeholder="Sex"
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
                    <Form.Item
                      className="form-country"
                      style={{ marginBottom: 0 }}
                    >
                      <CountrySelecter
                        showCountryItems={showCountryItems}
                        currentCountry={activateAccountFormValue.country}
                        setShowCountryItems={setShowCountryItems}
                        setCurrentSelectCountry={setCurrentSelectCountry}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        className="signin-btn"
                        disabled={loading}
                        type="primary"
                        htmlType="submit"
                        onClick={() => {
                          if (
                            activateAccountFormValue.phoneNumber &&
                            !activateAccountFormValue.phoneShortCode
                          ) {
                            setShowPhoneShortCodeError(true);
                          }
                        }}
                      >
                        ACTIVATE
                        {loading && <LoadingOutlined />}
                      </Button>
                    </Form.Item>
                  </Form>
                )}
              </div>
            </div>
          </div>
          {checkGoogleDoc ? (
            <GoogleDocComponent
              docLink={googleDocLink}
              checkGoogleDoc={setCheckGoogleDoc}
            />
          ) : null}
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
        </ActivateAccountContainer>
      )}
    </>
  );
};

ActivateAccount.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let redirectPage = '';
  let defultEmail = '';
  let activateCode = '';
  let currentTicketId = '';
  let currentTicketEventSlug = '';
  let codeStatusExpired = false;
  try {
    if (query.redirect && query.userEmail && query.activateCode) {
      defultEmail = query.userEmail;
      redirectPage = query.redirect;
      activateCode = query.activateCode;
    } else {
      const { codeStatus } = query;
      const parameters = base64Decrypt(Object.keys(query)[0]);
      if (codeStatus && codeStatus === 'expired') {
        codeStatusExpired = true;
      } else {
        activateCode = parameters.code;
      }
      defultEmail = parameters.email;
      currentTicketId = parameters.ticketId;
      currentTicketEventSlug = parameters.eventSlug;
    }
  } catch (_) {}
  return {
    defultEmail,
    activateCode,
    currentTicketId,
    currentTicketEventSlug,
    redirectPage,
    codeStatusExpired,
  };
};

export default ActivateAccount;
