import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSelector, useDispatch } from "react-redux";
import {
  setDegree,
  setDepartment,
  setTermDayPeriod,
} from "../../010Redux/actions";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../004BackendModules/messageMetod/firestore";

const TimeTableView = ({ navigation }) => {
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
              ...docSnap.data(),
              credit: Number(docSnap.data().credits) || 0,
            };
          } else {
            newInfo[id] = {};
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

  const renderCell = (cellData, day, period) => {
    // full cell の場合 (cellData[0] が存在)
    if (cellData[0]) {
      const course = courseInfo[cellData[0]];
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            navigation.navigate("CourseDetailView", {
              course,
              day,
              period,
              termDayPeriod,
              degree,
            });
          }}
        >
          <View style={styles.fullCellContainer}>
            <Text style={styles.fullCell}>
              {course?.courseTitle || course?.title || ""}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      // 分割セルの場合。左（cellData[1]）・右（cellData[2]）それぞれで TouchableOpacity を用意
      if (!cellData[1] && !cellData[2]) {
        return <Text style={styles.emptyCell}></Text>;
      }
      return (
        <View style={styles.splitCell}>
          <TouchableOpacity
            style={styles.quarterContainer}
            onPress={() => {
              if (cellData[1]) {
                const course = courseInfo[cellData[1]];
                navigation.navigate("CourseDetailView", {
                  course,
                  day,
                  period,
                  termDayPeriod,
                  degree,
                });
              }
            }}
          >
            <Text style={styles.quarterCell}>
              {courseInfo[cellData[1]]?.courseTitle ||
                courseInfo[cellData[1]]?.title ||
                ""}
            </Text>
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <TouchableOpacity
            style={styles.quarterContainer}
            onPress={() => {
              if (cellData[2]) {
                const course = courseInfo[cellData[2]];
                navigation.navigate("CourseDetailView", {
                  course,
                  day,
                  period,
                  termDayPeriod,
                  degree,
                });
              }
            }}
          >
            <Text style={styles.quarterCell}>
              {courseInfo[cellData[2]]?.courseTitle ||
                courseInfo[cellData[2]]?.title ||
                ""}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
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
      {periods.map((period) => (
        <View key={period} style={styles.row}>
          <View style={styles.timeCell}>
            <Text>{period}限</Text>
          </View>
          {days.map((day) => {
            const cellData =
              timetables?.[degree]?.[termDayPeriod]?.[day]?.[period] || {
                0: null,
                1: null,
                2: null,
              };
            return (
              <View key={day} style={styles.cell}>
                {renderCell(cellData, day, period)}
              </View>
            );
          })}
        </View>
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>総単位数: {totalCredits}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  headerConstainer: {
    height: 50,
    flexDirection: "row",
    width: "100%",
  },
  headerLeft: {
    flex: 1,
    flexDirection: "row",
  },
  headerRight: {
    width: 100,
    flexDirection: "row",
  },
  degree: {
    flex: 1,
    borderWidth: 0,
  },
  department: {
    flex: 2,
    borderWidth: 0,
  },
  grade: {
    flex: 1,
    borderWidth: 0,
  },
  label: {
    borderWidth: 0,
  },
  drop: {
    borderWidth: 0,
  },
  daysRow: {
    flexDirection: "row",
    backgroundColor: "#ddd",
    paddingVertical: 8,
    borderRadius: 5,
    marginBottom: 5,
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
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#ffffff",
  },
  fullCellContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
  fullCell: {
    textAlign: "center",
    fontSize: 12,
    textAlignVertical: "center",
  },
  splitCell: {
    flex: 1,
    flexDirection: "row",
  },
  quarterContainer: {
    flex: 1,
    justifyContent: "center",
  },
  quarterCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 9,
    textAlignVertical: "center",
  },
  verticalDivider: {
    width: 1,
    backgroundColor: "#ccc",
  },
  emptyCell: {
    flex: 1,
  },
  totalContainer: {
    alignItems: "flex-end",
    marginTop: 10,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TimeTableView;
