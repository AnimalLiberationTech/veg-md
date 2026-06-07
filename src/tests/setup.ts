import '@testing-library/jest-dom'
import { vi } from 'vitest'

let mockTablesDBInstance = {
  createRow: vi.fn().mockResolvedValue({}),
};

// Mock Appwrite
vi.mock('appwrite', () => {
  return {
    Client: vi.fn().mockImplementation(function() {
      return {
        setEndpoint: vi.fn().mockReturnThis(),
        setProject: vi.fn().mockReturnThis(),
      };
    }),
    TablesDB: vi.fn().mockImplementation(function() {
      return mockTablesDBInstance;
    }),
    ID: {
      unique: vi.fn().mockReturnValue('unique-id'),
    },
  }
})

export { mockTablesDBInstance };

// Mock global fetch for country code
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ country_code: 'US' }),
  })
)
