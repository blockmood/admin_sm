import request from '@/utils/request';

export async function getTagList(params) {
  return request(`/api/v1/tag/list`, {
    method: 'POST',
    data: params,
  });
}

export async function createTag(params) {
  return request(`/api/v1/tag/create`, {
    method: 'POST',
    data: params,
  });
}

export async function updateTag(params) {
  return request(`/api/v1/tag/update`, {
    method: 'POST',
    data: params,
  });
}

export async function deleteTag(params) {
  return request(`/api/v1/tag/delete`, {
    method: 'POST',
    data: params,
  });
}
