import React, { useState, useEffect } from 'react';
import { LineValue } from '../types';

interface CoinStageProps {
    isTossing: boolean;
    onTossComplete: (result: LineValue) => void;
    triggerToss: () => void;
}

type CoinSide = 2 | 3;

export const CoinStage: React.FC<CoinStageProps> = ({ isTossing, onTossComplete }) => {
    const [coins, setCoins] = useState<CoinSide[]>([3, 3, 3]);
    
    useEffect(() => {
        let interval: number;
        let timeout: number;

        if (isTossing) {
            interval = window.setInterval(() => {
                setCoins([
                    Math.random() > 0.5 ? 3 : 2,
                    Math.random() > 0.5 ? 3 : 2,
                    Math.random() > 0.5 ? 3 : 2,
                ]);
            }, 80);

            timeout = window.setTimeout(() => {
                clearInterval(interval);
                const finalCoins: CoinSide[] = [
                    Math.random() > 0.5 ? 3 : 2,
                    Math.random() > 0.5 ? 3 : 2,
                    Math.random() > 0.5 ? 3 : 2,
                ];
                setCoins(finalCoins);
                const sum = finalCoins.reduce((a, b) => a + b, 0) as LineValue;
                onTossComplete(sum);
            }, 1200);
        }

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [isTossing, onTossComplete]);

    return (
        <div className="flex gap-6 items-center justify-center py-10 perspective-1000">
            {coins.map((side, idx) => (
                <Coin key={idx} side={side} isSpinning={isTossing} delay={idx * 0.05} />
            ))}
        </div>
    );
};

const Coin: React.FC<{ side: CoinSide; isSpinning: boolean; delay: number }> = ({ side, isSpinning, delay }) => {
    // INS Style: Minimalist Circles
    // Yang (3) = 字 (Simple Serif Character or Clean Symbol)
    // Yin (2) = 花 (Simple Pattern)
    
    return (
        <div 
            className={`relative w-24 h-24 rounded-full transition-all duration-500 transform-style-3d 
                ${isSpinning ? 'animate-spin-y' : ''}
            `}
            style={{ 
                animationDuration: '0.5s',
                transitionDelay: `${delay}s`
            }}
        >
            <div className={`
                absolute inset-0 rounded-full border border-gray-200 flex items-center justify-center
                shadow-[0_4px_10px_rgba(0,0,0,0.05)] bg-white
            `}>
                <div className={`
                    w-20 h-20 rounded-full border border-gray-100 flex items-center justify-center
                `}>
                    {/* Inner content design */}
                    <span className={`font-serif text-2xl ${side === 3 ? 'text-gray-800 font-light' : 'text-gray-400'}`}>
                        {side === 3 ? '阳' : '阴'}
                    </span>
                    
                    {/* Decorative ring for Yin to differentiate */}
                    {side === 2 && (
                        <div className="absolute inset-0 m-auto w-16 h-16 border border-dashed border-gray-300 rounded-full opacity-50"></div>
                    )}
                </div>
            </div>
        </div>
    );
};