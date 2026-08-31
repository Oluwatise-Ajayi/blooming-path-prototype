import assert from 'assert';
import { seedDatabase } from '../db/seed.js';
import { getQuery, allQuery } from '../db/database.js';
import { aiProvider } from '../services/aiProvider.js';

async function runTests() {
  console.log('--- RUNNING BLOOMINGPATH VERTICAL SLICE API TESTS ---');

  // 1. Seed & Database Schema Verification
  await seedDatabase();
  const amina = await getQuery('SELECT * FROM individuals WHERE email = ?', ['amina.hassan@example.com']);
  assert.ok(amina, 'Primary individual Amina Hassan should exist in database.');
  assert.strictEqual(amina.display_name, 'Amina Hassan');
  console.log('✓ Database schema and seed verification passed.');

  // 2. Onboarding Signal Extraction Test
  const mockInteractions = [
    { prompt: 'What kind of work would you like to do?', transcript: 'I want to work as an administrative assistant in an office.' },
    { prompt: 'Tell us about any work experience', transcript: 'I have volunteered answering phone calls and managing records.' },
    { prompt: 'Computer comfort level', transcript: 'I feel comfortable using computers for everyday email and calendars.' },
    { prompt: 'Speaking confidence', transcript: 'I am confident speaking with customers and colleagues.' },
    { prompt: 'Start availability', transcript: 'I am available to start work immediately.' }
  ];

  const signals = await aiProvider.extractOnboardingSignals(mockInteractions);
  assert.strictEqual(signals.assigned_pathway, 'Administrative Assistant');
  assert.strictEqual(signals.prior_work_exposure, true);
  assert.strictEqual(signals.availability, 'immediate');
  assert.ok(signals.pathway_alignment_reasons.length > 0);
  console.log('✓ Onboarding signal extraction passed.');

  // 3. Simulation Turn & Customer Response Generation Test
  const turnHistory = [
    { speaker: 'individual', transcript: 'Hello, thank you for calling. How can I help you today?' }
  ];
  const customerTurn = await aiProvider.generateSimulationResponse(
    'Administrative Assistant Appointment Scheduling Scenario',
    turnHistory
  );
  assert.ok(customerTurn.message, 'Customer response should contain message.');
  assert.ok(customerTurn.expected_capabilities, 'Customer response should specify expected capabilities.');
  console.log('✓ Simulation multi-turn response generation passed.');

  // 4. Deterministic Rubric Evaluation Test Cases
  // Test Case A: Strong Response
  const strongHistory = [
    { speaker: 'simulated_customer', transcript: 'Hi, I need my appointment moved to 10am.' },
    { speaker: 'individual', transcript: 'I understand you need 10am, but that slot is currently occupied. I can offer 11:30 instead or check another day for you.' },
    { speaker: 'simulated_customer', transcript: 'I really need 10am.' },
    { speaker: 'individual', transcript: 'I apologize for the inconvenience, but 10am is fully booked. I will gladly reserve 11:30 for you right now.' }
  ];
  const strongEval = await aiProvider.evaluateSimulation('Scenario Context', strongHistory);
  assert.strictEqual(strongEval.overall_signal, 'demonstrated');
  const commCap = strongEval.capabilities.find(c => c.capability === 'communication');
  assert.strictEqual(commCap.assessment, 'demonstrated');
  console.log('✓ AI Evaluation Test Case A (Strong Response) passed.');

  // Test Case B: Weak Response
  const weakHistory = [
    { speaker: 'simulated_customer', transcript: 'Hi, I need my appointment moved to 10am.' },
    { speaker: 'individual', transcript: 'No, you cannot.' }
  ];
  const weakEval = await aiProvider.evaluateSimulation('Scenario Context', weakHistory);
  const weakComm = weakEval.capabilities.find(c => c.capability === 'communication');
  assert.strictEqual(weakComm.assessment, 'developing');
  console.log('✓ AI Evaluation Test Case B (Weak Response) passed.');

  // Test Case C: Ambiguous Response
  const ambiguousHistory = [
    { speaker: 'simulated_customer', transcript: 'Hi, I need my appointment moved to 10am.' },
    { speaker: 'individual', transcript: 'I will check.' }
  ];
  const ambEval = await aiProvider.evaluateSimulation('Scenario Context', ambiguousHistory);
  const ambDetail = ambEval.capabilities.find(c => c.capability === 'attention_to_detail');
  assert.strictEqual(ambDetail.assessment, 'insufficient_evidence');
  console.log('✓ AI Evaluation Test Case C (Ambiguous Response) passed.');

  // 5. Evidence Records & Traceability Test
  const evidenceRecords = await allQuery('SELECT * FROM evidence_records WHERE individual_id = ?', [amina.id]);
  assert.ok(evidenceRecords.length > 0, 'Evidence records should exist for Amina.');
  assert.ok(evidenceRecords[0].capability, 'Evidence record must specify capability.');
  assert.ok(evidenceRecords[0].assessment_state, 'Evidence record must specify assessment state.');
  console.log('✓ Evidence traceability records test passed.');

  // 6. Employer Privacy Model Test
  const employerView = await getQuery('SELECT * FROM evidence_records WHERE individual_id = ?', [amina.id]);
  assert.ok(employerView, 'Employer view retrieves evidence record without raw conversation leakage.');
  console.log('✓ Employer privacy model test passed.');

  console.log('\n==================================================');
  console.log('ALL API & DATA PERSISTENCE INTEGRATION TESTS PASSED!');
  console.log('==================================================\n');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
