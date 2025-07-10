
import { GoogleGenAI, Type } from "@google/genai";
import { type AnalysisData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        turbidez: {
            type: Type.OBJECT,
            description: "Análise da turbidez da água (quão turva está).",
            properties: {
                nivel: { type: Type.STRING, enum: ["Baixo", "Médio", "Alto"], description: "Nível de turbidez." },
                descricao: { type: Type.STRING, description: "Breve descrição do que foi observado." }
            },
            required: ["nivel", "descricao"]
        },
        algas: {
            type: Type.OBJECT,
            description: "Análise da presença de algas ou material vegetal similar.",
            properties: {
                nivel: { type: Type.STRING, enum: ["Baixo", "Médio", "Alto"], description: "Nível de presença de algas." },
                descricao: { type: Type.STRING, description: "Breve descrição do que foi observado." }
            },
            required: ["nivel", "descricao"]
        },
        cor: {
            type: Type.OBJECT,
            description: "Análise da cor da água (amarelada, marrom, etc.). 'Normal' se for incolor.",
            properties: {
                nivel: { type: Type.STRING, enum: ["Normal", "Médio", "Alto"], description: "Nível de coloração anormal. 'Normal' para transparente." },
                descricao: { type: Type.STRING, description: "Breve descrição da cor observada." }
            },
            required: ["nivel", "descricao"]
        },
        residuos: {
            type: Type.OBJECT,
            description: "Análise da presença de resíduos sólidos visíveis (plástico, detritos, espuma, óleo).",
            properties: {
                nivel: { type: Type.STRING, enum: ["Baixo", "Médio", "Alto"], description: "Nível de resíduos visíveis." },
                descricao: { type: Type.STRING, description: "Breve descrição dos resíduos observados." }
            },
            required: ["nivel", "descricao"]
        },
        sumario: {
            type: Type.STRING,
            description: "Um resumo geral e conciso da análise visual em uma ou duas frases."
        }
    },
    required: ["turbidez", "algas", "cor", "residuos", "sumario"]
};


export const analyzeWaterImage = async (imageFile: File): Promise<AnalysisData> => {
    const imagePart = await fileToGenerativePart(imageFile);

    const prompt = `
        Você é um especialista em análise visual de qualidade da água. Analise a imagem de uma amostra de água fornecida.
        Com base APENAS em pistas visuais na imagem, forneça uma estimativa dos seguintes parâmetros. Não faça suposições além do que é visível.
        Sua resposta deve estar estritamente em formato JSON, seguindo o schema fornecido.
        A análise deve ser em Português (Brasil).
        - Turbidez: Avalie se a água está clara ou turva.
        - Algas: Procure por coloração verde ou material em suspensão que sugira algas.
        - Cor: Observe qualquer cor anormal (amarelada, marrom). Se parecer incolor, considere 'Normal'.
        - Resíduos: Identifique quaisquer partículas flutuantes, espuma, óleo ou lixo.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    imagePart,
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });

        const text = response.text;
        if (!text) {
          throw new Error("A API retornou uma resposta vazia.");
        }
        
        // The response text should already be a valid JSON string due to responseSchema
        return JSON.parse(text) as AnalysisData;
    } catch (error) {
        console.error("Erro na chamada da API Gemini:", error);
        throw new Error("Não foi possível processar a imagem. A API pode estar indisponível ou a imagem pode ser inválida.");
    }
};
