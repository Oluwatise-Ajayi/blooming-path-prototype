import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../blooming_path.db');

sqlite3.verbose();
export const db = new sqlite3.Database(dbPath);

export function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Individuals
      db.run(`
        CREATE TABLE IF NOT EXISTS individuals (
          id TEXT PRIMARY KEY,
          external_reference TEXT,
          display_name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          preferred_language TEXT DEFAULT 'en',
          availability TEXT,
          employment_interests TEXT,
          previous_work_exposure TEXT,
          digital_confidence TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 2. Onboarding Sessions
      db.run(`
        CREATE TABLE IF NOT EXISTS onboarding_sessions (
          id TEXT PRIMARY KEY,
          individual_id TEXT NOT NULL,
          status TEXT DEFAULT 'in_progress',
          started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (individual_id) REFERENCES individuals(id)
        )
      `);

      // 3. Interactions
      db.run(`
        CREATE TABLE IF NOT EXISTS interactions (
          id TEXT PRIMARY KEY,
          individual_id TEXT NOT NULL,
          session_id TEXT NOT NULL,
          modality TEXT NOT NULL,
          prompt TEXT,
          raw_input TEXT,
          transcript TEXT,
          structured_output TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (individual_id) REFERENCES individuals(id),
          FOREIGN KEY (session_id) REFERENCES onboarding_sessions(id)
        )
      `);

      // 4. Pathways
      db.run(`
        CREATE TABLE IF NOT EXISTS pathways (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          active INTEGER DEFAULT 1
        )
      `);

      // 5. Simulations
      db.run(`
        CREATE TABLE IF NOT EXISTS simulations (
          id TEXT PRIMARY KEY,
          pathway_id TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT,
          scenario_context TEXT NOT NULL,
          active INTEGER DEFAULT 1,
          FOREIGN KEY (pathway_id) REFERENCES pathways(id)
        )
      `);

      // 6. Simulation Sessions
      db.run(`
        CREATE TABLE IF NOT EXISTS simulation_sessions (
          id TEXT PRIMARY KEY,
          individual_id TEXT NOT NULL,
          simulation_id TEXT NOT NULL,
          status TEXT DEFAULT 'in_progress',
          started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME,
          FOREIGN KEY (individual_id) REFERENCES individuals(id),
          FOREIGN KEY (simulation_id) REFERENCES simulations(id)
        )
      `);

      // 7. Simulation Turns
      db.run(`
        CREATE TABLE IF NOT EXISTS simulation_turns (
          id TEXT PRIMARY KEY,
          simulation_session_id TEXT NOT NULL,
          turn_number INTEGER NOT NULL,
          speaker TEXT NOT NULL,
          input_modality TEXT NOT NULL,
          transcript TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (simulation_session_id) REFERENCES simulation_sessions(id)
        )
      `);

      // 8. Assessments
      db.run(`
        CREATE TABLE IF NOT EXISTS assessments (
          id TEXT PRIMARY KEY,
          simulation_session_id TEXT NOT NULL,
          status TEXT DEFAULT 'completed',
          overall_signal TEXT,
          evaluation_version TEXT DEFAULT 'v1.0',
          confidence TEXT DEFAULT 'medium',
          summary TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (simulation_session_id) REFERENCES simulation_sessions(id)
        )
      `);

      // 9. Evidence Records
      db.run(`
        CREATE TABLE IF NOT EXISTS evidence_records (
          id TEXT PRIMARY KEY,
          assessment_id TEXT NOT NULL,
          individual_id TEXT NOT NULL,
          simulation_session_id TEXT NOT NULL,
          capability TEXT NOT NULL,
          observable_behaviour TEXT NOT NULL,
          evidence_text TEXT NOT NULL,
          assessment_state TEXT NOT NULL,
          confidence TEXT NOT NULL,
          rationale TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (assessment_id) REFERENCES assessments(id),
          FOREIGN KEY (individual_id) REFERENCES individuals(id),
          FOREIGN KEY (simulation_session_id) REFERENCES simulation_sessions(id)
        )
      `);

      // 10. Capability Signals
      db.run(`
        CREATE TABLE IF NOT EXISTS capability_signals (
          id TEXT PRIMARY KEY,
          individual_id TEXT NOT NULL,
          capability TEXT NOT NULL,
          state TEXT NOT NULL,
          evidence_count INTEGER DEFAULT 1,
          confidence TEXT NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (individual_id) REFERENCES individuals(id)
        )
      `);

      // 11. Readiness Profiles
      db.run(`
        CREATE TABLE IF NOT EXISTS readiness_profiles (
          id TEXT PRIMARY KEY,
          individual_id TEXT NOT NULL,
          pathway_id TEXT NOT NULL,
          overall_signal TEXT NOT NULL,
          profile_version TEXT DEFAULT 'v1.0',
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (individual_id) REFERENCES individuals(id),
          FOREIGN KEY (pathway_id) REFERENCES pathways(id)
        )
      `, (err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  });
}

// Helper wrappers for async db operations
export const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};
