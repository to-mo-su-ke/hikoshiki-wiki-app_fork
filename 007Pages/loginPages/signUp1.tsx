/*
ユーザー情報のうち学年、学部～研究室を登録する画面です

ユーザー情報についてのfirestoreのデータ構造

firestore
|--user(コレクション)
|  |--{uid}(ドキュメント)
|  |  |  以下はフィールド
|  |  |--username
|  |  |--grade
|  |  |--school
|  |  |--department
|  |  |--course
|  |  |--major
|  |  |--researchroom
|  |  |--role
|  |  |--club

*/


import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Button,
  Alert,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList
} from "react-native";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../004BackendModules/messageMetod/firebase"; // これが正しく設定されていることを確認
import { ScrollView } from "react-native-gesture-handler";
import { Dropdown } from "react-native-paper-dropdown"

//部活動・サークル
const clubData = [
  { label: "未所属", value: "null" },
  { label: "陸上競技部", value: "trackAndField" },
  { label: "水泳部", value: "swimming" },
  { label: "テニス部", value: "tennis" }
]




export default function InputPersonalInformationScreen1({ navigation, route }) { 
  const [uid, setUid] = useState("");
  const email = route.params.email;
  const password = route.params.password;

  // 永続化をbrowserLocalPersistenceで設定
  // setPersistence(auth, browserLocalPersistence)
  //   .then(() => {
  //     console.log("Persistence set to local.");
  //   })
  //   .catch((error) => {
  //     console.error("Error setting persistence:", error);
  //   });


  //学部~研究室を選択するためのデータ。未配属の場合はそれぞれのプロパティの値は"unaffiliated"です
  // 学部データ
const schoolData = [
  { label: "文学部", value: "literature" },
  { label: "教育学部", value: "education" },
  { label: "法学部", value: "law" },
  { label: "経済学部", value: "economics" },
  { label: "情報学部", value: "informatics" },
  { label: "理学部", value: "science" },
  { label: "医学部", value: "medicine" },
  { label: "工学部", value: "engineering" },
  { label: "農学部", value: "agriculture" }
];

  // 学科データ
const departmentData = {
  literature: [
    { label: "人文学科", value: "humanities" }
  ],
  education: [
    { label: "人間発達科学科", value: "humanDevelopment" }
  ],
  law: [
    { label: "法律・政治学科", value: "lawPolitics" }
  ],
  economics: [
    { label: "経済学科", value: "economicScience" },
    { label: "経営学科", value: "management" }
  ],
  informatics: [
    { label: "自然情報学科", value: "naturalInformatics" },
    { label: "人間・社会情報学科", value: "humanSocialInformatics" },
    { label: "コンピュータ科学科", value: "computerScience" }
  ],
  science: [
    { label: "学科配属前", value: "unaffiliated" },
    { label: "数理学科", value: "mathematics" },
    { label: "物理学科", value: "physics" },
    { label: "化学科", value: "chemistry" },
    { label: "生命理学科", value: "biologicalScience" },
    { label: "地球惑星科学科", value: "earthPlanetarySciences" }
  ],
  medicine: [
    { label: "医学科", value: "medicalScience" },
    { label: "保健学科", value: "healthSciences" }
  ],
  engineering: [
    { label: "学科配属前", value: "unaffiliated" },
    { label: "化学生命工学科", value: "chemicalBiologicalEngineering" },
    { label: "物理工学科", value: "physicalScience" },
    { label: "マテリアル工学科", value: "materials" },
    { label: "電気電子情報工学科", value: "electricalElectronicInfo" },
    { label: "機械・航空宇宙工学科", value: "mechanicalAerospace" },
    { label: "エネルギー理工学科", value: "energyEngineering" },
    { label: "環境土木・建築学科", value: "civilArchitecture" }
  ],
  agriculture: [
    { label: "生物環境科学科", value: "bioenvironmentalScience" },
    { label: "資源生物科学科", value: "bioresourceScience" },
    { label: "応用生命科学科", value: "appliedBioscience" }
  ]
};

  // コースデータ
const courseData = {
  unaffiliated: [
    { label: "コース配属前", value: "unaffiliated" }
  ],
  // 文学部
  humanities: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "言語学コース", value: "linguistics" },
    { label: "文学コース", value: "literature" },
    { label: "哲学倫理学コース", value: "philosophyEthics" },
    { label: "歴史学・人類学コース", value: "historyAnthropology" },
    { label: "文化資源学コース", value: "culturalResources" }
  ],
  // 教育学部
  humanDevelopment: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "教育科学コース", value: "educationalScience" },
    { label: "心理発達科学コース", value: "psychologicalDevelopment" },
    { label: "発達臨床コース", value: "developmentalClinical" }
  ],
  // 法学部
  lawPolitics: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "法学コース", value: "law" },
    { label: "政治学コース", value: "politics" }
  ],
  // 経済学部
  economicScience: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "理論・計量経済学コース", value: "theoreticalEconomics" },
    { label: "応用経済学コース", value: "appliedEconomics" },
    { label: "政策科学コース", value: "policyScience" }
  ],
  management: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "経営学コース", value: "businessManagement" },
    { label: "会計学コース", value: "accounting" }
  ],
  // 情報学部
  naturalInformatics: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "数理情報コース", value: "mathematicalInformatics" },
    { label: "物理情報コース", value: "physicalInformatics" },
    { label: "生命情報コース", value: "biologicalInformatics" }
  ],
  humanSocialInformatics: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "認知情報コース", value: "cognitiveInformatics" },
    { label: "社会情報コース", value: "socialInformatics" }
  ],
  computerScience: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "知能システムコース", value: "intelligentSystems" },
    { label: "ソフトウェア基礎コース", value: "softwareFoundations" },
    { label: "システム情報コース", value: "systemInformation" }
  ],
  // 理学部
  mathematics: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "数理科学コース", value: "mathematicalScience" },
    { label: "計算理学コース", value: "computationalScience" }
  ],
  physics: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "物性物理学コース", value: "condensedMatterPhysics" },
    { label: "素粒子宇宙物理学コース", value: "particleAstrophysics" }
  ],
  chemistry: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "物理化学コース", value: "physicalChemistry" },
    { label: "有機化学コース", value: "organicChemistry" },
    { label: "無機化学コース", value: "inorganicChemistry" }
  ],
  biologicalScience: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "分子生物学コース", value: "molecularBiology" },
    { label: "細胞生物学コース", value: "cellBiology" },
    { label: "生態学コース", value: "ecology" }
  ],
  earthPlanetarySciences: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "地球惑星物理学コース", value: "geophysics" },
    { label: "地質・地球生物学コース", value: "geologyGeobiology" }
  ],
  // 医学部
  medicalScience: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "基礎医学コース", value: "basicMedicine" },
    { label: "臨床医学コース", value: "clinicalMedicine" }
  ],
  healthSciences: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "看護学コース", value: "nursing" },
    { label: "理学療法学コース", value: "physicalTherapy" },
    { label: "作業療法学コース", value: "occupationalTherapy" },
    { label: "放射線技術科学コース", value: "radiologicalTechnology" }
  ],
  // 工学部
  chemicalBiologicalEngineering: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "化学工学コース", value: "chemicalEngineering" },
    { label: "生物工学コース", value: "biotechnology" }
  ],
  physicalScience: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "応用物理学コース", value: "appliedPhysics" },
    { label: "量子エネルギーコース", value: "quantumEnergy" }
  ],
  materials: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "材料設計コース", value: "materialDesign" },
    { label: "材料プロセスコース", value: "materialProcessing" }
  ],
  electricalElectronicInfo: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "電気電子工学コース", value: "electricalElectronicEngineering" },
    { label: "情報通信コース", value: "informationCommunication" },
    { label: "計算機科学コース", value: "computerEngineering" }
  ],
  mechanicalAerospace: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "機械工学コース", value: "mechanicalEngineering" },
    { label: "航空宇宙工学コース", value: "aerospaceEngineering" }
  ],
  energyEngineering: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "エネルギー材料コース", value: "energyMaterials" },
    { label: "エネルギーシステムコース", value: "energySystems" }
  ],
  civilArchitecture: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "土木工学コース", value: "civilEngineering" },
    { label: "建築学コース", value: "architecture" },
    { label: "環境工学コース", value: "environmentalEngineering" }
  ],
  // 農学部
  bioenvironmentalScience: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "自然環境学コース", value: "naturalEnvironment" },
    { label: "循環資源学コース", value: "resourceCycling" }
  ],
  bioresourceScience: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "植物生産科学コース", value: "plantProductionScience" },
    { label: "動物科学コース", value: "animalScience" },
    { label: "水圏生物科学コース", value: "aquaticBioscience" }
  ],
  appliedBioscience: [
    { label: "コース配属前", value: "unaffiliated" },
    { label: "分子生命科学コース", value: "molecularLifeScience" },
    { label: "食糧科学コース", value: "foodScience" }
  ]
};

  //専攻データ
