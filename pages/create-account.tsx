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
  EyeOutlined,
  EyeInvisibleOutlined,
  LoadingOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';

import { useCookie } from '../hooks';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  isEmail,
  isPassword,
  getErrorMessage,
  base64Encrypt,
  base64Decrypt,
  generateRandomString,
  profileNameValidator,
  checkPhoneNumber,
  emailValidator,
  passwordValidator,
} from '../utils/func';
import {
  TermsConditionsLink,
  PrivacyPolicyLink,
  TokenExpire,
  PasswordNotMatch,
  BirthdayNotVaild,
  RegisterVerifyType,
  DefaultSelectCountry,
  VerificationCodeLength,
} from '../constants/General';
import { RouterKeys, CookieKeys, LocalStorageKeys } from '../constants/Keys';
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
import GoogleDocComponent from '../components/googleDocComponent';
import OpenAppComponent from '../components/openAppComponent';
// import GoogleLoginComponent from '../components/googleLoginComponent';
import Messages from '../constants/Messages';
import AuthPageHearder from '@/components/authPageHearder';
import { resetMyRavesCache } from '@/slice/myRaves.slice';
import CountrySelecter from '@/components/countrySelecter';
import countryDataList from '@/utils/countrycode.data.json';
import { Images } from '@/theme';
import CountryCodePhoneNumber from '@/components/countryCodePhoneNumber';

const CreateAccount = ({
  redirectPage,
  currentTicketEventSlug,
  ticketIdFormEmailLink,
}: {
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
  const formRef = useRef<any>(null);

  const data = useAppSelector(selectData);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const getUserGenderLoading = useAppSelector(selectGetUserGenderLoading);
  const userGender = useAppSelector(selectUserGender);
  const loginRedirectPage = useAppSelector(selectLoginRedirectPage);

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
      genderId: null,
      firstName: '',
      lastName: '',
      phoneNumber: '',
      phoneShortCode: '',
      country: DefaultSelectCountry,
      passwordConfirm: '',
    });
  const [showCountryItems, setShowCountryItems] = useState<boolean>(false);
  const [currentSelectCountry, setCurrentSelectCountry] =
    useState<string>(DefaultSelectCountry);
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [selectPhoneCode, setSelectPhoneCode] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [showPhoneCodeItems, setShowPhoneCodeItems] = useState<boolean>(false);
  const [phoneCodeItems, setPhoneCodeItems] = useState<any[]>([]);

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
    if (!isVerificationEmail) {
      if (checked) {
        const result = await dispatch(
          verifyUserAction({
            email: createAccountValue.email,
            firstName: createAccountValue.firstName,
            lastName: createAccountValue.lastName,
          })
        );
        if (result.type === verifyUserAction.fulfilled.toString()) {
          if (redirectPage || loginRedirectPage) {
            router.push({
              pathname: RouterKeys.activateAccountNormalFlow,
              query: `redirect=${
                redirectPage || loginRedirectPage
              }&email=${base64Encrypt({
                email: createAccountValue.email,
              })}`,
            });
          } else {
            router.push(
              `${RouterKeys.activateAccountNormalFlow}?${base64Encrypt({
                email: createAccountValue.email,
              })}`
            );
          }
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
        if (formRef && formRef.current) {
          const { setFieldsValue } = formRef.current;
          setFieldsValue({
            password: '',
            passwordConfirm: '',
          });
        }
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
      if (
        !checkPhoneNumber(
          createAccountValue.phoneNumber,
          createAccountValue.phoneShortCode
        )
      ) {
        setPhoneNumberError(true);
        return;
      } else {
        setPhoneNumberError(false);
      }
      dispatch(
        registerAccountAction({
          ...createAccountValue,
          phoneNumber: `${selectPhoneCode}-${createAccountValue.phoneNumber}`,
        })
      );
    }
  };

  const selectCountryCodeChange = (e: string) => {
    const country = e.split('-')[1];
    const phoneCode = e.split('-')[0];
    const countryCode = countryDataList.find(
      (item) => item.country === country
    );
    setCreateAccountValue({
      ...createAccountValue,
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

  const checkGoogleDocAction = (link: string) => {
    setCheckGoogleDoc(true);
    setgoogleDocLink(link);
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
    setCreateAccountValue({
      ...createAccountValue,
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
      cookies.setCookie(CookieKeys.userLoginEmail, createAccountValue.email, {
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
                    <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
                      <Form.Item
                        name="email"
                        rules={[{ validator: emailValidator }]}
                      >
                        <Input
                          ref={(input) => (inputRefs.current.email = input)}
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
                            (createAccountValue.firstName && 'border-white') ||
                            ''
                          }`}
                          placeholder="First name (at least 2 characters)"
                          maxLength={20}
                          bordered={false}
                          onChange={(e) =>
                            setCreateAccountValue({
                              ...createAccountValue,
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
                            message: 'Required!',
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
                            (createAccountValue.lastName && 'border-white') ||
                            ''
                          }`}
                          placeholder="Last name (at least 1 character)"
                          maxLength={20}
                          bordered={false}
                          onChange={(e) =>
                            setCreateAccountValue({
                              ...createAccountValue,
                              lastName: e.target.value,
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
                          disabled={loading}
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
                              (createAccountValue.code && 'border-white') || ''
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
                    <Form
                      ref={formRef}
                      initialValues={{
                        ...createAccountValue,
                        passwordConfirm: confirmPasswordValue,
                      }}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                    >
                      <Form.Item
                        name="password"
                        rules={[{ validator: passwordValidator }]}
                      >
                        <Input.Password
                          ref={(input) => (inputRefs.current.password = input)}
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
                              setCreateAccountValue({
                                ...createAccountValue,
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
                              setCreateAccountValue({
                                ...createAccountValue,
                                phoneNumber: value,
                              });
                            }}
                            {...countryCodePhoneNumberProps}
                          />
                        </Col>
                      </Row>
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
                            message: 'Required!',
                          },
                        ]}
                      >
                        <Select
                          popupClassName="gender-select-dropdown"
                          className={`${
                            (createAccountValue.genderId &&
                              'gender-select border-white') ||
                            'gender-select'
                          }`}
                          placeholder="Sex"
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
                      <Form.Item
                        name="birthday"
                        rules={[
                          {
                            required: true,
                            message: 'Required!',
                          },
                        ]}
                      >
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
                        <CountrySelecter
                          showCountryItems={showCountryItems}
                          currentCountry={createAccountValue.country}
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
                          query: `redirect=${
                            redirectPage || loginRedirectPage
                          }`,
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
          )) || (
            <GoogleDocComponent
              docLink={googleDocLink}
              checkGoogleDoc={setCheckGoogleDoc}
            />
          )}
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

CreateAccount.getInitialProps = async (ctx: any) => {
  const { query } = ctx;
  let currentTicketEventSlug = '';
  let ticketIdFormEmailLink = '';
  let redirectPage = '';
  try {
    if (!isEmpty(query)) {
      const { redirect, raves } = query;
      if (raves && redirect) {
        redirectPage = `${redirect}&raves=${raves}`;
      } else {
        const parameters = base64Decrypt(Object.keys(query)[0]);
        currentTicketEventSlug = parameters.eventSlug;
        ticketIdFormEmailLink = parameters.ticketId;
        redirectPage = query.redirect || '';
      }
    }
  } catch (_) {}
  return {
    currentTicketEventSlug,
    redirectPage,
    ticketIdFormEmailLink,
  };
};

export default CreateAccount;
