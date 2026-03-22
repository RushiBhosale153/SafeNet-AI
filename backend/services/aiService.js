const axios = require('axios');

/**
 * AI Service
 * Generates security explanations using OpenRouter (LLM)
 */
class AiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = 'gemini-1.5-flash';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
  }

  /**
   * Generates a structured explanation for a scan result
   * @param {Object} result - The result from detectionService
   */
  async generateAiExplanation(result) {
    if (!this.apiKey) {
      console.warn('⚠️ GEMINI_API_KEY not set. AI summaries will be unavailable.');
      return "AI analysis is currently unavailable. Please review the raw intelligence data and risk score.";
    }

    const prompt = this.buildPrompt(result);

    try {
      const response = await axios.post(
        this.apiUrl,
        {
          contents: [
            {
              parts: [
                {
                  text: `You are a Senior Cybersecurity Analyst for CyberNet AI. Provide professional, concise, and actionable threat explanations. 
                  Use these exact markdown subheadings: 
                  ### 🔍 Threat Analysis
                  ### 🛡️ Risk Factors
                  ### 📝 Protocol Recommendation
                  
                  Scan Result to Analyze:
                  ${prompt}`
                }
              ]
            }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      const aiText = response.data.candidates[0].content.parts[0].text;
      return aiText;
    } catch (error) {
      console.error('Gemini AI Service Error:', error.response?.data || error.message);
      return "Unable to generate AI explanation at this time. Please follow standard security protocols for this risk level.";
    }
  }

  buildPrompt(result) {
    const { type, target, riskScore, verdict, sources, detectedThreats, advice, confidence } = result;
    
    let context = `Input Type: ${type.toUpperCase()}\n`;
    context += `Target: ${target}\n`;
    context += `Risk Score: ${riskScore}/100\n`;
    context += `Confidence Level: ${confidence?.level || 'N/A'} (${confidence?.score || 0}%)\n`;
    context += `Verdict: ${verdict}\n\n`;

    if (type === 'url' && sources) {
      context += `Intelligence Signals:\n`;
      Object.entries(sources).forEach(([name, s]) => {
        if (s.status === 'flagged') {
          context += `- ${name}: FLAGGED (Reason: ${s.reason || 'Malicious indicator'})\n`;
        } else if (s.status === 'not_flagged') {
          context += `- ${name}: Clean\n`;
        }
      });
    } else if (type === 'text' && detectedThreats) {
      context += `Detected Heuristic Patterns:\n`;
      detectedThreats.forEach(t => context += `- ${t}\n`);
    }

    context += `\nBase Protocol Recommendation: ${advice}\n`;

    return context;
  }
}

module.exports = new AiService();

