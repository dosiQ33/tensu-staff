import {useEffect, useState} from 'react';

type LineChartProps = {
    data: number[];
};
  
const LineChart = ({ data }: LineChartProps) => {
    const max = Math.max(...data) * 1.2;
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        // Trigger animation after component mount
        const timer = setTimeout(() => {
        setIsAnimated(true);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-48 p-4">
        <div className="w-full h-full relative">
            <svg viewBox="0 0 100 50" className="w-full h-full">
            {/* Background gradient */}
            <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#F9FAFB" stopOpacity="0.1" />
                </linearGradient>
            </defs>
            
            {/* Grid Lines with subtle styling */}
            <line x1="0" y1="45" x2="100" y2="45" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="1 1"/>
            <line x1="0" y1="30" x2="100" y2="30" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="1 1"/>
            <line x1="0" y1="15" x2="100" y2="15" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="1 1"/>
            
            {/* Label Y-axis */}
            <text x="2" y="46" fontSize="3" fill="#6b7280">0</text>
            <text x="2" y="31" fontSize="3" fill="#6b7280">{Math.round(max/2)}</text>
            <text x="2" y="16" fontSize="3" fill="#6b7280">{Math.round(max)}</text>
            
            {/* Data Area Fill with gradient */}
            <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <path
                d={`M0,45 ${data.map((value, index) => {
                    const x = index * (100 / (data.length - 1));
                    const y = isAnimated ? (45 - (value / max * 30)) : 45;
                    return `L${x},${y}`;
                }).join(' ')} L100,45 Z`}
                fill="url(#areaGradient)"
                style={{ transition: "d 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
            
            {/* Data Line with gradient */}
            <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366F1" /> 
                    <stop offset="100%" stopColor="#4F46E5" />
                </linearGradient>
            </defs>
            <polyline
                points={data.map((value, index) => {
                const x = index * (100 / (data.length - 1));
                const y = isAnimated ? (45 - (value / max * 30)) : 45;
                return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="1.2"
                strokeLinejoin="round"
                style={{ transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
            
            {/* Data Points with animation and glow effect */}
            <defs>
                <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            {data.map((value, index) => {
                const x = index * (100 / (data.length - 1));
                const y = isAnimated ? (45 - (value / max * 30)) : 45;
                return (
                <g key={index} filter="url(#glow)" style={{ transition: "all 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                    <circle
                    cx={x}
                    cy={y}
                    r="1.2"
                    fill="white"
                    stroke="#4F46E5"
                    strokeWidth="0.5"
                    />
                </g>
                );
            })}
            
            {/* X-axis Labels */}
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
                <text 
                key={index}
                x={index * (100 / (data.length - 1))}
                y="49"
                fontSize="3"
                textAnchor="middle"
                fill="#6b7280"
                fontWeight={index === 6 ? "bold" : "normal"} // Current month stands out
                >
                {month}
                </text>
            ))}
            </svg>
        </div>
        </div>
    );
};

export default LineChart;