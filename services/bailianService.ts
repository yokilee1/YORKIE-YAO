import OpenAI from "openai";
import { LineValue } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";
import { getHexagramInfo, getTransformedLines } from "../utils/iching";

export const analyzeHexagram = async (lines: LineValue[], question: string, date: Date): Promise<string> => {
  const apiKey = process.env.BAILIAN_API_KEY || process.env.API_KEY;
  
  // Debugging: Log the key prefix to verify which key is being used
  if (apiKey) {
    console.log(`Using API Key starting with: ${apiKey.substring(0, 4)}...`);
    if (apiKey.startsWith("AIza")) {
      console.error("CRITICAL ERROR: Detected a Google API Key being used for Alibaba Bailian service.");
      throw new Error("Configuration Error: You are using a Google API Key (starts with 'AIza') but trying to connect to Alibaba Bailian. Please update your .env.local file with a valid BAILIAN_API_KEY (starts with 'sk-').");
    }
  } else {
    console.error("CRITICAL ERROR: No API Key found.");
  }

  if (!apiKey) {
    throw new Error("API Key is missing. Please set BAILIAN_API_KEY in your .env.local file.");
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    dangerouslyAllowBrowser: true 
  });
  
  // Format Date for AI context
  const dateStr = date.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  // Get full technical details for Main
  const hexInfo = getHexagramInfo(lines, date);
  
  // Get details for Transformed
  const transformedLines = getTransformedLines(lines);
  const transformedInfo = getHexagramInfo(transformedLines, date, hexInfo.palaceElement);

  // Construct a detailed text representation of the hexagram structure
  const linesDescription = hexInfo.lineDetails.map((detail, idx) => {
    let changeState = "静爻";
    let transformedDesc = "";
    
    if (detail.value === 6) {
        changeState = "老阴 (动变阳)";
        const tDetail = transformedInfo.lineDetails[idx];
        transformedDesc = ` -> 变出: ${tDetail.relation}${tDetail.stemBranch}(${tDetail.element})`;
    }
    if (detail.value === 9) {
        changeState = "老阳 (动变阴)";
        const tDetail = transformedInfo.lineDetails[idx];
        transformedDesc = ` -> 变出: ${tDetail.relation}${tDetail.stemBranch}(${tDetail.element})`;
    }
    
    return `
    - 第 ${detail.index} 爻: ${detail.stemBranch} (${detail.element}) [${detail.relation}]
      六神: ${detail.beast} | 纳音: ${detail.naYin} | 状态: ${changeState}${transformedDesc}
      ${detail.isShi ? '**持世**' : ''} ${detail.isYing ? '**应爻**' : ''}
    `;
  }).join("");

  const hasChanges = lines.some(l => l === 6 || l === 9);
  const transformInfoStr = hasChanges ? `变卦: ${transformedInfo.name}` : "无变卦";

  const prompt = `
    用户提问: "${question}"
    起卦时间: ${dateStr} (请自行推算当时的干支月令与时辰能量)
    
    【卦象结构】
    本卦: ${hexInfo.name} (属 ${hexInfo.palaceName} 宫)
    ${transformInfoStr}
    
    【六爻排盘详情 (自下而上)】
    ${linesDescription}
    
    请根据《易经》六爻预测法进行深度解析。
    请特别注意以下专业因素的综合分析：
    1. **世应关系**：分析世爻（代表问卦人）与应爻（代表所问之事/人）的生克关系。
    2. **六神意象**：结合动爻或世爻所临的“六神”（如青龙、白虎等）来判断吉凶性质。
    3. **五行生克**：月令对爻的旺衰影响。
  `;

  try {
    const response = await client.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTION },
        { role: "user", content: prompt }
      ],
      temperature: 0.8, 
    });

    return response.choices[0].message.content || "解析完成，但未返回文本。";
  } catch (error) {
    console.error("Bailian API Error:", error);
    throw error;
  }
};
