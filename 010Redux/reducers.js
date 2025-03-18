// Reduxのreducerを定義するファイル

import { SET_DEGREE, SET_DEPARTMENT, SET_TERM_DAY_PERIOD, SET_TIMETABLES, ADD_COURSE, REMOVE_COURSE, SET_USER_TOKEN } from "./actions";

const initialState = {
  degree: null,
  department: null,
  termDayPeriod: null,
  timetables: [],
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    //　ログイン処理
    case SET_USER_TOKEN:
      return { ...state, userToken: action.payload };
    
    //　時間割ページ
    case SET_DEGREE:
      return { ...state, degree: action.payload, department: null };
    case SET_DEPARTMENT:
      return { ...state, department: action.payload };
    case SET_TERM_DAY_PERIOD:
      return { ...state, termDayPeriod: action.payload };
    case SET_TIMETABLES:
      return { ...state, timetables: action.payload };
    case ADD_COURSE: {
        const { degree, termDayPeriod, day, period, courseType, code } = action.payload;
      
        // 現在の状態をベースに新しいオブジェクトを作成
        const currentDegree = state.timetables[degree] || {};
        const currentTerm = currentDegree[termDayPeriod] || {};
        const currentDay = currentTerm[day] || {};
        const currentPeriod = currentDay[period] || { 0: null, 1: null, 2: null };
      
        // 新しいperiodデータを作成
        let newPeriod;
        switch(courseType) {
          case 0:
            newPeriod = { 0: code, 1: null, 2: null };
            break;
          case 1:
            newPeriod = { ...currentPeriod, 1: code, 0: null };
            break;
          case 2:
            newPeriod = { ...currentPeriod, 2: code, 0: null };
            break;
          default:
            newPeriod = currentPeriod;
        }
      
        // 各階層を新しいオブジェクトで再構築
        const newDay = { ...currentDay, [period]: newPeriod };
        const newTerm = { ...currentTerm, [day]: newDay };
        const newDegree = { ...currentDegree, [termDayPeriod]: newTerm };
        const newTimetables = { ...state.timetables, [degree]: newDegree };
      
        return { ...state, timetables: newTimetables };
      }
      
      case REMOVE_COURSE: {
        const { degree, termDayPeriod, day, period, courseType } = action.payload;
      
        const currentDegree = state.timetables[degree] || {};
        const currentTerm = currentDegree[termDayPeriod] || {};
        const currentDay = currentTerm[day] || {};
        const currentPeriod = currentDay[period] || { 0: null, 1: null, 2: null };
      
        if (!currentPeriod[courseType]) return state;
      
        const newPeriod = { ...currentPeriod, [courseType]: null };
        const newDay = { ...currentDay, [period]: newPeriod };
        const newTerm = { ...currentTerm, [day]: newDay };
        const newDegree = { ...currentDegree, [termDayPeriod]: newTerm };
        const newTimetables = { ...state.timetables, [degree]: newDegree };
      
        return { ...state, timetables: newTimetables };
      }
    default:
      return state;
  }
};

export default rootReducer;