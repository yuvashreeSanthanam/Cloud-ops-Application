
import { GoogleGenAI, Type } from "@google/genai";
import { AWSAccount } from "../types";

export const getAIRecommendations = async (accounts: AWSAccount[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const accountsSummary = accounts.map(acc => {
    return `Account: ${acc.name} (${acc.id}) has ASGs: ` + 
      acc.asgs.map(asg => `${asg.name} with ${JSON.stringify(asg.metrics)}`).join("; ");
  }).join("\n");

  const prompt = `
    As an AWS Cloud Architect and Cost Optimization expert, review the following EC2 fleet distribution:
    ${accountsSummary}

    Analyze the Spot vs On-Demand ratio. Provide 3 specific, actionable recommendations for saving costs or improving availability. 
    Focus on instance type families, spot availability, and typical price differences.
    Keep it professional and concise. Format as a bulleted list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No recommendations available at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI recommendations. Please check your fleet manually.";
  }
};
