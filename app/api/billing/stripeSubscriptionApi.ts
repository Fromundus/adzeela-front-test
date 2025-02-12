import axiosInstance from '@/lib/axiosInstance';
export const runtime = 'nodejs';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/subscription`;

export const fetchSubscriptions = async () => {
  return axiosInstance.get(url + 's');
};

export const createSubscriptions = async (data: any) => {
  return axiosInstance.post(url + 's', data);
};
