import request from '@/utils/request';

export async function getCateList(params) {
  return request(`/api/v1/cate/list`, {
    method: 'POST',
    data: params,
  });
}

export async function createCate(params) {
  return request(`/api/v1/cate/create`, {
    method: 'POST',
    data: params,
  });
}

export async function updateCate(params) {
  return request(`/api/v1/cate/update`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteCate(params) {
  return request(`/api/v1/cate/delete`, {
    method: 'POST',
    data: params,
  });
}
