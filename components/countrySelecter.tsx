import React, { useState, useEffect, useRef } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { cloneDeep } from 'lodash';

import { CountrySelecterContainer } from '@/styles/countrySelecter.style';
import countryDataList from '@/utils/countrycode.data.json';
import { CountryItemProps } from '@/constants/General';

const CountrySelecter = ({
  isProfilePage = false,
  currentCountry,
  showCountryItems,
  setShowCountryItems,
  setCurrentSelectCountry,
}: {
  currentCountry: string;
  showCountryItems: boolean;
  setShowCountryItems: (status: boolean) => void;
  setCurrentSelectCountry: (country: string) => void;
  isProfilePage?: boolean;
}) => {
  const countryListSelect = useRef<any>(null);
  const searchInputSelect = useRef<any>(null);

  const [sortCountryList, setSortCountryList] = useState<CountryItemProps[]>(
    []
  );

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
    if (!showCountryItems) {
      setSortCountryList(sortData(countryDataList));
    } else {
      document.addEventListener('click', clickCallback, false);
    }
    return () => {
      document.removeEventListener('click', clickCallback, false);
    };
  }, [showCountryItems]);

  return (
    <CountrySelecterContainer>
      <div
        ref={countryListSelect}
        className="search-select-country"
        onClick={() => setShowCountryItems(!showCountryItems)}
      >
        <div className="content">
          <span className="country-flag">
            {countryDataList.find((item) => item.country === currentCountry)
              ?.flag || ''}
          </span>
          <span className="country-name">
            {
              countryDataList.find((item) => item.country === currentCountry)
                ?.country
            }
          </span>
        </div>
        <CaretDownOutlined />
      </div>
      {showCountryItems && (
        <div className="country-items">
          <div ref={searchInputSelect} className="search-input-content">
            <Input
              placeholder="Search country"
              onChange={(e) => {
                searchCountryOnChange(e.target.value.toLowerCase());
              }}
            />
          </div>
          {(sortCountryList.length &&
            sortCountryList.map((item: CountryItemProps) => (
              <div
                key={`${item.code}-${item.country}`}
                className={
                  (isProfilePage && 'content profile-page') || 'content'
                }
                onClick={() => {
                  setShowCountryItems(false);
                  setCurrentSelectCountry(item.country);
                }}
              >
                <span className="country-flag">{item.flag}</span>
                <span className="country-name">{item.country}</span>
              </div>
            ))) || (
            <div className="content no-data">
              <span className="country-name">No data found</span>
            </div>
          )}
        </div>
      )}
    </CountrySelecterContainer>
  );
};

export default CountrySelecter;
