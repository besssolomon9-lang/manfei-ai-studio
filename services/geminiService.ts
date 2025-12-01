
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, ScriptPanel, CharacterProfile, SceneSetting, PropSetting } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
你是专业的影视统筹、动画导演、音效设计师、场景美术师和道具设计师。你的任务是将用户提供的剧本拆解为标准的“分场景表”、“角色设定表”、“场景设定表”和“道具设定表”。

第一部分：scenes (分场景表)
对于每一场戏，提取：
1. time: 时间
2. location: 地点
3. shotType: 景别 (全景/远景/中景/近景/特写)
4. soundDescription: 声音描述 (整合对白、环境音、音效、音乐)
5. sceneContent: 场景内容 (100字以内摘要)
6. cameraMovement: 镜头运动方式 (详细提取：推/Push, 拉/Pull, 摇/Pan, 移/Truck, 跟/Follow, 升降/Crane, 甩/Whip Pan, 环绕/Arc, 手持/Handheld, 希区柯克变焦/Dolly Zoom, 固定/Static)
7. characters: 角色列表
8. costume: 服装
9. props: 道具 (本场出现的道具列表)
10. aiPromptCn: 画面描述 (中文，用于AI绘画)
11. aiPromptEn: Image Prompt (English, detailed, cinematic)

第二部分：characterProfiles (角色设定)
提取主要角色设定：
1. name: 姓名
2. gender: 性别
3. age: 年龄
4. identity: 身份
5. appearance: 外貌特征
6. background: 时代背景
7. aiPromptCn: 角色立绘提示词 (中文)
8. aiPromptEn: Character Sheet Prompt (English)

第三部分：sceneSettings (场景设定)
提取剧本中出现的主要场景（去重合并），生成美术概念设计方案：
1. locationName: 场景名称
2. style: 风格
3. structure: 空间与结构
4. timeWeather: 时间与天气
5. atmosphere: 氛围与情绪
6. details: 场景道具与细节
7. aiPromptCn: 场景概念图提示词 (中文)
8. aiPromptEn: Scene Concept Art Prompt (English)

第四部分：propSettings (道具设定)
提取剧本中出现的关键道具（去重合并），生成设计方案：
1. name: 道具名称
2. appearance: 外观描述 (详细描述形状、颜色、材质、纹理、尺寸等)
3. aiPromptCn: 道具概念图提示词 (中文，白底背景，高精度)
4. aiPromptEn: Prop Concept Art Prompt (English, white background, high detail, 8k)

Strictly return valid JSON object:
{
  "scenes": [...],
  "characterProfiles": [...],
  "sceneSettings": [...],
  "propSettings": [
    {
      "name": "黑色信封",
      "appearance": "黑色牛皮纸材质，表面粗糙，封口处有红色火漆印，边缘略有磨损。尺寸约为16x23cm。",
      "aiPromptCn": "黑色信封，牛皮纸材质，红色火漆印，做旧质感，白底...",
      "aiPromptEn": "Black envelope, kraft paper texture, red wax seal, worn edges, white background..."
    }
  ]
}
`;

export const analyzeScript = async (scriptText: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: scriptText,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      throw new Error("AI 未返回任何内容");
    }

    let jsonStr = response.text.trim();
    if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const data = JSON.parse(jsonStr);
    
    // Parse Scenes
    const rawScenes = data.scenes || (Array.isArray(data) ? data : []);
    const scenes: ScriptPanel[] = rawScenes.map((item: any, index: number) => ({
      ...item,
      id: index + 1,
      characters: Array.isArray(item.characters) ? item.characters : (item.mainCharacters || []),
      costume: item.costume || "无",
      props: item.props || "无",
      sceneContent: item.sceneContent || item.action || "无描述",
      cameraMovement: item.cameraMovement || "固定",
      time: item.time || "未知",
      location: item.location || "未知",
      shotType: item.shotType || "未知",
      soundDescription: item.soundDescription || "无声音描述",
      aiPromptCn: item.aiPromptCn || "无中文提示词",
      aiPromptEn: item.aiPromptEn || item.imagePrompt || "No prompt generated",
    }));

    // Parse Characters
    const rawChars = data.characterProfiles || [];
    const characters: CharacterProfile[] = rawChars.map((item: any) => ({
      name: item.name || "未知角色",
      gender: item.gender || "未知",
      age: item.age || "未知",
      identity: item.identity || "未知",
      appearance: item.appearance || "无详细描述",
      background: item.background || "无背景描述",
      aiPromptCn: item.aiPromptCn || "无角色提示词",
      aiPromptEn: item.aiPromptEn || "No character prompt",
    }));

    // Parse Scene Settings
    const rawSceneSettings = data.sceneSettings || [];
    const sceneSettings: SceneSetting[] = rawSceneSettings.map((item: any) => ({
      locationName: item.locationName || item.location || "未知场景",
      style: item.style || "无风格描述",
      structure: item.structure || "无结构描述",
      timeWeather: item.timeWeather || "无时间天气",
      atmosphere: item.atmosphere || "无氛围描述",
      details: item.details || "无细节描述",
      aiPromptCn: item.aiPromptCn || "无场景提示词",
      aiPromptEn: item.aiPromptEn || "No scene prompt",
    }));

    // Parse Prop Settings
    const rawPropSettings = data.propSettings || [];
    const propSettings: PropSetting[] = rawPropSettings.map((item: any) => ({
      name: item.name || "未知道具",
      appearance: item.appearance || "无描述",
      aiPromptCn: item.aiPromptCn || "无道具提示词",
      aiPromptEn: item.aiPromptEn || "No prop prompt",
    }));

    return { scenes, characters, sceneSettings, propSettings };

  } catch (error) {
    console.error("Error analyzing script:", error);
    throw error;
  }
};
