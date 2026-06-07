import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as telemetry from '@/utils/telemetry'
import { mockTablesDBInstance } from './setup'

// Helper to get the mocked TablesDB instance
const getMockedTablesDB = () => {
  return mockTablesDBInstance
}

describe('Telemetry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    telemetry._resetTelemetryCache()
    // Reset browser-like environment if needed
    // @ts-ignore
    global.window = {}
    // @ts-ignore
    global.navigator = { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
    // @ts-ignore
    global.document = { referrer: 'https://google.com' }
  })

  afterEach(() => {
    // @ts-ignore
    delete global.window
    // @ts-ignore
    delete global.navigator
    // @ts-ignore
    delete global.document
  })

  it('tracks page view successfully', async () => {
    await telemetry.trackPageView('/test-path')
    
    const tablesDB = getMockedTablesDB()
    expect(tablesDB.createRow).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        event_name: 'page_view',
        path: '/test-path',
        site: 'veg-md',
      })
    }))
  })

  it('handles Appwrite errors gracefully without crashing', async () => {
    const tablesDB = getMockedTablesDB()
    tablesDB.createRow.mockRejectedValueOnce(new Error('Appwrite Down'))
    
    // Should not throw
    await expect(telemetry.trackPageView('/test-path')).resolves.not.toThrow()
    
    expect(tablesDB.createRow).toHaveBeenCalled()
  })

  it('detects mobile devices correctly', async () => {
    // @ts-ignore
    global.navigator.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
    
    await telemetry.trackPageView('/mobile-path')
    
    const tablesDB = getMockedTablesDB()
    expect(tablesDB.createRow).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        device_type: 'mobile'
      })
    }))
  })

  it('detects desktop devices correctly', async () => {
    // @ts-ignore
    global.navigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    
    await telemetry.trackPageView('/desktop-path')
    
    const tablesDB = getMockedTablesDB()
    expect(tablesDB.createRow).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        device_type: 'desktop'
      })
    }))
  })

  it('tracks scroll depth', async () => {
    await telemetry.trackScroll('/scroll-path', 50)
    
    const tablesDB = getMockedTablesDB()
    expect(tablesDB.createRow).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        event_name: 'scroll_50',
        path: '/scroll-path'
      })
    }))
  })

  it('tracks time on page', async () => {
    await telemetry.trackTimeOnPage('/time-path', 123.456)
    
    const tablesDB = getMockedTablesDB()
    expect(tablesDB.createRow).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        event_name: 'time_on_page',
        metadata: 'seconds: 123'
      })
    }))
  })

  it('tracks JS errors with stack trace', async () => {
    await telemetry.trackJsError('/error-path', 'Test Error', 'Error: Test Error\n    at <anonymous>:1:1')
    
    const tablesDB = getMockedTablesDB()
    expect(tablesDB.createRow).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        event_name: 'js_error',
        metadata: expect.stringContaining('Test Error')
      })
    }))
    expect(tablesDB.createRow.mock.calls[0][0].data.metadata).toContain('at <anonymous>')
  })

  it('handles missing browser globals (SSR safety)', async () => {
    // @ts-ignore
    delete global.window
    
    await telemetry.trackPageView('/ssr-path')
    
    const tablesDB = getMockedTablesDB()
    expect(tablesDB.createRow).not.toHaveBeenCalled()
  })

  it('handles fetch errors for country code gracefully', async () => {
    // Force a fresh fetch by clearing any internal state if possible, 
    // but here we just ensure the mock fails
    // @ts-ignore
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')))
    
    await telemetry.trackPageView('/test-path-error')
    
    const tablesDB = getMockedTablesDB()
    expect(tablesDB.createRow).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        path: '/test-path-error',
        country: null
      })
    }))
  })
})
