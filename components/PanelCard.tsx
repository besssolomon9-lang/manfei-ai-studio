import React, { useState } from 'react';
import { ScriptPanel } from '../types';
import { IconCopy, IconCheck } from './Icons';

interface PanelCardProps {
  panel: ScriptPanel;
}

const PanelCard: React.FC<PanelCardProps> = ({ panel }) => {
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
  // ID(50px) Time(60px) Loc(100px) ShotType(80px) Content(2fr) Camera(100px) Sound(200px) Characters(1fr) Costume(1fr) Props(1fr) PromptCN(1.5fr) PromptEN(1.5fr)
  
  return (
    <div className="group w-full grid grid-cols-[50px_60px_100px_80px_2fr_100px_200px_1fr_1fr_1fr_1.5fr_1.5fr] border-b border-blue-800 bg-blue-900/50 hover:bg-blue-900 transition-colors text-sm min-w-[2000px]">
      
      {/* 1. 场次号 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center font-mono text-sky-400 font-bold">
        {panel.id}
      </div>

      {/* 2. 时间 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-blue-200 text-center">
        {panel.time}
      </div>

      {/* 3. 地点 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-blue-100 font-medium text-center break-words">
        {panel.location}
      </div>

      {/* 4. 景别 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-amber-400/90 font-medium text-center break-words">
        {panel.shotType}
      </div>

      {/* 5. 场景内容 */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-200 leading-relaxed text-left">
        <span className="line-clamp-4 group-hover:line-clamp-none transition-all">
          {panel.sceneContent}
        </span>
      </div>

      {/* 6. 运镜 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center justify-center text-fuchsia-400 font-bold text-center break-words">
        {panel.cameraMovement}
      </div>

      {/* 7. 声音描述 */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-cyan-300/90 text-xs leading-relaxed text-left">
        <span className="line-clamp-5 group-hover:line-clamp-none transition-all">
          {panel.soundDescription}
        </span>
      </div>

      {/* 8. 角色 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center text-emerald-400 font-medium break-words">
        {panel.characters.join('、') || '-'}
      </div>

      {/* 9. 服装 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center text-pink-300/80 text-xs break-words leading-tight">
        {panel.costume}
      </div>

      {/* 10. 道具 */}
      <div className="p-3 border-r border-blue-800/50 flex items-center text-amber-300/80 text-xs break-words leading-tight">
        {panel.props}
      </div>

      {/* 11. AI 提示词 (中文) */}
      <div className="p-3 border-r border-blue-800/50 flex flex-col justify-center text-blue-300 text-xs relative group/cn">
        <p className="line-clamp-3 group-hover/cn:line-clamp-none pr-4">
            {panel.aiPromptCn}
        </p>
        <button 
          onClick={() => handleCopy(panel.aiPromptCn, true)}
          className="absolute top-1 right-1 opacity-0 group-hover/cn:opacity-100 p-1 text-blue-400 hover:text-sky-400 transition-opacity"
          title="复制中文提示词"
        >
          {copiedCn ? <IconCheck /> : <IconCopy />}
        </button>
      </div>

      {/* 12. AI 提示词 (英文) */}
      <div className="p-3 flex flex-col justify-center text-blue-300 text-xs relative group/en">
        <p className="line-clamp-3 group-hover/en:line-clamp-none pr-4 font-mono">
            {panel.aiPromptEn}
        </p>
        <button 
          onClick={() => handleCopy(panel.aiPromptEn, false)}
          className="absolute top-1 right-1 opacity-0 group-hover/en:opacity-100 p-1 text-blue-400 hover:text-sky-400 transition-opacity"
          title="复制英文提示词"
        >
          {copiedEn ? <IconCheck /> : <IconCopy />}
        </button>
      </div>

    </div>
  );
};

export default PanelCard;