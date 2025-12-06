// Line values correspond to standard I Ching coin methods
// 6 = Old Yin (Changing) --x--
// 7 = Young Yang (Static) -----
// 8 = Young Yin (Static) -- --
// 9 = Old Yang (Changing) --o--

export type LineValue = 6 | 7 | 8 | 9;

export interface HexagramData {
    lines: LineValue[];
}

export enum LineType {
    Yin = 'Yin',
    Yang = 'Yang'
}

export enum ChangeType {
    None = 'None',
    ToYin = 'ToYin',
    ToYang = 'ToYang'
}