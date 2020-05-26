import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/v1/users/userinfo', {
    method: 'POST',
    data: {
      a: 22,
    },
  });
}
export async function queryNotices() {
  return request('/api/notices');
}
