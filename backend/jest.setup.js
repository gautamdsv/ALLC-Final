// jest.setup.js — runs before every test file
// Prevent notification emails from being attempted during tests
delete process.env.CLINIC_NOTIFY_EMAIL;
