import axios from 'axios';

const PROVINCE_API_URL = 'https://provinces.open-api.vn/api';

export const getProvinces = () => {
    return axios.get(`${PROVINCE_API_URL}/p/`);
};

export const getDistricts = (provinceCode) => {
    return axios.get(`${PROVINCE_API_URL}/p/${provinceCode}?depth=2`);
};

export const getWards = (districtCode) => {
    return axios.get(`${PROVINCE_API_URL}/d/${districtCode}?depth=2`);
};
