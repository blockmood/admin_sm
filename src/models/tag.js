import { getTagList } from '@/pages/Tag/service';

const Model = {
  namespace: 'tag',
  state: {
    tagList: [],
    total: 0,
  },
  effects: {
    *fetchTagList({ payload }, { call, put }) {
      const response = yield call(getTagList, payload);
      yield put({
        type: 'changeTagList',
        payload: response,
      });
    },
  },
  reducers: {
    changeTagList(state, { payload }) {
      return { ...state, tagList: payload.data, total: payload.total };
    },
  },
};
export default Model;
