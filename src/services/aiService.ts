export interface AIServiceResponse {
  success: boolean;
  result: string;
  source: string;
  error?: string;
}

export const aiService = {
  generateResumeSummary: async (): Promise<AIServiceResponse> => ({
    success: false,
    result: '',
    source: 'none',
    error: 'AI feature disabled.',
  }),
  improveResumeSummary: async (): Promise<AIServiceResponse> => ({
    success: false,
    result: '',
    source: 'none',
    error: 'AI feature disabled.',
  }),
  improveJobDescription: async (): Promise<AIServiceResponse> => ({
    success: false,
    result: '',
    source: 'none',
    error: 'AI feature disabled.',
  }),
  suggestSkillsForRole: async (): Promise<string[]> => [],
  generateCoverLetter: async (): Promise<AIServiceResponse> => ({
    success: false,
    result: '',
    source: 'none',
    error: 'AI feature disabled.',
  }),
  improveCoverLetter: async (): Promise<AIServiceResponse> => ({
    success: false,
    result: '',
    source: 'none',
    error: 'AI feature disabled.',
  }),
  improveBiodataWording: async (): Promise<AIServiceResponse> => ({
    success: false,
    result: '',
    source: 'none',
    error: 'AI feature disabled.',
  }),
};
