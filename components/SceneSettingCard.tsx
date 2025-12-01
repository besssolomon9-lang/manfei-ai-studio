import React, { useState } from 'react';
import { SceneSetting } from '../types';
import { IconCopy, IconCheck } from './Icons';

interface SceneSettingCardProps {
  sceneSetting: SceneSetting;
}

const SceneSettingCard: React.FC<SceneSettingCardProps> = ({ sceneSetting }) => {
  const [copiedCn, setCopiedCn] = useState(false);
  const [copiedEn, setCopiedEn] = useState(false);

  const handleCopy = (text: string, isCn: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCn) {
      setCopiedCn(true);
      setTimeout(() => setCopiedCn(false), 2000);
    } else {
      setCopiedEn(true);
      setTimeout(() => setCopiedEn(false), 2000);
    }
  };

  // Grid columns: 
  // Location(120px) Style(100px) Structure(150px) TimeWeather(120px) Atmosphere(120px) Details(2fr) PromptCN(1.5fr) PromptEN(1.5fr)
  
  return (
    <div className="group w-full grid grid-cols-[120px_100px_150px_120px_120px_2fr_1.5fr_1.5fr] border-b border-blue-800 bg-blue-900/50 hover:bg-blue-900 transition-colors text-sm min-w-[1600px]">
      
      {/* 1. 场景名称 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center font-bold text-amber-400 break-words text-center">
        {sceneSetting.locationName}
      </div>

      {/* 2. 风格 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-blue-200 text-center">
        {sceneSetting.style}
      </div>

      {/* 3. 空间与结构 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-blue-200 text-center text-xs">
        {sceneSetting.structure}
      </div>

      {/* 4. 时间与天气 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-cyan-300/80 text-center">
        {sceneSetting.timeWeather}
      </div>

      {/* 5. 氛围与情绪 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-pink-300/80 text-center">
        {sceneSetting.atmosphere}
      </div>

      {/* 6. 场景道具与细节 */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-200 leading-relaxed text-left text-xs">
        <span className="line-clamp-5 group-hover:line-clamp-none transition-all">
          {sceneSetting.details}
        </span>
      </div>

      {/* 7. AI 提示词 (中文) */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-300 text-xs relative group/cn">
        <p className="line-clamp-4 group-hover/cn:line-clamp-none pr-4">
            {sceneSetting.aiPromptCn}
        </p>
        <button 
          onClick={() => handleCopy(sceneSetting.aiPromptCn, true)}
          className="absolute top-1 right-1 opacity-0 group-hover/cn:opacity-100 p-1 text-blue-400 hover:text-sky-400 transition-opacity"
          title="复制中文提示词"
        >
          {copiedCn ? <IconCheck /> : <IconCopy />}
        </button>
      </div>

      {/* 8. AI 提示词 (英文) */}
      <div className="p-3 flex flex-col justify-center text-blue-300 text-xs relative group/en">
        <p className="line-clamp-4 group-hover/en:line-clamp-none pr-4 font-mono">
            {sceneSetting.aiPromptEn}
        </p>
        <button 
          onClick={() => handleCopy(sceneSetting.aiPromptEn, false)}
          className="absolute top-1 right-1 opacity-0 group-hover/en:opacity-100 p-1 text-blue-400 hover:text-sky-400 transition-opacity"
          title="复制英文提示词"
        >
          {copiedEn ? <IconCheck /> : <IconCopy />}
        </button>
      </div>

    </div>
  );
};

export default SceneSettingCard;