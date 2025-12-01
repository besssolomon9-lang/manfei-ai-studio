import React, { useState, useRef } from 'react';
import { analyzeScript } from './services/geminiService';
import { ScriptPanel, CharacterProfile, SceneSetting, PropSetting, AppState } from './types';
import PanelCard from './components/PanelCard';
import CharacterCard from './components/CharacterCard';
import SceneSettingCard from './components/SceneSettingCard';
import PropSettingCard from './components/PropSettingCard';
import { IconSparkles, IconMovie, IconDownload, IconUpload, IconUser, IconMap, IconBox } from './components/Icons';

const DEFAULT_SCRIPT = `
(深夜，破旧的公寓楼道，声控灯忽明忽暗)
李明气喘吁吁地跑上楼梯，手里紧紧攥着一个黑色的信封。他回头看了一眼，楼下空无一人，只有风吹动铁门的吱呀声。
他颤抖着掏出钥匙，插了几次才插进锁孔。
进屋后，他猛地关上门，背靠在门板上滑落坐在地上，大口喘气。
房间里很乱，泡面桶散落在茶几上。
李明拆开信封，里面是一张照片。
他瞳孔放大，惊恐地捂住了嘴。
`;

type TabType = 'SCENES' | 'CHARACTERS' | 'SCENE_SETTINGS' | 'PROP_SETTINGS';

