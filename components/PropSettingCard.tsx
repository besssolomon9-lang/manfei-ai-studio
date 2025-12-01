import React, { useState } from 'react';
import { PropSetting } from '../types';
import { IconCopy, IconCheck } from './Icons';

interface PropSettingCardProps {
  propSetting: PropSetting;
}

const PropSettingCard: React.FC<PropSettingCardProps> = ({ propSetting }) => {
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
  // Name(150px) Appearance(2fr) PromptCN(1.5fr) PromptEN(1.5fr)
  
  return (
    <div className="group w-full grid grid-cols-[150px_2fr_1.5fr_1.5fr] border-b border-blue-800 bg-blue-900/50 hover:bg-blue-900 transition-colors text-sm min-w-[1200px]">
      
      {/* 1. 道具名称 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center font-bold text-teal-400 break-words text-center">
        {propSetting.name}
      </div>

      {/* 2. 外观描述 */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-200 leading-relaxed text-left">
        <span className="line-clamp-4 group-hover:line-clamp-none transition-all">
          {propSetting.appearance}
        </span>
      </div>

      {/* 3. AI 提示词 (中文) */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-300 text-xs relative group/cn">
        <p className="line-clamp-4 group-hover/cn:line-clamp-none pr-4">
            {propSetting.aiPromptCn}
        </p>
        <button 
          onClick={() => handleCopy(propSetting.aiPromptCn, true)}
          className="absolute top-1 right-1 opacity-0 group-hover/cn:opacity-100 p-1 text-blue-400 hover:text-sky-400 transition-opacity"
          title="复制中文提示词"
        >
          {copiedCn ? <IconCheck /> : <IconCopy />}
        </button>
      </div>

      {/* 4. AI 提示词 (英文) */}
      <div className="p-3 flex flex-col justify-center text-blue-300 text-xs relative group/en">
        <p className="line-clamp-4 group-hover/en:line-clamp-none pr-4 font-mono">
            {propSetting.aiPromptEn}
        </p>
        <button 
          onClick={() => handleCopy(propSetting.aiPromptEn, false)}
          className="absolute top-1 right-1 opacity-0 group-hover/en:opacity-100 p-1 text-blue-400 hover:text-sky-400 transition-opacity"
          title="复制英文提示词"
        >
          {copiedEn ? <IconCheck /> : <IconCopy />}
        </button>
      </div>

    </div>
  );
};

export default PropSettingCard;