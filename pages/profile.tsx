import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Button,
  Upload,
  Input,
  Form,
  Select,
  DatePicker,
  message,
  Drawer,
} from 'antd';
import {
  CalendarOutlined,
  InfoCircleOutlined,
  CaretDownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import type { RcFile } from 'antd/es/upload/interface';
import _ from 'lodash';

import { ProfileContainer, EditerContent } from '@/styles/profile.style';
import PageHearderComponent from '@/components/pageHearder';
import PageHearderResponsive from '@/components/pageHearderResponsive';
import PageBottomComponent from '@/components/pageBottomComponent';
import PopupEditer from '@/components/popupEditer';
import CountrySelecter from '@/components/countrySelecter';
import AuthHoc from '@/components/hoc/AuthHoc';
import { Images } from '@/theme';
import {
  DefaultSelectCountry,
  FormatTimeKeys,
  UploadUserAvatarAccept,
  UploadUserAvatarSizeLimit,
  TokenExpire,
} from '@/constants/General';
import {
  formatTimeStrByTimeString,
  profileNameValidator,
  compressorImage,
  checkPhoneNumber,
} from '@/utils/func';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  getUserGenderAction,
  selectUserGender,
  selectGetUserGenderLoading,
} from '@/slice/user.slice';
import {
  reset,
  getLoginUserDetailAction,
  updateLoginUserDetailAction,
  selectProfileDetail,
  selectLoading,
  selectError,
  UpdateProfileProps,
  selectUpdateProfileLoading,
  selectDefaultShowEditProfilePopup,
} from '@/slice/profile.slice';
import { useCookie } from '@/hooks';
import { CookieKeys } from '@/constants/Keys';
import countryDataList from '@/utils/countrycode.data.json';
import ShowUpdateProfilePopup from '@/components/showUpdateProfilePopup';
import CountryCodePhoneNumber from '@/components/countryCodePhoneNumber';

dayjs.extend(weekday);
dayjs.extend(localeData);

