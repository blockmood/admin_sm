import request from '@/utils/request';

export async function deleteCache(params) {
  return request(`/api/v1/constellation/delete`, {
    method: 'POST',
    data: params,
  });
}
