
export interface ScriptPanel {
  id: number;
  time: string; // 时间
  location: string; // 地点
  shotType: string; // 景别 (全景, 远景, 中景, 近景, 特写)
  soundDescription: string; // 声音描述 (对白, 环境音, 音效, 音乐)
  sceneContent: string; // 场景内容 (摘要/动作)
  cameraMovement: string; // 镜头运动方式 (推, 拉, 摇, 移, 跟)
  characters: string[]; // 角色 (合并了原来的主要、次要、群众)
  costume: string; // 服装
  props: string; // 道具
  aiPromptCn: string; // AI 绘画提示词 (中文)
  aiPromptEn: string; // AI 绘画提示词 (英文)
}

export interface CharacterProfile {
  name: string; // 姓名
  gender: string; // 性别
  age: string; // 年龄
  identity: string; // 身份
  appearance: string; // 人物外貌特征
  background: string; // 所在时代背景
  aiPromptCn: string; // AI 角色立绘提示词 (中文)
  aiPromptEn: string; // AI Character Prompt (English)
}

export interface SceneSetting {
  locationName: string; // 场景名称
  style: string; // 风格
  structure: string; // 空间与结构
  timeWeather: string; // 时间与天气
  atmosphere: string; // 氛围与情绪
  details: string; // 场景道具与细节
  aiPromptCn: string; // AI 场景概念图提示词 (中文)
  aiPromptEn: string; // AI Scene Concept Prompt (English)
}

export interface PropSetting {
  name: string; // 道具名称
  appearance: string; // 外观描述
  aiPromptCn: string; // AI 道具概念图提示词 (中文)
  aiPromptEn: string; // AI Prop Concept Prompt (English)
}

export interface AnalysisResult {
  scenes: ScriptPanel[];
  characters: CharacterProfile[];
  sceneSettings: SceneSetting[];
  propSettings: PropSetting[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}