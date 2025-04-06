import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity,ScrollView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector, useDispatch } from "react-redux";
import { setDegree, setDepartment, setTermDayPeriod } from "../../010Redux/actions";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../004BackendModules/messageMetod/firestore";

const TimeTable = ({ navigation }) => {
  const degree = useSelector((state) => state.degree);
  const department = useSelector((state) => state.department);
  const termDayPeriod = useSelector((state) => state.termDayPeriod);
  const timetables = useSelector((state) => state.timetables);

  const dispatch = useDispatch();

  const [degreeOpen, setDegreeOpen] = useState(false);
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [termDayPeriodOpen, setTermDayPeriodOpen] = useState(false);
  const [courseInfo, setCourseInfo] = useState({});

  const db = getFirestore(app);

  useEffect(() => {
    const fetchAllCourseInfo = async () => {
      const ids = new Set();
      const timetable = timetables?.[degree]?.[termDayPeriod];

      if (timetable) {
        Object.values(timetable).forEach((day) => {
          Object.values(day).forEach((period) => {
            [0, 1, 2].forEach((type) => {
              const id = period[type];
              if (id) ids.add(id);
            });
          });
        });
      }

      const newInfo = { ...courseInfo };
      for (const id of ids) {
        if (!newInfo[id]) {
          const docRef = doc(db, "syllabus", id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            newInfo[id] = {
              title: docSnap.data().courseTitle,
              credit: Number(docSnap.data().credits) || 0,
            };
          } else {
            newInfo[id] = { title: "", credit: 0 };
          }
        }
      }
      setCourseInfo(newInfo);
    };

    fetchAllCourseInfo();
  }, [timetables, degree, termDayPeriod]);

  useEffect(() => {
    if (!degree) dispatch(setDegree("文学部"));
    if (!termDayPeriod) dispatch(setTermDayPeriod(1));
  }, [dispatch, degree, termDayPeriod]);

  const totalCredits = useMemo(() => {
    let total = 0;
    const timetable = timetables?.[degree]?.[termDayPeriod];
    if (!timetable) return total;

    Object.values(timetable).forEach((day) => {
      Object.values(day).forEach((period) => {
        [0, 1, 2].forEach((type) => {
          const id = period[type];
          if (id) {
            total += Number(courseInfo[id]?.credit) || 0;
          }
        });
      });
    });

    return total;
  }, [timetables, degree, termDayPeriod, courseInfo]);

  const degrees = [
    { label: "文学部", value: "文学部" },
    { label: "教育学部", value: "教育学部" },
    { label: "法学部", value: "法学部" },
    { label: "経済学部", value: "経済学部" },
    { label: "情報学部", value: "情報学部" },
    { label: "理学部", value: "理学部" },
    { label: "工学部", value: "工学部" },
    { label: "農学部", value: "農学部" },
    { label: "医学部（保）", value: "医学部（保）" },
    { label: "人文・博前", value: "人文・博前" },
    { label: "人文・博後", value: "人文・博後" },
    { label: "教・博前", value: "教・博前" },
    { label: "法・博前", value: "法・博前" },
    { label: "法・博後", value: "法・博後" },
    { label: "法・専学", value: "法・専学" },
    { label: "経・博前", value: "経・博前" },
    { label: "情報・博前", value: "情報・博前" },
    { label: "情報・博後", value: "情報・博後" },
    { label: "理・博前", value: "理・博前" },
    { label: "理・博後", value: "理・博後" },
    { label: "多・博前", value: "多・博前" },
    { label: "工・博前", value: "工・博前" },
    { label: "工・博後", value: "工・博後" },
    { label: "農・博前", value: "農・博前" },
    { label: "農・博後", value: "農・博後" },
    { label: "医・博前", value: "医・博前" },
    { label: "医・博後", value: "医・博後" },
    { label: "開・博前", value: "開・博前" },
    { label: "環・博前", value: "環・博前" },
    { label: "創・博前", value: "創・博前" },
    { label: "創・博後", value: "創・博後" },
  ];

  const departments =
    degree === "工学部"
      ? [
          { label: "化学生命", value: "化学生命工学科" },
          { label: "物理工", value: "物理工学科" },
          { label: "マテリアル工", value: "マテリアル工学科" },
          { label: "電気電子情報工", value: "電気電子情報工学科" },
          { label: "機械・航空宇宙", value: "機械・航空宇宙工学科" },
          { label: "エネルギー理工", value: "エネルギー理工学科" },
          { label: "環境土木・建築", value: "環境土木・建築学科" },
        ]
      : degree === "理学部"
      ? [
          { label: "数理学科", value: "数理学科" },
          { label: "物理学科", value: "物理学科" },
          { label: "化学科", value: "化学科" },
          { label: "生命理学科", value: "生命理学科" },
          { label: "地球惑星科学科", value: "地球惑星科学科" },
        ]
      : [];

  const termDayPeriods = [
    { label: "１年 春", value: 1 },
    { label: "１年 秋", value: 2 },
    { label: "２年 春", value: 3 },
    { label: "２年 秋", value: 4 },
    { label: "３年 春", value: 5 },
    { label: "３年 秋", value: 6 },
    { label: "４年 春", value: 7 },
    { label: "４年 秋", value: 8 },
    { label: "５年 春", value: 9 },
    { label: "５年 秋", value: 10 },
    { label: "６年 春", value: 11 },
    { label: "６年 秋", value: 12 },
    { label: "７年 春", value: 13 },
    { label: "７年 秋", value: 14 },
    { label: "８年 春", value: 15 },
    { label: "８年 秋", value: 16 },
    { label: "９年 春", value: 17 },
    { label: "９年 秋", value: 18 },
    { label: "10年 春", value: 19 },
    { label: "10年 秋", value: 20 },
    { label: "11年 春", value: 21 },
    { label: "11年 秋", value: 22 },
    { label: "12年 春", value: 23 },
    { label: "12年 秋", value: 24 },
  ];

  const days = ["月", "火", "水", "木", "金", "土"];
  const periods = [1, 2, 3, 4, 5, 6];

  const renderCellContent = (cellData, day, period) => {
    const course0 = cellData[0];
    const course1 = cellData[1];
    const course2 = cellData[2];

    const info0 = courseInfo[course0] || { title: "", credit: 0 };
    const info1 = courseInfo[course1] || { title: "", credit: 0 };
    const info2 = courseInfo[course2] || { title: "", credit: 0 };

    if (cellData[0]) {
      return (
        <View style={styles.fullCellContainer}>
          <Text style={styles.fullCell}>{info0.title}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() =>
              dispatch({
                type: "REMOVE_COURSE",
                payload: {
                  degree,
                  termDayPeriod,
                  day,
                  period,
                  courseType: 0,
                },
              })
            }
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!cellData[1] && !cellData[2]) {
      return <Text style={styles.emptyCell}></Text>;
    }
    return (
      <View style={styles.splitCell}>
        <View style={styles.quarterContainer}>
          <Text style={styles.quarterCell}>{info1.title || ""}</Text>
          {cellData[1] && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                dispatch({
                  type: "REMOVE_COURSE",
                  payload: {
                    degree,
                    termDayPeriod,
                    day,
                    period,
                    courseType: 1,
                  },
                })
              }
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.quarterContainer}>
          <Text style={styles.quarterCell}>{info2.title || ""}</Text>
          {cellData[2] && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                dispatch({
                  type: "REMOVE_COURSE",
                  payload: {
                    degree,
                    termDayPeriod,
                    day,
                    period,
                    courseType: 2,
                  },
                })
              }
            >
              <Text style={styles.closeText}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.headerConstainer}>
        <View style={styles.headerLeft}>
          <View style={styles.degree}>
            <DropDownPicker
              open={degreeOpen}
              value={degree}
              items={degrees}
              setOpen={setDegreeOpen}
              setValue={(callback) => {
                const newDegree = callback(degree);
                dispatch(setDegree(newDegree));
                dispatch(setDepartment(null));
              }}
              placeholder="学部を選択"
              style={styles.degree}
              containerStyle={styles.label}
              dropDownContainerStyle={styles.drop}
            />
          </View>
          {departments.length > 0 && (
            <View style={styles.department}>
              <DropDownPicker
                open={departmentOpen}
                value={department}
                items={departments}
                setOpen={setDepartmentOpen}
                setValue={(callback) => {
                  const newDepartment = callback(department);
                  dispatch(setDepartment(newDepartment));
                }}
                placeholder="学科を選択"
                style={styles.department}
                containerStyle={styles.label}
                dropDownContainerStyle={styles.drop}
              />
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          <DropDownPicker
            open={termDayPeriodOpen}
            value={termDayPeriod}
            items={termDayPeriods}
            setOpen={setTermDayPeriodOpen}
            setValue={(callback) => {
              const newTermDayPeriod = callback(termDayPeriod);
              dispatch(setTermDayPeriod(newTermDayPeriod));
            }}
            placeholder="学年を選択"
            style={styles.grade}
            containerStyle={styles.label}
            dropDownContainerStyle={styles.drop}
          />
        </View>
      </View>
      
      <View style={styles.timetableContainer}>
        <View style={styles.daysRow}>
          <View style={styles.timeCell}>
            <Text>時間</Text>
          </View>
          {days.map((day) => (
            <View key={day} style={styles.dayCell}>
              <Text>{day}</Text>
            </View>
          ))}
        </View>
        <View style={styles.periodsContainer}>
          {periods.map((period) => (
            <View key={period} style={styles.row}>
              <View style={styles.timeCell}>
                <Text>{period}限</Text>
              </View>
              {days.map((day) => {
                const cellData = timetables?.[degree]?.[termDayPeriod]?.[day]?.[
                  period
                ] || { 0: null, 1: null, 2: null };
                return (
                  <TouchableOpacity
                    key={day}
                    style={styles.cell}
                    onPress={() =>
                      navigation.navigate("ClassSelection", {
                        day,
                        period,
                        termDayPeriod,
                        degree,
                        department,
                      })
                    }
                  >
                    {renderCellContent(cellData, day, period)}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>総単位数: {totalCredits}</Text>
      </View>
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  headerConstainer: {
    marginBottom: 16,
    height: 50,
    flexDirection: "row",
    width: "100%",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
    marginRight: 8,
  },
  headerRight: {
    width: 110,
    flexDirection: "row",
  },
  degree: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  department: {
    flex: 2,
    borderWidth: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 8,
  },
  grade: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    borderWidth: 0,
  },
  drop: {
    borderWidth: 0,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  timetableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 16,
  },
  daysRow: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    paddingVertical: 10,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodsContainer: {
    paddingVertical: 8,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timeCell: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 0,
    paddingVertical: 4,
  },
  cell: {
    flex: 1,
    height: 85,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#ffffff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
    margin: 2,
  },
  fullCellContainer: {
    flex: 1,
    width: "100%",
    position: "relative",
    justifyContent: "center",
    padding: 4,
    backgroundColor: "#f1f8ff",
  },
  quarterContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    padding: 2,
    backgroundColor: "#fff8f1",
  },
  fullCell: {
    textAlign: "center",
    fontSize: 12,
    color: "#1e3a8a",
    fontWeight: "500",
  },
  splitCell: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
  },
  quarterCell: {
    textAlign: "center",
    fontSize: 10,
    color: "#7d3b00",
    fontWeight: "500",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  closeButton: {
    position: "absolute",
    right: 2,
    top: 2,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    height: 16,
    width: 16,
    lineHeight: 16,
    color: "#ff5252",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
  totalContainer: {
    alignItems: "flex-end",
    marginTop: 16,
    marginRight: 8,
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignSelf: "flex-end",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
  },
});

export default TimeTable;
