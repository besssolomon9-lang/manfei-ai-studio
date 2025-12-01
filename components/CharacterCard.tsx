import React, { useState } from 'react';
import { CharacterProfile } from '../types';
import { IconCopy, IconCheck } from './Icons';

interface CharacterCardProps {
  character: CharacterProfile;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
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

  // Grid columns (Total ~100% or fixed width for scroll)
  // Name(100px) Gender(60px) Age(80px) Identity(120px) Appearance(2fr) Background(1.5fr) PromptCN(1.5fr) PromptEN(1.5fr)
  
  return (
    <div className="group w-full grid grid-cols-[100px_60px_80px_120px_2fr_1.5fr_1.5fr_1.5fr] border-b border-blue-800 bg-blue-900/50 hover:bg-blue-900 transition-colors text-sm min-w-[1600px]">
      
      {/* 1. 姓名 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center font-bold text-sky-400 break-words">
        {character.name}
      </div>

      {/* 2. 性别 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-blue-200">
        {character.gender}
      </div>

      {/* 3. 年龄 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-blue-200">
        {character.age}
      </div>

      {/* 4. 身份 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-emerald-400 font-medium text-center break-words">
        {character.identity}
      </div>

      {/* 5. 外貌特征 */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-200 leading-relaxed text-left">
        <span className="line-clamp-4 group-hover:line-clamp-none transition-all">
          {character.appearance}
        </span>
      </div>

      {/* 6. 时代背景 */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-300 text-xs leading-relaxed text-left">
        <span className="line-clamp-4 group-hover:line-clamp-none transition-all">
          {character.background}
        </span>
      </div>

      {/* 7. AI 提示词 (中文) */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-300 text-xs relative group/cn">
        <p className="line-clamp-3 group-hover/cn:line-clamp-none pr-4">
            {character.aiPromptCn}
        </p>
        <button 
          onClick={() => handleCopy(character.aiPromptCn, true)}
          className="absolute top-1 right-1 opacity-0 group-hover/cn:opacity-100 p-1 text-blue-400 hover:text-sky-400 transition-opacity"
          title="复制中文提示词"
        >
          {copiedCn ? <IconCheck /> : <IconCopy />}
        </button>
      </div>

      {/* 8. AI 提示词 (英文) */}
      <div className="p-3 flex flex-col justify-center text-blue-300 text-xs relative group/en">
        <p className="line-clamp-3 group-hover/en:line-clamp-none pr-4 font-mono">
            {character.aiPromptEn}
        </p>
        <button 
          onClick={() => handleCopy(character.aiPromptEn, false)}
          className="absolute top-1 right-1 opacity-0 group-hover/en:opacity-100 p-1 text-blue-400 hover:text-sky-400 transition-opacity"
          title="复制英文提示词"
        >
          {copiedEn ? <IconCheck /> : <IconCopy />}
        </button>
      </div>

    </div>
  );
};

export default CharacterCard;