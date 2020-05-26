import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/api/v1/users/login', {
    method: 'POST',
    data: params,
  });
}
export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
