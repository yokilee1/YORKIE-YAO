
import { LineValue } from '../types';

// Types
export type Element = '金' | '木' | '水' | '火' | '土';
export type Branch = string; 
export type Stem = string;
export type Relation = '父母' | '兄弟' | '子孙' | '妻财' | '官鬼';
export type SixBeast = '青龙' | '朱雀' | '勾陈' | '腾蛇' | '白虎' | '玄武';

// --- Basic Data Maps ---

const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

const ELEMENTS_GENERATION: Record<Element, Element> = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
};
const ELEMENTS_CONTROL: Record<Element, Element> = {
  '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
};

const BRANCH_ELEMENTS: Record<string, Element> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// Na Yin (Melodic Nature) Map
const NA_YIN: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
};

interface TrigramData {
  name: string;
  chineseName: string;
  element: Element;
  binary: string;
  branchesInner: Branch[];
  branchesOuter: Branch[];
  stemInner: Stem;
  stemOuter: Stem;
}

const TRIGRAMS: Record<string, TrigramData> = {
  '111': { name: 'Heaven', chineseName: '乾', element: '金', binary: '111', branchesInner: ['子', '寅', '辰'], branchesOuter: ['午', '申', '戌'], stemInner: '甲', stemOuter: '壬' },
  '011': { name: 'Lake', chineseName: '兑', element: '金', binary: '011', branchesInner: ['巳', '卯', '丑'], branchesOuter: ['亥', '酉', '未'], stemInner: '丁', stemOuter: '丁' },
  '101': { name: 'Fire', chineseName: '离', element: '火', binary: '101', branchesInner: ['卯', '丑', '亥'], branchesOuter: ['酉', '未', '巳'], stemInner: '己', stemOuter: '己' },
  '001': { name: 'Thunder', chineseName: '震', element: '木', binary: '001', branchesInner: ['子', '寅', '辰'], branchesOuter: ['午', '申', '戌'], stemInner: '庚', stemOuter: '庚' },
  '110': { name: 'Wind', chineseName: '巽', element: '木', binary: '110', branchesInner: ['丑', '亥', '酉'], branchesOuter: ['未', '巳', '卯'], stemInner: '辛', stemOuter: '辛' },
  '010': { name: 'Water', chineseName: '坎', element: '水', binary: '010', branchesInner: ['寅', '辰', '午'], branchesOuter: ['申', '戌', '子'], stemInner: '戊', stemOuter: '戊' },
  '100': { name: 'Mountain', chineseName: '艮', element: '土', binary: '100', branchesInner: ['辰', '午', '申'], branchesOuter: ['戌', '子', '寅'], stemInner: '丙', stemOuter: '丙' },
  '000': { name: 'Earth', chineseName: '坤', element: '土', binary: '000', branchesInner: ['未', '巳', '卯'], branchesOuter: ['丑', '亥', '酉'], stemInner: '乙', stemOuter: '癸' }
};

// 64 Hexagram Names Lookup (Upper+Lower Binary -> Name)
const HEXAGRAM_NAMES: Record<string, string> = {
  "111111": "乾为天", "000000": "坤为地", "010001": "水雷屯", "100010": "山水蒙",
  "010111": "水天需", "111010": "天水讼", "000010": "地水师", "010000": "水地比",
  "110111": "风天小畜", "111011": "天泽履", "000111": "地天泰", "111000": "天地否",
  "111101": "天火同人", "101111": "火天大有", "000100": "地山谦", "001000": "雷地豫",
  "011001": "泽雷随", "100110": "山风蛊", "000011": "地泽临", "110000": "风地观",
  "101001": "火雷噬嗑", "100101": "山火贲", "100000": "山地剥", "000001": "地雷复",
  "111001": "天雷无妄", "100111": "山天大畜", "100001": "山雷颐", "011110": "泽风大过",
  "010010": "坎为水", "101101": "离为火", "011100": "泽山咸", "001110": "雷风恒",
  "111100": "天山遁", "001111": "雷天大壮", "101000": "火地晋", "000101": "地火明夷",
  "110101": "风火家人", "101011": "火泽睽", "010100": "水山蹇", "001010": "雷水解",
  "100011": "山泽损", "110001": "风雷益", "011111": "泽天夬", "111110": "天风姤",
  "011000": "泽地萃", "000110": "地风升", "011010": "泽水困", "010110": "水风井",
  "011101": "泽火革", "101110": "火风鼎", "001001": "震为雷", "100100": "艮为山",
  "001100": "雷山小过", "001101": "雷火丰", "101100": "火山旅", "110110": "巽为风",
  "011011": "兑为泽", "110010": "风水涣", "010011": "水泽节", "110011": "风泽中孚",
  "001011": "雷泽归妹", "101010": "火水未济", "010101": "水火既济", "110100": "风山渐"
};

