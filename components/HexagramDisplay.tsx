
import React, { useMemo } from 'react';
import { LineValue } from '../types';
import { getHexagramInfo, getTransformedLines } from '../utils/iching';
import { ArrowRight } from 'lucide-react';

interface HexagramDisplayProps {
    lines: LineValue[];
    dateContext?: Date;
}

export const HexagramDisplay: React.FC<HexagramDisplayProps> = ({ lines, dateContext }) => {
    const hasStarted = lines.length > 0;
    const now = dateContext || new Date();
    
    // Fill remaining lines for visual stability
    const filledLines = [...lines];
    while(filledLines.length < 6) {
        filledLines.push(8 as LineValue); 
    }

    const mainInfo = useMemo(() => getHexagramInfo(filledLines, now), [filledLines, now]);
    
    // Calculate transformed
    const transformedLines = useMemo(() => getTransformedLines(filledLines), [filledLines]);
    // Pass mainInfo.palaceElement as subjectPalaceElement to ensure Six Relatives are relative to Main
    const transformedInfo = useMemo(() => getHexagramInfo(transformedLines, now, mainInfo.palaceElement), [transformedLines, now, mainInfo.palaceElement]);

    const hasChanges = lines.some(l => l === 6 || l === 9);

    return (
        <div className="ins-card p-6 md:p-8 rounded-3xl h-full flex flex-col relative overflow-hidden bg-white">
            
            {/* Header / Meta */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                {hasStarted ? (
                   <div className="flex gap-4 items-baseline">
                        <span className="text-[10px] text-gray-400 font-serif uppercase tracking-widest">
                            Day Stem: {mainInfo.dayStem}
                        </span>
                        <span className="text-[10px] text-gray-400 font-serif uppercase tracking-widest">
                            Palace: {mainInfo.palaceName}{mainInfo.palaceElement}
                        </span>
                   </div>
                ) : (
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                        Hexagram Board
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {!hasStarted ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300 space-y-4 min-h-[400px]">
                        <div className="w-16 h-16 rounded-full border border-dashed border-gray-200 flex items-center justify-center">
                            <span className="text-xl font-serif text-gray-300">卦</span>
                        </div>
                        <p className="font-serif text-xs text-gray-400 tracking-widest uppercase">Waiting for inspiration</p>
                    </div>
                ) : (
                    <div className="flex flex-col xl:flex-row gap-8 h-full">
                        
                        {/* Main Hexagram Panel */}
                        <div className={`flex-1 flex flex-col ${hasChanges ? '' : 'xl:max-w-[70%] xl:mx-auto'}`}>
                            <div className="mb-6">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                    本卦 Main
                                </span>
                                <h2 className="text-2xl font-serif text-gray-900 tracking-tight">
                                    {mainInfo.name}
                                </h2>
                            </div>

                            {/* Legend for Main */}
                            <div className="grid grid-cols-12 text-[9px] text-gray-300 uppercase tracking-widest mb-2 px-1">
                                <div className="col-span-2">神/Six</div>
                                <div className="col-span-1 text-center">位</div>
                                <div className="col-span-4 text-center">爻/Line</div>
                                <div className="col-span-5 text-right">象/Info</div>
                            </div>
                            
                            <div className="flex flex-col-reverse gap-3">
                                {mainInfo.lineDetails.map((detail, idx) => (
                                    <MainHexLineRow 
                                        key={`main-${idx}`} 
                                        detail={detail} 
                                        isGenerated={idx < lines.length}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Divider for Mobile */}
                        {hasChanges && <div className="h-px bg-gray-100 xl:hidden"></div>}
                        {hasChanges && <div className="w-px bg-gray-100 hidden xl:block"></div>}

                        {/* Transformed Hexagram Panel */}
                        {hasChanges ? (
                            <div className="flex-1 flex flex-col">
                                <div className="mb-6">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                        之卦 Transformed
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <ArrowRight size={16} className="text-gray-300" />
                                        <h2 className="text-2xl font-serif text-gray-900 tracking-tight">
                                            {transformedInfo.name}
                                        </h2>
                                    </div>
                                </div>

                                {/* Legend for Transformed */}
                                <div className="grid grid-cols-12 text-[9px] text-gray-300 uppercase tracking-widest mb-2 px-1">
                                    <div className="col-span-3"></div>
                                    <div className="col-span-4 text-center">爻/Line</div>
                                    <div className="col-span-5 text-right">变/Change</div>
                                </div>

                                <div className="flex flex-col-reverse gap-3">
                                    {transformedInfo.lineDetails.map((detail, idx) => {
                                        // Highlight only if the original line was a changing line
                                        const originalLine = lines[idx];
                                        const wasChanging = originalLine === 6 || originalLine === 9;

                                        return (
                                            <TransformedHexLineRow 
                                                key={`trans-${idx}`} 
                                                detail={detail} 
                                                wasChanging={wasChanging}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                           /* Placeholder to balance layout if no changes yet */
                           <div className="hidden xl:flex flex-1 items-center justify-center text-gray-200">
                                <span className="text-xs tracking-widest uppercase writing-vertical-rl">No Changes</span>
                           </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
};

const MainHexLineRow: React.FC<{ 
    detail: any, 
    isGenerated: boolean 
}> = ({ detail, isGenerated }) => {
    
    if (!isGenerated) {
        return (
            <div className="h-10 w-full flex items-center justify-center opacity-10">
                <div className="h-px w-full bg-gray-200"></div>
            </div>
        );
    }

    const { isYang, isChanging, element, relation, stemBranch, naYin, beast, isShi, isYing } = detail;

    return (
        <div className="grid grid-cols-12 items-center h-10 px-1 hover:bg-gray-50 rounded-lg transition-colors group">
            
            {/* Six Beast */}
            <div className="col-span-2 text-[10px] font-serif text-gray-500">
                {beast}
            </div>

            {/* Shi/Ying */}
            <div className="col-span-1 flex justify-center">
                {isShi && <span className="bg-gray-800 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">世</span>}
                {isYing && <span className="border border-gray-300 text-gray-400 text-[8px] w-4 h-4 flex items-center justify-center rounded-full">应</span>}
            </div>

            {/* Line Graphic */}
            <div className="col-span-4 px-1 flex items-center justify-center">
                <div className="w-full max-w-[100px] relative">
                     {isYang ? (
                        <div className={`h-1.5 w-full rounded-full ${isChanging ? 'bg-gray-400' : 'bg-gray-800'}`}>
                             {isChanging && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white border border-gray-400 rounded-full"></div>}
                        </div>
                    ) : (
                        <div className="flex justify-between gap-1">
                             <div className={`h-1.5 w-[45%] rounded-full ${isChanging ? 'bg-gray-400' : 'bg-gray-800'}`}></div>
                             {isChanging && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 text-[8px]">✕</span>}
                             <div className={`h-1.5 w-[45%] rounded-full ${isChanging ? 'bg-gray-400' : 'bg-gray-800'}`}></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="col-span-5 flex flex-col items-end justify-center text-right leading-none">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-gray-700">{relation}</span>
                    <span className="text-[9px] text-gray-400">{element}</span>
                </div>
                <div className="text-[9px] text-gray-400 font-serif scale-90 origin-right">
                    {stemBranch}
                </div>
            </div>
        </div>
    );
};

const TransformedHexLineRow: React.FC<{ 
    detail: any, 
    wasChanging: boolean 
}> = ({ detail, wasChanging }) => {
    
    const { isYang, element, relation, stemBranch } = detail;
    const opacityClass = wasChanging ? 'opacity-100' : 'opacity-30 grayscale';

    return (
        <div className={`grid grid-cols-12 items-center h-10 px-1 rounded-lg transition-all ${opacityClass}`}>
            
            <div className="col-span-3"></div>

            {/* Line Graphic */}
            <div className="col-span-4 px-1 flex items-center justify-center">
                <div className="w-full max-w-[100px] relative">
                     {isYang ? (
                        <div className="h-1.5 w-full rounded-full bg-gray-800"></div>
                    ) : (
                        <div className="flex justify-between gap-1">
                             <div className="h-1.5 w-[45%] rounded-full bg-gray-800"></div>
                             <div className="h-1.5 w-[45%] rounded-full bg-gray-800"></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="col-span-5 flex flex-col items-end justify-center text-right leading-none">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-gray-700">{relation}</span>
                    <span className="text-[9px] text-gray-400">{element}</span>
                </div>
                <div className="text-[9px] text-gray-400 font-serif scale-90 origin-right">
                    {stemBranch}
                </div>
            </div>
        </div>
    );
};
