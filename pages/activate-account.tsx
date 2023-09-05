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
  EyeInvisibleOutlined,
  EyeOutlined,
  CaretDownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import { cloneDeep } from 'lodash';

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
  CountryItemProps,
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
  const countryListSelect = useRef<any>(null);
  const searchInputSelect = useRef<any>(null);

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
  const [sortCountryList, setSortCountryList] = useState<CountryItemProps[]>(
    []
  );
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

  const sortData = (data: CountryItemProps[]) => {
    const listSort: CountryItemProps[] = cloneDeep(data).sort(
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
                                  item.country ===
                                  activateAccountFormValue.country
                              )?.flag || ''}
                            </span>
                            <span className="country-name">
                              {
                                countryDataList.find(
                                  (item) =>
                                    item.country ===
                                    activateAccountFormValue.country
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
                                    setActivateAccountFormValue({
                                      ...activateAccountFormValue,
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
