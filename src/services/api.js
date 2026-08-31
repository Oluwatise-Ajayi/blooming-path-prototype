/**
 * BloomingPath API Client Service
 */

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Individuals
  getOrCreateIndividual: (email, display_name, preferred_language = 'en') =>
    request('/individuals', {
      method: 'POST',
      body: { email, display_name, preferred_language },
    }),

  getIndividual: (id) => request(`/individuals/${id}`),

  // Onboarding
  startOnboardingSession: (individual_id) =>
    request('/onboarding/sessions', {
      method: 'POST',
      body: { individual_id },
    }),

  recordOnboardingInteraction: (sessionId, individual_id, modality, prompt, raw_input, transcript) =>
    request(`/onboarding/sessions/${sessionId}/interactions`, {
      method: 'POST',
      body: { individual_id, modality, prompt, raw_input, transcript },
    }),

  completeOnboardingSession: (sessionId) =>
    request(`/onboarding/sessions/${sessionId}/complete`, {
      method: 'POST',
    }),

  // Pathways
  getPathways: () => request('/pathways'),

  assignPathway: (individual_id, pathway_id) =>
    request('/pathways/assign', {
      method: 'POST',
      body: { individual_id, pathway_id },
    }),

  // Workplace Simulations
  startSimulationSession: (individual_id, simulation_id = 'sim-appointment-scheduling') =>
    request('/simulations/sessions', {
      method: 'POST',
      body: { individual_id, simulation_id },
    }),

  recordSimulationTurn: (sessionId, turn_number, input_modality, transcript) =>
    request(`/simulations/sessions/${sessionId}/turns`, {
      method: 'POST',
      body: { turn_number, input_modality, transcript },
    }),

  evaluateSimulationSession: (sessionId) =>
    request(`/simulations/sessions/${sessionId}/evaluate`, {
      method: 'POST',
    }),

  // Evidence & Readiness
  getIndividualEvidence: (individualId) => request(`/individuals/${individualId}/evidence`),

  getIndividualReadiness: (individualId) => request(`/individuals/${individualId}/readiness`),

  // Employer Views
  getEmployerCandidates: () => request('/employer/individuals'),

  getEmployerCandidateProfile: (individualId) => request(`/employer/individuals/${individualId}`),
};
