import { getCateList } from '@/pages/CateList/service';

const Model = {
  namespace: 'cate',
  state: {
    cateList: [],
    total: 0,
  },
  effects: {
    *fetchCateList({ payload }, { call, put }) {
      const response = yield call(getCateList, payload);
      yield put({
        type: 'changeCateList',
        payload: response,
      });
    },
  },
  reducers: {
    changeCateList(state, { payload }) {
      return { ...state, cateList: payload.data, total: payload.total };
    },
  },
};
export default Model;