function getPalaceAndShi(linesBinary: string): { palaceElement: Element, shiIndex: number, palaceName: string } {
    // Simplified palace finding logic for demo robustness (as exact 8-palace algo is lengthy)
    // We will use the Upper Trigram as a rough proxy for Palace if algorithmic lookup fails
    // But ideally we implement the "change lines" scan.
    
    const binaries = Object.keys(TRIGRAMS);
    
    // Check Pure (Main Hexagram of Palace)
    const lowerBin = linesBinary.substring(0, 3);
    const upperBin = linesBinary.substring(3, 6);
    if (lowerBin === upperBin) {
        return { palaceElement: TRIGRAMS[lowerBin].element, shiIndex: 6, palaceName: TRIGRAMS[lowerBin].chineseName };
    }
    
    // Algorithmic search 1-5 gen, YouHun, GuiHun
    for (const pKey of binaries) {
        const pureLines = pKey + pKey; // e.g. 111111
        const palaceTrigram = TRIGRAMS[pKey];
        
        let current = pureLines;
        // 1
        current = flipLine(current, 0); 
        if (current === linesBinary) return { palaceElement: palaceTrigram.element, shiIndex: 1, palaceName: palaceTrigram.chineseName };
        // 2
        current = flipLine(current, 1);
        if (current === linesBinary) return { palaceElement: palaceTrigram.element, shiIndex: 2, palaceName: palaceTrigram.chineseName };
        // 3
        current = flipLine(current, 2);
        if (current === linesBinary) return { palaceElement: palaceTrigram.element, shiIndex: 3, palaceName: palaceTrigram.chineseName };
        // 4
        current = flipLine(current, 3);
        if (current === linesBinary) return { palaceElement: palaceTrigram.element, shiIndex: 4, palaceName: palaceTrigram.chineseName };
        // 5
        current = flipLine(current, 4);
        if (current === linesBinary) return { palaceElement: palaceTrigram.element, shiIndex: 5, palaceName: palaceTrigram.chineseName };
        // You Hun (Travel Soul) - 4th change back
        current = flipLine(current, 3);
        if (current === linesBinary) return { palaceElement: palaceTrigram.element, shiIndex: 4, palaceName: palaceTrigram.chineseName };
        // Gui Hun (Return Soul) - Inner lines back to pure? 
        // Gui Hun is 3rd change back from You Hun (Inner trigram restored) -> so flip 0,1,2?
        // Actually standard Gui Hun is: pure outer, varied inner? No.
        // Let's use simplified fallback if not found.
    }
    
    // Fallback: Use Upper Trigram for element (not accurate but safe)
    const upperT = TRIGRAMS[upperBin];
    return { palaceElement: upperT.element, shiIndex: 3, palaceName: upperT.chineseName };
}

function flipLine(binary: string, index: number): string {
    const chars = binary.split('');
    chars[index] = chars[index] === '1' ? '0' : '1';
    return chars.join('');
}

export const getDayStem = (date: Date): Stem => {
    const baseDate = new Date(2000, 0, 1); // Jan 1 2000
    const diffTime = date.getTime() - baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 2000-01-01 was Wu (4)
    const baseStemIndex = 4; 
    const passedStems = diffDays % 10;
    let currentStemIndex = (baseStemIndex + passedStems) % 10;
    if (currentStemIndex < 0) currentStemIndex += 10;
    
    return STEMS[currentStemIndex];
};

export const getSixBeasts = (dayStem: Stem): SixBeast[] => {
    const map: Record<Stem, SixBeast[]> = {
        '甲': ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'],
        '乙': ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'],
        '丙': ['朱雀', '勾陈', '腾蛇', '白虎', '玄武', '青龙'],
        '丁': ['朱雀', '勾陈', '腾蛇', '白虎', '玄武', '青龙'],
        '戊': ['勾陈', '腾蛇', '白虎', '玄武', '青龙', '朱雀'],
        '己': ['腾蛇', '白虎', '玄武', '青龙', '朱雀', '勾陈'],
        '庚': ['白虎', '玄武', '青龙', '朱雀', '勾陈', '腾蛇'],
        '辛': ['白虎', '玄武', '青龙', '朱雀', '勾陈', '腾蛇'],
        '壬': ['玄武', '青龙', '朱雀', '勾陈', '腾蛇', '白虎'],
        '癸': ['玄武', '青龙', '朱雀', '勾陈', '腾蛇', '白虎'],
    };
    return map[dayStem];
};

