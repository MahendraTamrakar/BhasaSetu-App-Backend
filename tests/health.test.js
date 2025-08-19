import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';

describe('Health Endpoints', () => {
  let server;

  beforeAll(() => {
    // Mock console to reduce test noise
    global.mockConsole();
  });

  afterAll(() => {
    // Restore console
    global.restoreConsole();
    if (server) {
      server.close();
    }
  });

  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: "BhashaSettu Translation API",
        version: "2.0",
        powered_by: "Google Gemini AI & Edge TTS"
      });
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "healthy",
        message: "BhashaSettu translation service is running"
      });
    });
  });

  describe('GET /supported-languages', () => {
    test('should return supported languages', async () => {
      const response = await request(app).get('/supported-languages');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('languages');
      expect(response.body).toHaveProperty('total_languages');
      expect(Array.isArray(response.body.languages)).toBe(true);
      expect(response.body.total_languages).toBeGreaterThan(0);
      expect(response.body.languages).toContain('Hindi');
      expect(response.body.languages).toContain('English');
    });
  });

  describe('GET /nonexistent', () => {
    test('should return 404 for nonexistent endpoints', async () => {
      const response = await request(app).get('/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Endpoint not found');
      expect(response.body).toHaveProperty('availableEndpoints');
    });
  });
});