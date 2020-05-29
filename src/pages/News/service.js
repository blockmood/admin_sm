import request from '@/utils/request';

export async function getNewsList(params) {
  return request(`/api/v1/content/list`, {
    method: 'POST',
    data: params,
  });
}

export async function createNews(params) {
  return request(`/api/v1/content/create`, {
    method: 'POST',
    data: params,
  });
}

export async function updateNews(params) {
  return request(`/api/v1/content/update`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteNews(params) {
  return request(`/api/v1/content/delete`, {
    method: 'POST',
    data: params,
  });
}
