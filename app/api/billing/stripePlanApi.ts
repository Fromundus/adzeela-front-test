import axiosInstance from '@/lib/axiosInstance';
export const runtime = 'nodejs';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/stripe/plan`;

export const fetchPlans = async () => {
  return axiosInstance.get(url + 's');
};

export const fetchPlanById = async (id: string) => {
  return axiosInstance.get(`${url}/${id}`);
};