const Profile = () => {
  const dispatch = useAppDispatch();
  const cookies = useCookie([CookieKeys.userProfileInfo]);

  const userGender = useAppSelector(selectUserGender);
  const getUserGenderLoading = useAppSelector(selectGetUserGenderLoading);
  const profileDetails = useAppSelector(selectProfileDetail);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const updateProfileLoading = useAppSelector(selectUpdateProfileLoading);
  const defaultShowEditProfilePopup = useAppSelector(
    selectDefaultShowEditProfilePopup
  );

  const [menuState, setMenuState] = useState<boolean>(false);
  const [showEditer, setShowEditer] = useState<boolean>(false);
  const [showCountryItems, setShowCountryItems] = useState<boolean>(false);
  const [currentSelectCountry, setCurrentSelectCountry] =
    useState<string>(DefaultSelectCountry);
  const [currentUploadAvatar, setCurrentUploadAvatar] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<any>(null);
  const [selectCountryShortCode, setSelectCountryShortCode] =
    useState<string>('');
  const [selectPhoneCode, setSelectPhoneCode] = useState<string>('');
  const [phoneNumberError, setPhoneNumberError] = useState<boolean>(false);
  const [showUpdateProfilePopup, setShowUpdateProfilePopup] =
    useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [showPhoneCodeItems, setShowPhoneCodeItems] = useState<boolean>(false);
  const [phoneCodeItems, setPhoneCodeItems] = useState<any[]>([]);

  const onFinish = async (values: UpdateProfileProps) => {
    const { phoneNumber } = values;
    if (selectCountryShortCode) {
      if (!checkPhoneNumber(phoneNumber, selectCountryShortCode)) {
        setPhoneNumberError(true);
        return;
      } else {
        setPhoneNumberError(false);
      }
    } else {
      setPhoneNumberError(true);
      return;
    }
    const formData = new FormData();
    const payload = {
      ...values,
      birthday: format(new Date(values.birthday), FormatTimeKeys.yMd),
      country: currentSelectCountry,
      phoneShortCode: selectCountryShortCode,
      phoneNumber:
        (selectPhoneCode && `${selectPhoneCode}-${values.phoneNumber}`) ||
        values.phoneNumber,
    };
    if (uploadFile) {
      formData.append('profile', uploadFile);
    }
    _.forIn(payload, (value, key) => {
      if (key !== 'email') {
        formData.append(key, value.toString());
      }
    });
    const response = await dispatch(updateLoginUserDetailAction(formData));
    if (response.type === updateLoginUserDetailAction.fulfilled.toString()) {
      setShowEditer(false);
      dispatch(getLoginUserDetailAction());
    }
  };

  const checkUserGender = () => {
    if (profileDetails.genderId !== 0) {
      const gender = userGender.find(
        (item) => item.id === profileDetails.genderId
      );
      return gender?.label;
    }
    return 'To be filled';
  };

  const beforeUpload = (file: RcFile) => {
    const isLimit = file.size / 1024 / 1024 <= 10;
    if (!isLimit) {
      message.open({
        content: UploadUserAvatarSizeLimit,
        className: 'error-message-event',
      });
    }
    return isLimit;
  };

  const customRequest = (event: any) => {
    let quality = 0.6;
    const { file } = event;
    try {
      const fileSize = (file.size / 1024 / 1024).toFixed(2);
      if (Number(fileSize) > 5) {
        quality = 0.1;
      }
      if (Number(fileSize) <= 1) {
        quality = 1;
      }
      compressorImage(file, quality).then((res: any) => {
        setUploadFile(res);
        const reader = new FileReader();
        reader.onload = () => {
          const base64String: any = reader.result;
          setCurrentUploadAvatar(base64String);
        };
        reader.readAsDataURL(res);
      });
    } catch (err) {}
  };

  const selectCountryCodeChange = (e: string) => {
    const country = e.split('-')[1];
    const phoneCode = e.split('-')[0];
    const countryCode = countryDataList.find(
      (item) => item.country === country
    );
    setSelectPhoneCode(phoneCode);
    setSelectCountryShortCode(countryCode?.shortCode || '');
    setPhoneNumberError(false);
  };

  const checkCountryCodeDefaultValue = () => {
    if (selectPhoneCode) {
      return selectPhoneCode;
    }
    if (profileDetails.phoneShortCode) {
      return profileDetails.phoneNumber.split('-')[0];
    }
    return null;
  };

  const countryCodePhoneNumberProps = {
    selectPhoneCode: selectPhoneCode,
    selectDefaultValue: checkCountryCodeDefaultValue(),
    inputOnChange: () => {
      setPhoneNumberError(false);
    },
    selectCountryCodeChange: selectCountryCodeChange,
    setDrawerOpen: setDrawerOpen,
  };

  useEffect(() => {
    if (profileDetails.id !== 0) {
      const currentDate = new Date();
      cookies.setCookie(CookieKeys.userProfileInfo, profileDetails, {
        expires: new Date(currentDate.getTime() + TokenExpire),
        path: '/',
        domain: window.location.hostname,
      });
    }
    if (profileDetails.country) {
      setCurrentSelectCountry(profileDetails.country);
      setCurrentUploadAvatar(profileDetails.profileImage);
    }
    if (profileDetails.phoneShortCode) {
      const phoneCode = profileDetails.phoneNumber.split('-')[0];
      if (phoneCode) {
        setSelectPhoneCode(phoneCode);
      }
      setSelectCountryShortCode(profileDetails.phoneShortCode);
    }
  }, [profileDetails]);

  useEffect(() => {
    if (error) {
      message.open({
        content: error.message,
        className: 'error-message-event',
      });
    }
  }, [error]);

  useEffect(() => {
    if (defaultShowEditProfilePopup) {
      setShowEditer(true);
    }
  }, [defaultShowEditProfilePopup]);

  useEffect(() => {
    dispatch(getUserGenderAction());
    dispatch(getLoginUserDetailAction());
    return () => {
      dispatch(reset());
    };
  }, []);

  useEffect(() => {
    if (!showEditer) {
      setSelectPhoneCode('');
    } else {
      if (profileDetails.phoneShortCode) {
        const phoneCode = profileDetails.phoneNumber.split('-')[0];
        if (phoneCode) {
          setSelectPhoneCode(phoneCode);
        }
      }
    }
  }, [showEditer]);

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
      {(!loading && (
        <ProfileContainer>
          <div className="container-wrap">
            <Col md={24} xs={0}>
              <PageHearderResponsive
                profileDetail={profileDetails}
                profileAvatar={profileDetails.profileImage}
                showBackgroundColor={false}
                setShowEditProfilePopup={setShowUpdateProfilePopup}
              />
            </Col>
            <Col md={0} xs={24}>
              <PageHearderComponent
                profileDetail={profileDetails}
                setMenuState={setMenuState}
                showBackgroundColor={false}
                setShowEditProfilePopup={setShowUpdateProfilePopup}
              />
            </Col>
            <div className="profile-background">
              <img src={Images.ProfileBackground.src} alt="" />
            </div>
            <div className="page-main">
              <Row>
                <Col className="profile-avatar" span={12}>
                  {(profileDetails.profileImage && (
                    <img
                      className="avatar-image"
                      src={profileDetails.profileImage}
                      alt=""
                      onError={(e: any) => {
                        e.target.onerror = null;
                        e.target.src = Images.BackgroundLogo.src;
                      }}
                    />
                  )) || (
                    <div className="avatar-email">
                      <span>
                        {profileDetails.email.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Col>
                <Col className="profile-edit" span={12}>
                  <Button onClick={() => setShowEditer(true)}>
                    EDIT PROFILE
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col
                  className={
                    (profileDetails.firstName && 'profile-name') ||
                    'profile-name no-filled'
                  }
                  span={24}
                >
                  {(profileDetails.firstName &&
                    `${profileDetails.firstName} ${profileDetails.lastName}`) ||
                    'To be filled'}
                </Col>
                <Col className="profile-joined" span={24}>
                  <CalendarOutlined />
                  Joined{' '}
                  {(profileDetails.createdAt &&
                    formatTimeStrByTimeString(
                      profileDetails.createdAt,
                      FormatTimeKeys.mdy
                    )) ||
                    '-'}
                </Col>
              </Row>
              <div className="profile-items-content">
                <Row>
                  <Col md={12} span={24} className="item">
                    <div className="item-info">
                      <div className="info-icon">
                        <img src={Images.MailIcon.src} alt="" />
                      </div>
                      <div className="info-value">
                        <div className="title">Email</div>
                        <div
                          className={
                            (profileDetails.email && 'value') ||
                            'value no-filled'
                          }
                        >
                          {profileDetails.email || 'To be filled'}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={12} span={24} className="item">
                    <div className="item-info">
                      <div className="info-icon">
                        <img src={Images.PhoneIcon.src} alt="" />
                      </div>
                      <div className="info-value">
                        <div className="title">Phone number</div>
                        <div
                          className={
                            (profileDetails.phoneNumber && 'value') ||
                            'value no-filled'
                          }
                        >
                          {profileDetails.phoneNumber || 'To be filled'}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} span={24} className="item">
                    <div className="item-info">
                      <div className="info-icon">
                        <img src={Images.MoodIcon.src} alt="" />
                      </div>
                      <div className="info-value">
                        <div className="title">Sex</div>
                        <div
                          className={
                            (profileDetails.genderId && 'value') ||
                            'value no-filled'
                          }
                        >
                          {checkUserGender()}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={12} span={24} className="item">
                    <div className="item-info">
                      <div className="info-icon">
                        <img src={Images.CakeIcon.src} alt="" />
                      </div>
                      <div className="info-value">
                        <div className="title">Date of birth</div>
                        <div
                          className={
                            (profileDetails.birthday && 'value') ||
                            'value no-filled'
                          }
                        >
                          {(profileDetails.birthday &&
                            formatTimeStrByTimeString(
                              profileDetails.birthday,
                              FormatTimeKeys.mdy
                            )) ||
                            'To be filled'}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className="item">
                    <div className="item-info">
                      <div className="info-icon">
                        <img src={Images.FlagIcon.src} alt="" />
                      </div>
                      <div className="info-value">
                        <div className="title">Country of Residence</div>
                        <div
                          className={
                            (profileDetails.country && 'value') ||
                            'value no-filled'
                          }
                        >
                          {profileDetails.country || 'To be filled'}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
            {!menuState && <PageBottomComponent />}
          </div>
          <PopupEditer open={showEditer} setShowEditer={setShowEditer}>
            <EditerContent>
              {(!getUserGenderLoading && (
                <>
                  <Row>
                    <Col span={24} className="avatar-col">
                      <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        accept={UploadUserAvatarAccept.toString()}
                        maxCount={1}
                        showUploadList={false}
                        customRequest={customRequest}
                        beforeUpload={beforeUpload}
                      >
                        {(currentUploadAvatar && (
                          <img
                            src={currentUploadAvatar}
                            alt="avatar"
                            className="uploaded-avatar"
                            onError={(e: any) => {
                              e.target.onerror = null;
                              e.target.src = Images.BackgroundLogo.src;
                            }}
                          />
                        )) || (
                          <div className="avatar-email">
                            <span>
                              {profileDetails.email.slice(0, 1).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="upload-mask">
                          <img src={Images.CameraIcon.src} alt="" />
                        </div>
                      </Upload>
                    </Col>
                  </Row>
                  <Form
                    initialValues={{
                      ...profileDetails,
                      genderId: profileDetails.genderId || null,
                      phoneNumber:
                        profileDetails.phoneNumber.split('-')[1] ||
                        profileDetails.phoneNumber,
                      birthday:
                        (profileDetails.birthday &&
                          dayjs(profileDetails.birthday)) ||
                        '',
                    }}
                    onFinish={onFinish}
                  >
                    <Row gutter={[12, 12]} className="editer-row">
                      <Col sm={12} span={24}>
                        <div className="editer-field">
                          <div className="title">First Name</div>
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
                              maxLength={20}
                              placeholder="First Name (at least 2 characters)"
                            />
                          </Form.Item>
                        </div>
                      </Col>
                      <Col sm={12} span={24}>
                        <div className="editer-field">
                          <div className="title">Last Name</div>
                          <Form.Item
                            name="lastName"
                            rules={[{ required: true, message: 'Required' }]}
                            getValueFromEvent={(e) => {
                              const { value } = e.target;
                              return value
                                .replace(/[0-9]/g, '')
                                .replace(/[^\w^\s^\u4e00-\u9fa5]/gi, '');
                            }}
                          >
                            <Input
                              maxLength={20}
                              placeholder="Last Name (at least 1 character)"
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Row className="editer-row">
                      <Col span={24}>
                        <div className="editer-field">
                          <div className="title">Email</div>
                          <Form.Item name="email">
                            <Input disabled />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Row className="editer-row">
                      <Col span={24}>
                        <div className="editer-field">
                          <div className="title">Phone number</div>
                          <Col xs={24} sm={0}>
                            <CountryCodePhoneNumber
                              isMobile
                              formItemClassName={
                                (phoneNumberError && 'country-code error') ||
                                'country-code'
                              }
                              {...countryCodePhoneNumberProps}
                            />
                          </Col>
                          <Col xs={0} sm={24}>
                            <CountryCodePhoneNumber
                              isMobile={false}
                              formItemClassName={
                                (phoneNumberError && 'country-code error') ||
                                'country-code'
                              }
                              {...countryCodePhoneNumberProps}
                            />
                          </Col>
                        </div>
                        {phoneNumberError && (
                          <div className="phone-number-error">
                            {(selectCountryShortCode &&
                              'Invalid phone number') ||
                              'Required'}
                          </div>
                        )}
                        <div className="phone-number-info">
                          <InfoCircleOutlined />
                          <span className="text">
                            Event organisers may contact you by your mobile
                            number for event updates. Please provide a valid
                            phone number.
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <Row className="editer-row">
                      <Col span={24}>
                        <div className="editer-field">
                          <div className="title">Sex</div>
                          <Form.Item
                            name="genderId"
                            rules={[{ required: true, message: 'Required' }]}
                          >
                            <Select
                              placeholder="Sex"
                              popupClassName="gender-select-dropdown"
                              options={userGender.map((item) => ({
                                value: item.id,
                                label: item.label,
                              }))}
                              suffixIcon={
                                <CaretDownOutlined
                                  style={{ pointerEvents: 'none' }}
                                />
                              }
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Row className="editer-row">
                      <Col span={24}>
                        <div className="editer-field">
                          <div className="title">Date of birth</div>
                          <Form.Item
                            name="birthday"
                            rules={[{ required: true, message: 'Required' }]}
                          >
                            <DatePicker
                              placeholder="Date of birth"
                              inputReadOnly
                              format="MMM DD, YYYY"
                              showToday={false}
                              popupClassName="birth-picker-dropdown"
                              allowClear={false}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Row className="editer-row">
                      <Col span={24}>
                        <div className="editer-field country">
                          <div className="title">Country of Residence</div>
                          <Form.Item>
                            <CountrySelecter
                              showCountryItems={showCountryItems}
                              currentCountry={currentSelectCountry}
                              setShowCountryItems={setShowCountryItems}
                              setCurrentSelectCountry={setCurrentSelectCountry}
                            />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Form.Item className="action-button">
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Button
                            className="cancel"
                            onClick={() => setShowEditer(false)}
                          >
                            CANCEL
                          </Button>
                        </Col>
                        <Col span={12}>
                          <Button
                            disabled={updateProfileLoading}
                            htmlType="submit"
                            className="save"
                          >
                            SAVE
                            {updateProfileLoading && <LoadingOutlined />}
                          </Button>
                        </Col>
                      </Row>
                    </Form.Item>
                  </Form>
                </>
              )) || (
                <div className="page-loading">
                  <LoadingOutlined />
                </div>
              )}
            </EditerContent>
          </PopupEditer>
          <Drawer
            open={drawerOpen}
            placement="bottom"
            onClose={() => setDrawerOpen(false)}
            getContainer={false}
            rootClassName="phone-code-drawer"
            destroyOnClose
          >
            <Input
              placeholder="Country"
              defaultValue={checkCountryCodeDefaultValue() || ''}
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
          <ShowUpdateProfilePopup
            isProfilePage
            setShowEditer={setShowEditer}
            showPopup={showUpdateProfilePopup}
            setShowPopup={setShowUpdateProfilePopup}
          />
        </ProfileContainer>
      )) || (
        <ProfileContainer>
          <div className="page-loading">
            <LoadingOutlined />
          </div>
        </ProfileContainer>
      )}
    </>
  );
};

export default AuthHoc(Profile);