const App: React.FC = () => {
  const [inputScript, setInputScript] = useState<string>(DEFAULT_SCRIPT);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [panels, setPanels] = useState<ScriptPanel[]>([]);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [sceneSettings, setSceneSettings] = useState<SceneSetting[]>([]);
  const [propSettings, setPropSettings] = useState<PropSetting[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('SCENES');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!inputScript.trim()) return;
    
    setAppState(AppState.LOADING);
    setErrorMsg(null);
    setPanels([]); 
    setCharacters([]);
    setSceneSettings([]);
    setPropSettings([]);

    try {
      const result = await analyzeScript(inputScript);
      setPanels(result.scenes);
      setCharacters(result.characters);
      setSceneSettings(result.sceneSettings);
      setPropSettings(result.propSettings);
      setAppState(AppState.SUCCESS);
      setActiveTab('SCENES'); 
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "解析剧本时发生错误，请稍后重试。");
      setAppState(AppState.ERROR);
    }
  };

  const handleExport = () => {
    if (activeTab === 'SCENES' && panels.length > 0) {
      // Reordered CSV headers: Content, Camera, Sound
      const csvContent = "data:text/csv;charset=utf-8," 
        + "场次,时间,地点,景别,场景内容,镜头运动,声音描述,角色,服装,道具,AI提示词(中),AI提示词(英)\n"
        + panels.map(p => {
            const clean = (text: string) => `"${text.replace(/"/g, '""')}"`;
            return `${p.id},${clean(p.time)},${clean(p.location)},${clean(p.shotType)},${clean(p.sceneContent)},${clean(p.cameraMovement)},${clean(p.soundDescription)},${clean(p.characters.join('、'))},${clean(p.costume)},${clean(p.props)},${clean(p.aiPromptCn)},${clean(p.aiPromptEn)}`;
          }).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "scenes_breakdown.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (activeTab === 'CHARACTERS' && characters.length > 0) {
       const csvContent = "data:text/csv;charset=utf-8," 
        + "角色姓名,性别,年龄,身份,人物外貌特征,所在时代背景,AI提示词(中),AI提示词(英)\n"
        + characters.map(c => {
            const clean = (text: string) => `"${text.replace(/"/g, '""')}"`;
            return `${clean(c.name)},${clean(c.gender)},${clean(c.age)},${clean(c.identity)},${clean(c.appearance)},${clean(c.background)},${clean(c.aiPromptCn)},${clean(c.aiPromptEn)}`;
          }).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "character_profiles.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (activeTab === 'SCENE_SETTINGS' && sceneSettings.length > 0) {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "场景名称,风格,空间与结构,时间与天气,氛围与情绪,场景道具与细节,AI提示词(中),AI提示词(英)\n"
        + sceneSettings.map(s => {
            const clean = (text: string) => `"${text.replace(/"/g, '""')}"`;
            return `${clean(s.locationName)},${clean(s.style)},${clean(s.structure)},${clean(s.timeWeather)},${clean(s.atmosphere)},${clean(s.details)},${clean(s.aiPromptCn)},${clean(s.aiPromptEn)}`;
          }).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "scene_settings.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (activeTab === 'PROP_SETTINGS' && propSettings.length > 0) {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "道具名称,外观描述,AI提示词(中),AI提示词(英)\n"
        + propSettings.map(p => {
            const clean = (text: string) => `"${text.replace(/"/g, '""')}"`;
            return `${clean(p.name)},${clean(p.appearance)},${clean(p.aiPromptCn)},${clean(p.aiPromptEn)}`;
          }).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "prop_settings.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    event.target.value = '';

    try {
      if (file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          if (text) setInputScript(text);
        };
        reader.onerror = () => setErrorMsg("读取文件失败");
        reader.readAsText(file);
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          if (arrayBuffer && (window as any).mammoth) {
            try {
              const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
              setInputScript(result.value);
            } catch (err) {
              console.error(err);
              setErrorMsg("无法解析 Word 文档，请确保文件未损坏。");
            }
          } else {
             setErrorMsg("无法加载文档解析库 (Mammoth.js)，请刷新页面重试。");
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setErrorMsg("不支持的文件格式。请上传 .txt 或 .docx 文件。");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("文件上传出错");
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const hasData = panels.length > 0 || characters.length > 0 || sceneSettings.length > 0 || propSettings.length > 0;

  return (
    <div className="min-h-screen bg-blue-950 text-blue-50 flex flex-col font-sans">
      
      {/* Navbar */}
      <header className="border-b border-blue-800 bg-blue-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <IconMovie />
            <h1 className="text-xl font-bold tracking-tight text-white">漫飞工作室<span className="text-sky-400">-剧本拆解系统</span></h1>
          </div>
          <div className="text-sm text-blue-300 hidden sm:block">
            Gemini 2.5 剧本场景表生成器
          </div>
        </div>
      </header>

      <main className="flex-grow w-full px-6 py-6 flex flex-col gap-6">
        
        {/* Input Section */}
        <div className="w-full flex flex-col gap-4">
           {/* Top Controls */}
           <div className="flex flex-col md:flex-row gap-4 items-start md:items-stretch h-auto md:h-48">
              <div className="flex-grow w-full relative group h-64 md:h-auto">
                <textarea
                  className="w-full h-full bg-blue-900 text-blue-100 p-4 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-sky-500/50 border border-blue-800 placeholder-blue-400 leading-relaxed font-mono text-sm custom-scrollbar"
                  placeholder="在此处粘贴剧本内容，或者点击右侧按钮上传文件..."
                  value={inputScript}
                  onChange={(e) => setInputScript(e.target.value)}
                  disabled={appState === AppState.LOADING}
                />
              </div>

              <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto">
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept=".txt,.docx,.doc"
                  onChange={handleFileUpload}
                />

                <button
                  onClick={triggerFileUpload}
                  disabled={appState === AppState.LOADING}
                  className="h-12 px-6 bg-blue-900 hover:bg-blue-800 text-blue-100 border border-blue-800 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-lg active:scale-95"
                  title="支持 .txt 和 .docx 格式"
                >
                  <IconUpload /> 上传剧本
                </button>

                <button
                  onClick={handleAnalyze}
                  disabled={appState === AppState.LOADING || !inputScript.trim()}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all shadow-lg min-h-[48px]
                    ${appState === AppState.LOADING 
                      ? 'bg-blue-800 cursor-wait text-blue-400' 
                      : 'bg-sky-600 hover:bg-sky-500 text-white hover:shadow-sky-500/25 active:transform active:scale-95'
                    }`}
                >
                  {appState === AppState.LOADING ? '分析中...' : '开始拆解'}
                  {!appState.startsWith('LOAD') && <IconSparkles />}
                </button>
                
                {hasData && (
                   <button 
                    onClick={handleExport}
                    className="h-12 px-4 bg-blue-900 hover:bg-blue-800 text-blue-200 border border-blue-800 rounded-xl transition-colors flex items-center justify-center gap-2"
                   >
                     <IconDownload /> 导出当前表格
                   </button>
                )}
              </div>
           </div>
           {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Results Area */}
        {appState === AppState.SUCCESS && hasData && (
          <div className="flex-grow flex flex-col gap-4">
            {/* Tab Navigation */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('SCENES')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'SCENES' 
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' 
                    : 'bg-blue-900 text-blue-300 hover:text-blue-100 hover:bg-blue-800'
                }`}
              >
                <IconMovie /> 分镜列表 ({panels.length})
              </button>
              <button
                onClick={() => setActiveTab('CHARACTERS')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'CHARACTERS' 
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' 
                    : 'bg-blue-900 text-blue-300 hover:text-blue-100 hover:bg-blue-800'
                }`}
              >
                <IconUser /> 角色设定 ({characters.length})
              </button>
              <button
                onClick={() => setActiveTab('SCENE_SETTINGS')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'SCENE_SETTINGS' 
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' 
                    : 'bg-blue-900 text-blue-300 hover:text-blue-100 hover:bg-blue-800'
                }`}
              >
                <IconMap /> 场景设定 ({sceneSettings.length})
              </button>
              <button
                onClick={() => setActiveTab('PROP_SETTINGS')}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === 'PROP_SETTINGS' 
                    ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' 
                    : 'bg-blue-900 text-blue-300 hover:text-blue-100 hover:bg-blue-800'
                }`}
              >
                <IconBox /> 道具设定 ({propSettings.length})
              </button>
            </div>

            {/* Scenes View */}
            {activeTab === 'SCENES' && (
              <div className="flex-grow flex flex-col overflow-hidden bg-blue-950 border border-blue-800 rounded-xl shadow-2xl">
                {/* 
                   Grid Template:
                   ID(50px) Time(60px) Loc(100px) ShotType(80px) Content(2fr) Camera(100px) Sound(200px) Characters(1fr) Costume(1fr) Props(1fr) PromptCN(1.5fr) PromptEN(1.5fr)
                */}
                <div className="bg-blue-900 border-b border-blue-800 grid grid-cols-[50px_60px_100px_80px_2fr_100px_200px_1fr_1fr_1fr_1.5fr_1.5fr] text-xs font-bold text-blue-300 uppercase tracking-wider min-w-[2000px]">
                  <div className="p-3 border-r border-blue-800 text-center">场次</div>
                  <div className="p-3 border-r border-blue-800 text-center">时间</div>
                  <div className="p-3 border-r border-blue-800 text-center">地点</div>
                  <div className="p-3 border-r border-blue-800 text-center">景别</div>
                  <div className="p-3 border-r border-blue-800">场景内容</div>
                  <div className="p-3 border-r border-blue-800 text-center">镜头运动</div>
                  <div className="p-3 border-r border-blue-800">声音描述</div>
                  <div className="p-3 border-r border-blue-800">角色</div>
                  <div className="p-3 border-r border-blue-800">服装</div>
                  <div className="p-3 border-r border-blue-800">道具</div>
                  <div className="p-3 border-r border-blue-800">AI提示词 (中)</div>
                  <div className="p-3">AI提示词 (英)</div>
                </div>

                <div className="overflow-auto custom-scrollbar flex-grow">
                   <div className="min-w-[2000px]">
                    {panels.map((panel) => (
                      <PanelCard key={panel.id} panel={panel} />
                    ))}
                   </div>
                </div>
              </div>
            )}

            {/* Characters View */}
            {activeTab === 'CHARACTERS' && (
              <div className="flex-grow flex flex-col overflow-hidden bg-blue-950 border border-blue-800 rounded-xl shadow-2xl">
                <div className="bg-blue-900 border-b border-blue-800 grid grid-cols-[100px_60px_80px_120px_2fr_1.5fr_1.5fr_1.5fr] text-xs font-bold text-blue-300 uppercase tracking-wider min-w-[1600px]">
                  <div className="p-3 border-r border-blue-800 text-center">角色姓名</div>
                  <div className="p-3 border-r border-blue-800 text-center">性别</div>
                  <div className="p-3 border-r border-blue-800 text-center">年龄</div>
                  <div className="p-3 border-r border-blue-800 text-center">身份</div>
                  <div className="p-3 border-r border-blue-800">人物外貌特征</div>
                  <div className="p-3 border-r border-blue-800">所在时代背景</div>
                  <div className="p-3 border-r border-blue-800">AI 立绘提示词 (中)</div>
                  <div className="p-3">AI 提示词 (英)</div>
                </div>

                <div className="overflow-auto custom-scrollbar flex-grow">
                   <div className="min-w-[1600px]">
                      {characters.length > 0 ? (
                        characters.map((char, index) => (
                          <CharacterCard key={index} character={char} />
                        ))
                      ) : (
                        <div className="py-24 text-center text-blue-500 flex flex-col items-center">
                          <IconUser />
                          <p className="mt-4">未检测到详细角色信息</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            )}

             {/* Scene Settings View */}
             {activeTab === 'SCENE_SETTINGS' && (
              <div className="flex-grow flex flex-col overflow-hidden bg-blue-950 border border-blue-800 rounded-xl shadow-2xl">
                <div className="bg-blue-900 border-b border-blue-800 grid grid-cols-[120px_100px_150px_120px_120px_2fr_1.5fr_1.5fr] text-xs font-bold text-blue-300 uppercase tracking-wider min-w-[1600px]">
                  <div className="p-3 border-r border-blue-800 text-center">场景名称</div>
                  <div className="p-3 border-r border-blue-800 text-center">风格</div>
                  <div className="p-3 border-r border-blue-800 text-center">空间与结构</div>
                  <div className="p-3 border-r border-blue-800 text-center">时间与天气</div>
                  <div className="p-3 border-r border-blue-800 text-center">氛围与情绪</div>
                  <div className="p-3 border-r border-blue-800">场景道具与细节</div>
                  <div className="p-3 border-r border-blue-800">AI 提示词 (中)</div>
                  <div className="p-3">AI 提示词 (英)</div>
                </div>

                <div className="overflow-auto custom-scrollbar flex-grow">
                   <div className="min-w-[1600px]">
                      {sceneSettings.length > 0 ? (
                        sceneSettings.map((setting, index) => (
                          <SceneSettingCard key={index} sceneSetting={setting} />
                        ))
                      ) : (
                        <div className="py-24 text-center text-blue-500 flex flex-col items-center">
                          <IconMap />
                          <p className="mt-4">未检测到详细场景设定</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            )}

             {/* Prop Settings View */}
             {activeTab === 'PROP_SETTINGS' && (
              <div className="flex-grow flex flex-col overflow-hidden bg-blue-950 border border-blue-800 rounded-xl shadow-2xl">
                <div className="bg-blue-900 border-b border-blue-800 grid grid-cols-[150px_2fr_1.5fr_1.5fr] text-xs font-bold text-blue-300 uppercase tracking-wider min-w-[1200px]">
                  <div className="p-3 border-r border-blue-800 text-center">道具名称</div>
                  <div className="p-3 border-r border-blue-800">外观描述</div>
                  <div className="p-3 border-r border-blue-800">AI 提示词 (中)</div>
                  <div className="p-3">AI 提示词 (英)</div>
                </div>

                <div className="overflow-auto custom-scrollbar flex-grow">
                   <div className="min-w-[1200px]">
                      {propSettings.length > 0 ? (
                        propSettings.map((prop, index) => (
                          <PropSettingCard key={index} propSetting={prop} />
                        ))
                      ) : (
                        <div className="py-24 text-center text-blue-500 flex flex-col items-center">
                          <IconBox />
                          <p className="mt-4">未检测到详细道具设定</p>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Empty State */}
        {!hasData && appState !== AppState.LOADING && (
          <div className="flex-grow flex flex-col items-center justify-center text-blue-500 border-2 border-dashed border-blue-800 rounded-xl p-12 bg-blue-900/50">
            <IconMovie />
            <p className="mt-4 font-medium">暂无数据</p>
            <p className="text-sm">点击上方“开始拆解”生成统筹表</p>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;