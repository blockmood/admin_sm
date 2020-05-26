import request from '@/utils/request';

export async function getCateList() {
  return request(`/api/v1/cate/list`);
}
