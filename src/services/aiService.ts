// Secure AI & Agent Client calling JARVIS Backend Service

export interface AgentCommandResult {
  success: boolean;
  state: string;
  tool_name?: string;
  speech_response: string;
  result_data?: Record<string, unknown>;
  error?: string;
}

export const getStoredModel = (): string => {
  return localStorage.getItem('jarvis_ai_model') || 'gemini-3.1-flash-live-preview';
};

export const setStoredModel = (model: string) => {
  localStorage.setItem('jarvis_ai_model', model);
};

export async function executeAgentCommand(command: string): Promise<AgentCommandResult> {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/agent/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('[aiService] Error executing agent command:', error);
    return {
      success: false,
      state: 'error',
      speech_response: `Could not reach JARVIS backend for command: "${command}".`,
      error: 'NETWORK_ERROR',
    };
  }
}

export async function askJarvisAI(prompt: string): Promise<string> {
  const model = getStoredModel();

  try {
    const response = await fetch('http://127.0.0.1:8000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'I have completed your request, Washim.';
  } catch (error) {
    console.error('[aiService] Error querying JARVIS backend:', error);
    return `I received your command: "${prompt}". Local workstation protocols are active.`;
  }
}
