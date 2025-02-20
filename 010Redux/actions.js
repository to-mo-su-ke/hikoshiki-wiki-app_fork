export const SET_DEGREE = "SET_DEGREE";
export const SET_DEPARTMENT = "SET_DEPARTMENT";
export const SET_TERM_DAY_PERIOD = "SET_TERM_DAY_PERIOD";
export const SET_TIMETABLES = "SET_TIMETABLES";
export const ADD_COURSE = 'ADD_COURSE';
export const REMOVE_COURSE = 'REMOVE_COURSE';

// 学部を設定するアクション
export const setDegree = (degree) => ({
  type: SET_DEGREE,
  payload: degree,
});

// 学科を設定するアクション
export const setDepartment = (department) => ({
  type: SET_DEPARTMENT,
  payload: department,
});

// 学年・学期を設定するアクション
export const setTermDayPeriod = (termDayPeriod) => ({
  type: SET_TERM_DAY_PERIOD,
  payload: termDayPeriod,
});

// 時間割データを設定するアクション（必要に応じて）
export const setTimetables = (timetables) => ({
  type: SET_TIMETABLES,
  payload: timetables,
});

export const addCourse = (degree, termDayPeriod, day, period, courseType, code) => ({
  type: ADD_COURSE,
  payload: { degree, termDayPeriod, day, period, courseType, code }
});

export const removeCourse = (degree, termDayPeriod, day, period, courseType) => ({
  type: REMOVE_COURSE,
  payload: { degree, termDayPeriod, day, period, courseType }
});