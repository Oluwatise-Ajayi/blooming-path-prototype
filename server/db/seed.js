import { runQuery, getQuery, initDatabase } from './database.js';

export async function seedDatabase() {
  await initDatabase();

  // 1. Initial Pathway
  const existingPathway = await getQuery('SELECT * FROM pathways WHERE id = ?', ['pathway-admin-asst']);
  if (!existingPathway) {
    await runQuery(
      `INSERT INTO pathways (id, name, description, active)
       VALUES (?, ?, ?, 1)`,
      [
        'pathway-admin-asst',
        'Administrative Assistant',
        'Prepares individuals for administrative, scheduling, customer contact, and office operations roles.'
      ]
    );
  }

  // 2. High-Quality Simulation
  const existingSim = await getQuery('SELECT * FROM simulations WHERE id = ?', ['sim-appointment-scheduling']);
  if (!existingSim) {
    await runQuery(
      `INSERT INTO simulations (id, pathway_id, title, description, scenario_context, active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [
        'sim-appointment-scheduling',
        'pathway-admin-asst',
        'Administrative Assistant — Appointment Scheduling',
        'Handle caller appointment modification request while managing schedule constraints.',
        'You are supporting an office administrator. Your role involves handling appointment requests, updating schedules and communicating professionally with customers and colleagues. Current Schedule: 09:00 Team meeting, 10:00 Sarah Ahmed, 10:00 James Wilson, 11:30 Michael Brown, 14:00 Priya Shah. Michael Brown calls and asks whether his appointment can be moved to 10:00.'
      ]
    );
  }

  // 3. Primary Individual: Amina Hassan
  let amina = await getQuery('SELECT * FROM individuals WHERE email = ?', ['amina.hassan@example.com']);
  if (!amina) {
    await runQuery(
      `INSERT INTO individuals (id, external_reference, display_name, email, preferred_language, availability, employment_interests, previous_work_exposure, digital_confidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'ind-amina-hassan',
        'REF-8842',
        'Amina Hassan',
        'amina.hassan@example.com',
        'en',
        'immediate',
        'administration',
        'yes',
        'moderate'
      ]
    );
    amina = await getQuery('SELECT * FROM individuals WHERE email = ?', ['amina.hassan@example.com']);
  }

  // Seed readiness profile for Amina Hassan
  const aminaProfile = await getQuery('SELECT * FROM readiness_profiles WHERE individual_id = ?', [amina.id]);
  if (!aminaProfile) {
    await runQuery(
      `INSERT INTO readiness_profiles (id, individual_id, pathway_id, overall_signal, profile_version)
       VALUES (?, ?, ?, 'demonstrated', 'v1.0')`,
      ['prof-amina', amina.id, 'pathway-admin-asst']
    );

    // Seed capability signals
    const capabilities = [
      { name: 'communication', state: 'demonstrated', confidence: 'high' },
      { name: 'problem_solving', state: 'demonstrated', confidence: 'high' },
      { name: 'judgement', state: 'demonstrated', confidence: 'medium' },
      { name: 'professionalism', state: 'demonstrated', confidence: 'high' },
      { name: 'attention_to_detail', state: 'developing', confidence: 'medium' },
      { name: 'following_instructions', state: 'demonstrated', confidence: 'high' }
    ];

    for (const c of capabilities) {
      await runQuery(
        `INSERT INTO capability_signals (id, individual_id, capability, state, evidence_count, confidence)
         VALUES (?, ?, ?, ?, 2, ?)`,
        [`sig-amina-${c.name}`, amina.id, c.name, c.state, c.confidence]
      );
    }

    // Seed completed simulation session & assessment
    await runQuery(
      `INSERT INTO simulation_sessions (id, individual_id, simulation_id, status)
       VALUES (?, ?, ?, 'completed')`,
      ['simses-amina-01', amina.id, 'sim-appointment-scheduling']
    );

    await runQuery(
      `INSERT INTO assessments (id, simulation_session_id, status, overall_signal, summary)
       VALUES (?, ?, 'completed', 'demonstrated', 'Demonstrated strong communication, conflict resolution, and calm professionalism during appointment scheduling simulation.')`,
      ['asm-amina-01', 'simses-amina-01']
    );

    // Seed Evidence Records for Amina
    const evidenceList = [
      {
        id: 'EV-00017',
        cap: 'problem_solving',
        obs: 'Identified scheduling conflict at 10:00 and proposed alternative 11:30 slot.',
        text: 'Identified that the requested 10:00 appointment was unavailable and proposed an alternative slot at 11:30.',
        state: 'demonstrated',
        conf: 'high',
        rationale: 'Recognized double-booking risk and offered practical schedule alternative.'
      },
      {
        id: 'EV-00018',
        cap: 'communication',
        obs: 'Acknowledged customer request politely and explained constraint clearly.',
        text: 'I understand you need 10am, but that time is already booked. I can offer 11:30 instead.',
        state: 'demonstrated',
        conf: 'high',
        rationale: 'Maintained polite customer service tone while standing firm on appointment schedule constraints.'
      },
      {
        id: 'EV-00019',
        cap: 'professionalism',
        obs: 'Responded calmly when customer expressed frustration.',
        text: 'Maintained polite demeanor when customer pressed for unavailable time slot.',
        state: 'demonstrated',
        conf: 'high',
        rationale: 'Used respectful language under customer pressure.'
      }
    ];

    for (const ev of evidenceList) {
      await runQuery(
        `INSERT INTO evidence_records (id, assessment_id, individual_id, simulation_session_id, capability, observable_behaviour, evidence_text, assessment_state, confidence, rationale)
         VALUES (?, 'asm-amina-01', ?, 'simses-amina-01', ?, ?, ?, ?, ?, ?)`,
        [ev.id, amina.id, ev.cap, ev.obs, ev.text, ev.state, ev.conf, ev.rationale]
      );
    }
  }

  // 4. Secondary Candidate: Maria Garcia
  let maria = await getQuery('SELECT * FROM individuals WHERE email = ?', ['maria.garcia@example.com']);
  if (!maria) {
    await runQuery(
      `INSERT INTO individuals (id, external_reference, display_name, email, preferred_language, availability, employment_interests, previous_work_exposure, digital_confidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['ind-maria-garcia', 'REF-7721', 'Maria Garcia', 'maria.garcia@example.com', 'en', 'within_2_weeks', 'administration', 'yes', 'high']
    );
    maria = await getQuery('SELECT * FROM individuals WHERE email = ?', ['maria.garcia@example.com']);

    await runQuery(
      `INSERT INTO readiness_profiles (id, individual_id, pathway_id, overall_signal, profile_version)
       VALUES ('prof-maria', ?, 'pathway-admin-asst', 'demonstrated', 'v1.0')`,
      [maria.id]
    );

    await runQuery(
      `INSERT INTO capability_signals (id, individual_id, capability, state, evidence_count, confidence)
       VALUES ('sig-maria-comm', ?, 'communication', 'demonstrated', 1, 'high')`,
      [maria.id]
    );

    await runQuery(
      `INSERT INTO evidence_records (id, assessment_id, individual_id, simulation_session_id, capability, observable_behaviour, evidence_text, assessment_state, confidence, rationale)
       VALUES ('EV-00021', 'asm-maria-01', ?, 'simses-maria-01', 'communication', 'De-escalated anxious customer inquiry', 'Handled scheduling update calmly and verified details.', 'demonstrated', 'high', 'Clear communication during caller inquiry.')`,
      [maria.id]
    );
  }

  // 5. Tertiary Candidate: Fatima Zahra
  let fatima = await getQuery('SELECT * FROM individuals WHERE email = ?', ['fatima.zahra@example.com']);
  if (!fatima) {
    await runQuery(
      `INSERT INTO individuals (id, external_reference, display_name, email, preferred_language, availability, employment_interests, previous_work_exposure, digital_confidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['ind-fatima-zahra', 'REF-9903', 'Fatima Zahra', 'fatima.zahra@example.com', 'en', 'immediate', 'administration', 'no', 'moderate']
    );
    fatima = await getQuery('SELECT * FROM individuals WHERE email = ?', ['fatima.zahra@example.com']);

    await runQuery(
      `INSERT INTO readiness_profiles (id, individual_id, pathway_id, overall_signal, profile_version)
       VALUES ('prof-fatima', ?, 'pathway-admin-asst', 'developing', 'v1.0')`,
      [fatima.id]
    );

    await runQuery(
      `INSERT INTO capability_signals (id, individual_id, capability, state, evidence_count, confidence)
       VALUES ('sig-fatima-ps', ?, 'problem_solving', 'developing', 1, 'medium')`,
      [fatima.id]
    );

    await runQuery(
      `INSERT INTO evidence_records (id, assessment_id, individual_id, simulation_session_id, capability, observable_behaviour, evidence_text, assessment_state, confidence, rationale)
       VALUES ('EV-00022', 'asm-fatima-01', ?, 'simses-fatima-01', 'problem_solving', 'Identified scheduling conflict', 'Noted that slot was occupied.', 'developing', 'medium', 'Needs further practice proposing alternative times.')`,
      [fatima.id]
    );
  }

  console.log('Database seeded successfully.');
}