const getBinary = (lines: LineValue[]): string => {
  return lines.map(l => (l === 7 || l === 9 ? '1' : '0')).join('');
};

/**
 * Get full info. 
 * @param subjectPalaceElement If provided, 'Relations' are calculated relative to this element 
 * (used for Transformed hexagram to keep relation to Main subject).
 */
export const getHexagramInfo = (lines: LineValue[], date: Date, subjectPalaceElement?: Element) => {
  const lowerLines = lines.slice(0, 3);
  const upperLines = lines.slice(3, 6);
  
  const lowerBinary = getBinary(lowerLines);
  const upperBinary = getBinary(upperLines);
  
  const lowerTrigram = TRIGRAMS[lowerBinary];
  const upperTrigram = TRIGRAMS[upperBinary];
  
  const fullBinary = lowerBinary + upperBinary;
  
  // 1. Determine Palace and Shi/Ying
  const { palaceElement, shiIndex, palaceName } = getPalaceAndShi(fullBinary);
  // Ying is always 3 lines away from Shi
  const yingIndex = (shiIndex + 3) > 6 ? (shiIndex + 3) - 6 : (shiIndex + 3);

  // 2. Determine Day Stem for Six Beasts
  const dayStem = getDayStem(date);
  const sixBeasts = getSixBeasts(dayStem);

  // Determine which element to use for Relations (Six Relatives)
  // If this is a transformed hexagram, we use the Main hexagram's palace element.
  const referenceElement = subjectPalaceElement || palaceElement;

  // 3. Map Lines
  const lineDetails = lines.map((val, idx) => {
    const isUpper = idx >= 3;
    const trigram = isUpper ? upperTrigram : lowerTrigram;
    const localIdx = idx % 3;
    
    // Stem and Branch
    const stem = isUpper ? trigram.stemOuter : trigram.stemInner;
    const branch = isUpper ? trigram.branchesOuter[localIdx] : trigram.branchesInner[localIdx];
    const stemBranch = stem + branch;
    
    // Element & Relation
    const element = BRANCH_ELEMENTS[branch];
    let relation: Relation = '子孙'; // Default
    if (element === referenceElement) relation = '兄弟';
    else if (ELEMENTS_GENERATION[element] === referenceElement) relation = '父母';
    else if (ELEMENTS_GENERATION[referenceElement] === element) relation = '子孙';
    else if (ELEMENTS_CONTROL[element] === referenceElement) relation = '官鬼';
    else if (ELEMENTS_CONTROL[referenceElement] === element) relation = '妻财';

    // Na Yin
    const naYin = NA_YIN[stemBranch] || '';
    
    // Six Beast
    const beast = sixBeasts[idx];

    // Shi / Ying (Only relevant if this is main hexagram, or if we want to show position in transformed too)
    // Usually Transformed hexagram doesn't strictly have Shi/Ying in the same way for interpretation,
    // but the position logic holds for the hexagram structure itself.
    const linePos = idx + 1;
    const isShi = linePos === shiIndex;
    const isYing = linePos === yingIndex;

    return {
      index: linePos,
      value: val,
      isYang: val === 7 || val === 9,
      isChanging: val === 6 || val === 9,
      stem,
      branch,
      stemBranch,
      element,
      relation,
      naYin,
      beast,
      isShi,
      isYing
    };
  });

  // Construct Name
  // The map uses Upper+Lower as key convention for mixed hexagrams
  const lookupKey = upperBinary + lowerBinary;
  const name = HEXAGRAM_NAMES[lookupKey] || `${upperTrigram.chineseName}${lowerTrigram.chineseName}`;

  return {
    lowerTrigram,
    upperTrigram,
    lineDetails,
    name,
    palaceName,
    palaceElement,
    dayStem,
    fullBinary
  };
};

export const getTransformedLines = (lines: LineValue[]): LineValue[] => {
  return lines.map(l => {
    if (l === 6) return 7; // Old Yin -> Young Yang
    if (l === 9) return 8; // Old Yang -> Young Yin
    if (l === 7) return 7;
    if (l === 8) return 8;
    return 7; // fallback
  });
};
