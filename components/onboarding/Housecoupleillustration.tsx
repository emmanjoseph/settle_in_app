import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect } from "react-native-svg";
import { TEAL } from "./shared";

const INK = "#0a0a0a";
const PAPER = "#fafafa";
const SKIN = "#f1dcc9";

export function HouseCoupleIllustration() {
    return (
        <Svg viewBox="0 0 320 280" width="88%" height="88%">
            <Ellipse cx={170} cy={260} rx={110} ry={8} fill="#d4d4d4" opacity={0.5} />

            {/* small house */}
            <Rect x={30} y={110} width={110} height={130} fill={TEAL} opacity={0.12} />
            <Rect x={30} y={110} width={110} height={130} fill="none" stroke={INK} strokeWidth={2} />
            <Polygon points="25,110 85,70 145,110" fill={TEAL} opacity={0.18} stroke={INK} strokeWidth={2} />
            <Rect x={45} y={130} width={25} height={25} fill={PAPER} stroke={INK} strokeWidth={1.5} />
            <Rect x={100} y={130} width={25} height={25} fill={PAPER} stroke={INK} strokeWidth={1.5} />
            <Rect x={70} y={180} width={30} height={60} fill={INK} opacity={0.92} />
            <Circle cx={95} cy={212} r={1.5} fill={TEAL} />

            {/* upper floor */}
            <Rect x={70} y={60} width={90} height={50} fill={TEAL} opacity={0.14} stroke={INK} strokeWidth={2} />
            <Polygon points="65,60 115,30 165,60" fill={TEAL} opacity={0.2} stroke={INK} strokeWidth={2} />
            <Rect x={85} y={75} width={18} height={20} fill={PAPER} stroke={INK} strokeWidth={1.5} />
            <Rect x={127} y={75} width={18} height={20} fill={PAPER} stroke={INK} strokeWidth={1.5} />

            {/* person 1 */}
            <G>
                <Ellipse cx={195} cy={100} rx={22} ry={24} fill={SKIN} />
                <Path
                    d="M173,98 Q175,75 195,75 Q220,75 218,100 L218,108 Q205,112 195,112 Q183,112 173,108 Z"
                    fill="#202638"
                />
                <Rect x={185} y={122} width={22} height={60} fill={TEAL} opacity={0.72} />
                <Rect x={178} y={125} width={36} height={40} fill={TEAL} opacity={0.72} />
                <Rect x={185} y={180} width={22} height={55} fill={INK} opacity={0.92} />
                <Rect x={185} y={235} width={22} height={8} fill={INK} />
                <Circle cx={175} cy={140} r={6} fill={SKIN} />
            </G>

            {/* person 2 */}
            <G>
                <Ellipse cx={235} cy={105} rx={21} ry={23} fill={SKIN} />
                <Path
                    d="M214,100 Q216,80 235,80 Q256,80 256,105 L256,118 Q245,120 235,120 Q225,120 214,118 Z"
                    fill="#171c2c"
                />
                <Rect x={222} y={126} width={28} height={50} fill={INK} opacity={0.92} />
                <Path d="M218,175 L255,175 L262,235 L215,235 Z" fill={TEAL} opacity={0.9} />
                <Rect x={222} y={235} width={15} height={8} fill={INK} />
                <Rect x={242} y={235} width={15} height={8} fill={INK} />
            </G>

            {/* sign / key plank */}
            <G transform="translate(155,170) rotate(-15)">
                <Rect x={0} y={0} width={50} height={8} fill="#171717" stroke={INK} strokeWidth={1} />
                <Line x1={0} y1={8} x2={50} y2={8} stroke={INK} strokeWidth={1} strokeDasharray="2,2" />
            </G>
        </Svg>
    );
}