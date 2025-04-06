// 学部、学科、コース、専攻、研究室のデータを管理するファイル

// 学部データ
export const schoolData = [
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
export const departmentData = {
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
export const courseData = {
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

// 専攻データ
export const majorData = {
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
  // ...existing code... (以下専攻データの残りの部分)
};

// 研究室データ
export const researchroomData = {
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
  // ...existing code... (以下研究室データの残りの部分)
};

// ロールデータ
export const roleData = [
  { label: "一般学生", value: "commmonStudent" },
  { label: "部/サークル運営者", value: "clubCircleManager" },
  { label: "団体運営者", value: "organizationManager" },
  { label: "コラム投稿者", value: "columnContributor" },
  { label: "管理関係者", value:"management" },
  { label: "上位管理者", value:"superAdministrator" },
];

// 部活動データ
export const clubData = [
  { label: "未所属", value: "null" },
  { label: "陸上競技部", value: "trackAndField" },
  { label: "水泳部", value: "swimming" },
  { label: "テニス部", value: "tennis" }
];