const majorData = {
  unaffiliated: [
    { label: "専攻選択前", value: "unaffiliated" }
  ],
  // 文学部
  linguistics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "理論言語学専攻", value: "theoreticalLinguistics" },
    { label: "応用言語学専攻", value: "appliedLinguistics" },
    { label: "日本語学専攻", value: "japaneseLinguistics" }
  ],
  literature: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "日本文学専攻", value: "japaneseLiterature" },
    { label: "西洋文学専攻", value: "westernLiterature" },
    { label: "比較文学専攻", value: "comparativeLiterature" }
  ],
  philosophyEthics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "哲学史専攻", value: "historyOfPhilosophy" },
    { label: "倫理学専攻", value: "ethics" },
    { label: "宗教学専攻", value: "religiousStudies" }
  ],
  historyAnthropology: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "日本史専攻", value: "japaneseHistory" },
    { label: "東洋史専攻", value: "asianHistory" },
    { label: "西洋史専攻", value: "westernHistory" },
    { label: "考古学専攻", value: "archaeology" }
  ],
  culturalResources: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "博物館学専攻", value: "museology" },
    { label: "文化財保存学専攻", value: "culturalPreservation" }
  ],
  
  // 教育学部
  educationalScience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "教育社会学専攻", value: "educationalSociology" },
    { label: "教育工学専攻", value: "educationalTechnology" },
    { label: "カリキュラム開発専攻", value: "curriculumDevelopment" }
  ],
  psychologicalDevelopment: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "認知心理学専攻", value: "cognitivePsychology" },
    { label: "発達心理学専攻", value: "developmentalPsychology" }
  ],
  developmentalClinical: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "臨床心理学専攻", value: "clinicalPsychology" },
    { label: "特別支援教育専攻", value: "specialNeedsEducation" }
  ],
  
  // 法学部
  law: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "民法専攻", value: "civilLaw" },
    { label: "刑法専攻", value: "criminalLaw" },
    { label: "国際法専攻", value: "internationalLaw" },
    { label: "憲法専攻", value: "constitutionalLaw" }
  ],
  politics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "政治理論専攻", value: "politicalTheory" },
    { label: "国際政治専攻", value: "internationalPolitics" },
    { label: "政治過程論専攻", value: "politicalProcess" }
  ],
  
  // 経済学部
  theoreticalEconomics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "マクロ経済学専攻", value: "macroeconomics" },
    { label: "ミクロ経済学専攻", value: "microeconomics" },
    { label: "計量経済学専攻", value: "econometrics" }
  ],
  appliedEconomics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "国際経済学専攻", value: "internationalEconomics" },
    { label: "開発経済学専攻", value: "developmentEconomics" },
    { label: "環境経済学専攻", value: "environmentalEconomics" }
  ],
  policyScience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "財政学専攻", value: "publicFinance" },
    { label: "社会保障論専攻", value: "socialSecurity" }
  ],
  businessManagement: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "経営戦略専攻", value: "managementStrategy" },
    { label: "人的資源管理専攻", value: "humanResourceManagement" },
    { label: "マーケティング専攻", value: "marketing" }
  ],
  accounting: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "財務会計専攻", value: "financialAccounting" },
    { label: "管理会計専攻", value: "managementAccounting" },
    { label: "監査論専攻", value: "auditing" }
  ],
  
  // 情報学部
  mathematicalInformatics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "数理統計学専攻", value: "mathematicalStatistics" },
    { label: "数理モデリング専攻", value: "mathematicalModeling" }
  ],
  physicalInformatics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "計算物理学専攻", value: "computationalPhysics" },
    { label: "情報物理学専攻", value: "informationPhysics" }
  ],
  biologicalInformatics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "生物情報学専攻", value: "bioinformatics" },
    { label: "神経情報学専攻", value: "neuroinformatics" }
  ],
  cognitiveInformatics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "認知科学専攻", value: "cognitiveScience" },
    { label: "知覚情報処理専攻", value: "perceptualInformationProcessing" }
  ],
  socialInformatics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "社会情報学専攻", value: "socialInformatics" },
    { label: "メディア情報学専攻", value: "mediaInformatics" }
  ],
  intelligentSystems: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "人工知能専攻", value: "artificialIntelligence" },
    { label: "機械学習専攻", value: "machineLearning" },
    { label: "知能ロボティクス専攻", value: "intelligentRobotics" }
  ],
  softwareFoundations: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "プログラミング言語専攻", value: "programmingLanguages" },
    { label: "ソフトウェア工学専攻", value: "softwareEngineering" }
  ],
  systemInformation: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "データベース専攻", value: "database" },
    { label: "ネットワーク専攻", value: "network" },
    { label: "情報セキュリティ専攻", value: "informationSecurity" }
  ],
  
  // 理学部
  mathematicalScience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "代数学専攻", value: "algebra" },
    { label: "幾何学専攻", value: "geometry" },
    { label: "解析学専攻", value: "analysis" }
  ],
  computationalScience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "計算数学専攻", value: "computationalMathematics" },
    { label: "数値解析専攻", value: "numericalAnalysis" }
  ],
  condensedMatterPhysics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "固体物理学専攻", value: "solidStatePhysics" },
    { label: "量子多体系専攻", value: "quantumManyBodySystems" }
  ],
  particleAstrophysics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "素粒子物理学専攻", value: "particlePhysics" },
    { label: "宇宙物理学専攻", value: "astrophysics" },
    { label: "相対論専攻", value: "relativity" }
  ],
  physicalChemistry: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "量子化学専攻", value: "quantumChemistry" },
    { label: "分光学専攻", value: "spectroscopy" },
    { label: "理論化学専攻", value: "theoreticalChemistry" }
  ],
  organicChemistry: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "有機合成化学専攻", value: "organicSynthesis" },
    { label: "天然物化学専攻", value: "naturalProductsChemistry" }
  ],
  inorganicChemistry: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "無機材料化学専攻", value: "inorganicMaterialsChemistry" },
    { label: "錯体化学専攻", value: "coordinationChemistry" }
  ],
  molecularBiology: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "遺伝子工学専攻", value: "geneticEngineering" },
    { label: "分子遺伝学専攻", value: "molecularGenetics" }
  ],
  cellBiology: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "細胞生理学専攻", value: "cellularPhysiology" },
    { label: "発生生物学専攻", value: "developmentalBiology" }
  ],
  ecology: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "生態系生態学専攻", value: "ecosystemEcology" },
    { label: "進化生態学専攻", value: "evolutionaryEcology" },
    { label: "保全生態学専攻", value: "conservationEcology" }
  ],
  geophysics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "固体地球物理学専攻", value: "solidEarthGeophysics" },
    { label: "気象学専攻", value: "meteorology" },
    { label: "海洋物理学専攻", value: "oceanPhysics" }
  ],
  geologyGeobiology: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "地質学専攻", value: "geology" },
    { label: "古生物学専攻", value: "paleontology" },
    { label: "鉱物学専攻", value: "mineralogy" }
  ],
  
  // 医学部
  basicMedicine: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "解剖学専攻", value: "anatomy" },
    { label: "生理学専攻", value: "physiology" },
    { label: "生化学専攻", value: "biochemistry" },
    { label: "微生物学専攻", value: "microbiology" }
  ],
  clinicalMedicine: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "内科学専攻", value: "internalMedicine" },
    { label: "外科学専攻", value: "surgery" },
    { label: "小児科学専攻", value: "pediatrics" },
    { label: "精神医学専攻", value: "psychiatry" }
  ],
  nursing: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "基礎看護学専攻", value: "basicNursing" },
    { label: "成人看護学専攻", value: "adultNursing" },
    { label: "母性看護学専攻", value: "maternalNursing" }
  ],
  physicalTherapy: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "運動療法専攻", value: "therapeuticExercise" },
    { label: "物理療法専攻", value: "physicalAgentTherapy" }
  ],
  occupationalTherapy: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "身体障害領域専攻", value: "physicalDisabilities" },
    { label: "精神障害領域専攻", value: "mentalDisabilities" }
  ],
  radiologicalTechnology: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "診療放射線技術学専攻", value: "diagnosticRadiology" },
    { label: "核医学専攻", value: "nuclearMedicine" },
    { label: "放射線治療専攻", value: "radiationTherapy" }
  ],
  
  // 工学部
  chemicalEngineering: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "反応工学専攻", value: "reactionEngineering" },
    { label: "分離工学専攻", value: "separationEngineering" }
  ],
  biotechnology: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "生物化学工学専攻", value: "biochemicalEngineering" },
    { label: "遺伝子組換え技術専攻", value: "geneticModification" }
  ],
  appliedPhysics: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "光工学専攻", value: "opticalEngineering" },
    { label: "半導体工学専攻", value: "semiconductorEngineering" }
  ],
  quantumEnergy: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "原子力工学専攻", value: "nuclearEngineering" },
    { label: "量子ビーム工学専攻", value: "quantumBeamEngineering" }
  ],
  materialDesign: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "構造材料設計専攻", value: "structuralMaterialDesign" },
    { label: "機能材料設計専攻", value: "functionalMaterialDesign" }
  ],
  materialProcessing: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "材料加工学専攻", value: "materialProcessingTechnology" },
    { label: "材料評価学専攻", value: "materialEvaluation" }
  ],
  electricalElectronicEngineering: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "電力工学専攻", value: "powerEngineering" },
    { label: "電子回路専攻", value: "electronicCircuits" },
    { label: "電磁波工学専攻", value: "electromagneticWaveEngineering" }
  ],
  informationCommunication: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "通信工学専攻", value: "communicationEngineering" },
    { label: "情報理論専攻", value: "informationTheory" }
  ],
  computerEngineering: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "計算機アーキテクチャ専攻", value: "computerArchitecture" },
    { label: "組込みシステム専攻", value: "embeddedSystems" }
  ],
  mechanicalEngineering: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "機械力学専攻", value: "mechanicalDynamics" },
    { label: "熱流体工学専攻", value: "thermalFluidEngineering" },
    { label: "機械設計専攻", value: "mechanicalDesign" }
  ],
  aerospaceEngineering: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "航空工学専攻", value: "aeronauticalEngineering" },
    { label: "宇宙工学専攻", value: "spaceEngineering" },
    { label: "推進工学専攻", value: "propulsionEngineering" }
  ],
  energyMaterials: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "エネルギー変換材料専攻", value: "energyConversionMaterials" },
    { label: "蓄電材料専攻", value: "energyStorageMaterials" }
  ],
  energySystems: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "再生可能エネルギー専攻", value: "renewableEnergy" },
    { label: "スマートグリッド専攻", value: "smartGrid" }
  ],
  civilEngineering: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "構造工学専攻", value: "structuralEngineering" },
    { label: "地盤工学専攻", value: "geotechnicalEngineering" },
    { label: "水工学専攻", value: "hydraulicEngineering" }
  ],
  architecture: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "建築構造専攻", value: "architecturalStructure" },
    { label: "建築計画専攻", value: "architecturalPlanning" },
    { label: "建築環境専攻", value: "architecturalEnvironment" }
  ],
  environmentalEngineering: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "環境システム専攻", value: "environmentalSystems" },
    { label: "水環境工学専攻", value: "waterEnvironmentalEngineering" }
  ],
  
  // 農学部
  naturalEnvironment: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "森林科学専攻", value: "forestScience" },
    { label: "生態系保全専攻", value: "ecosystemConservation" }
  ],
  resourceCycling: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "環境土壌学専攻", value: "environmentalSoilScience" },
    { label: "バイオマス利用専攻", value: "biomassUtilization" }
  ],
  plantProductionScience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "作物学専攻", value: "cropScience" },
    { label: "園芸学専攻", value: "horticulturalScience" },
    { label: "植物病理学専攻", value: "plantPathology" }
  ],
  animalScience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "家畜生理学専攻", value: "animalPhysiology" },
    { label: "動物栄養学専攻", value: "animalNutrition" },
    { label: "家畜育種学専攻", value: "animalBreeding" }
  ],
  aquaticBioscience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "水産生物学専攻", value: "fisheryBiology" },
    { label: "水圏生態学専攻", value: "aquaticEcology" },
    { label: "増養殖学専攻", value: "aquaculture" }
  ],
  molecularLifeScience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "分子生物工学専攻", value: "molecularBioengineering" },
    { label: "タンパク質工学専攻", value: "proteinEngineering" }
  ],
  foodScience: [
    { label: "専攻選択前", value: "unaffiliated" },
    { label: "食品化学専攻", value: "foodChemistry" },
    { label: "食品加工学専攻", value: "foodProcessing" },
    { label: "栄養科学専攻", value: "nutritionalScience" }
  ]
};

  //研究室データ
  const researchroomData = {
    unaffiliated: [
      { label: "研究室配属前", value: "unaffiliated"}
    ],
    a: [
      { label: "aa", value: "aa" },
      { label: "ab", value: "ab" },
    ],
    b: [
      { label: "ba", value: "ba" },
      { label: "bb", value: "bb" },
    ],
    c: [
      { label: "ca", value: "ca" },
      { label: "cb", value: "cb" },
    ],
    d: [
      { label: "da", value: "da" },
      { label: "db", value: "db" },
    ],
    e: [
      { label: "ea", value: "ea" },
      { label: "eb", value: "eb" },
    ],
    f: [
      { label: "fa", value: "fa" },
      { label: "fb", value: "fb" },
    ],
    g: [
      { label: "ga", value: "ga" },
      { label: "gb", value: "gb" },
    ],
    h: [
      { label: "ha", value: "ha" },
      { label: "hb", value: "hb" },
    ],
  };

  //ロールデータ
  const roleData = [
    { label: "一般学生", value: "commmonStudent" },
    { label: "部/サークル運営者", value: "clubCircleManager" },
    { label: "団体運営者", value: "organizationManager" },
    { label: "コラム投稿者", value: "columnContributor" },
    { label: "管理関係者", value:"management" },
    { label: "上位管理者", value:"superAdministrator" },
  ];

  
  
  const [username, setUsername] = useState("");
  const [grade, setGrade] = useState(null);
  const [school, setSchool] = useState(null);
  const [department, setDepartment] = useState(null);
  const [course, setCourse] = useState(null);
  const [major, setMajor] = useState(null);
  const [researchroom, setResearchroom] = useState(null);
  const [role, setRole] = useState("");


  const handleSubmit = () => {
    if (
      !username ||
      !grade ||
      !school ||
      !department ||
      !course ||
      !major ||
      !researchroom    
    ) {
      Alert.alert("全てのフィールドを入力してください");
      return;
    }


    const information = {
      username,
      grade,
      school,
      department,
      course,
      major,
      researchroom,
        };

    navigation.navigate("InputPersonalInformationScreen2", { email, password, information });
  };


  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>ユーザー情報登録</Text>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>1. 基本情報</Text>
        <Text style={styles.inputLabel}>ユーザー名</Text>
        <TextInput
          style={styles.input}
          placeholder="ユーザー名"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.inputLabel}>学年</Text>
        <Dropdown
          label="学年"
          placeholder={"選択してください"}
          options={[
            { label: "学部1年", value: "1" },
            { label: "学部2年", value: "2" },
            { label: "学部3年", value: "3" },
            { label: "学部4年", value: "4" },
            { label: "修士1年", value: "5" },
            { label: "修士2年", value: "6" },
            { label: "博士1年", value: "7" },
            { label: "博士2年", value: "8" },
          ]}
          onSelect={setGrade}
          value={grade}
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>2. 所属情報</Text>
        
        {/* 学部選択 */}
        <Text>3.1 学部</Text>
        <Dropdown
          label="学部"
          placeholder={'学部を選択してください'}
          onSelect={(value) => {
            setSchool(value);
            setDepartment(null); // 学部変更時に学科をリセット
            setCourse(null); // 学部変更時にコースをリセット
            setMajor(null); // 学部変更時に専攻をリセット
            setResearchroom(null); // 学部変更時に研究室をリセット
          }}
          options={schoolData}
          value={school}
        />

        {/* 学科選択 */}
        <Text>3.2 学科</Text>
        <Dropdown
          label="学科"
          placeholder={'学科を選択してください'}
          onSelect={(value) => {
            setDepartment(value);
            setCourse(null); // 学科変更時にコースをリセット
            setMajor(null); // 学科変更時に専攻をリセット
            setResearchroom(null); // 学科変更時に研究室をリセット
          }}
          options={school ? departmentData[school] : []}
          value={department}
        />

        {/* コース選択 */}
        <Text>3.3 コース</Text>
        <Dropdown
          label="コース"
          placeholder={'コースを選択してください'}
          onSelect={(value) => {
            setCourse(value)
            setMajor(null); // コース変更時に専攻をリセット
            setResearchroom(null); // コース変更時に研究室をリセット
          }}
          options={department ? courseData[department] : []}
          value={course}
        />

        {/* 専攻選択 */}
        <Text>3.3 専攻</Text>
        <Dropdown
          label="専攻"
          placeholder={'専攻を選択してください'}
          onSelect={(value) => {
            setMajor(value)
            setResearchroom(null); // 専攻変更時に研究室をリセット
          }}
          options={course ? majorData[course] : []}
          value={major}
        />

        {/* 院(研究室)選択 */}
        <Text>3.4 院</Text>
        <Dropdown
          label="研究室"
          placeholder={'研究室を選択してください'}
          onSelect={(value) => setResearchroom(value)}
          options={major ? researchroomData[major] : []}
          value={researchroom}
        />

      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
        <Text style={styles.buttonText}>次へ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1e3a8a",
    textAlign: "center",
  },
  sectionContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#334155",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#475569",
  },
  input: {
    height: 50,
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  buttonContainer: {
    backgroundColor: "#1e3a8a",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

