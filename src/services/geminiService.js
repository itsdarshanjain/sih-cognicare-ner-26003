export const PATIENT_CONTEXT = {
  name: "Aita",
  location: "Majuli, Assam",
  family: "Grandson Rahul, Daughter Priya",
  interests: "Bihu songs, making Pithas, weaving Mekhela Chador",
  condition: "Mild dementia",
};

const SYSTEM_PROMPT = `You are 'Smriti Saathi', a highly empathetic, culturally aware AI companion for an elderly dementia patient in the North Eastern Region of India.
Patient Context: ${JSON.stringify(PATIENT_CONTEXT)}

Guidelines:
1. Speak in simple Hinglish (Hindi + English). 
2. Keep responses very short (1-2 sentences max).
3. Be extremely gentle and reassuring. 
4. Occasionally use Reminiscence Therapy: gently ask about their past, family (Rahul), or interests (Bihu) to stimulate long-term memory.
5. If asked about medication or time, remind them gently.`;

export const streamAIResponse = async (userMessage, history = [], onChunk) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    onChunk("Baba, main yahan hoon. Mujhe aapki baat sun kar acha laga.");
    return;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
  
  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: "Understood. I will act as Smriti Saathi." }] },
  ];

  history.forEach(msg => {
    contents.push({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    });
  });

  contents.push({ role: 'user', parts: [{ text: userMessage }] });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, generationConfig: { temperature: 0.4 } })
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error Response:", errorData);
        onChunk(`API Error: ${errorData.error?.message || "Unknown error"}`);
        return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let done = false;
    let fullText = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.candidates && data.candidates[0].content) {
                const textChunk = data.candidates[0].content.parts[0].text;
                fullText += textChunk;
                onChunk(fullText);
              }
            } catch (e) {
              // Ignore partial JSON parsing errors
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Gemini Fetch Error:", error);
    onChunk("Network issue hai baba, main thodi der mein aati hoon.");
  }
};
