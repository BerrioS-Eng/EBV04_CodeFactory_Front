import { relativeTime } from '@/lib/format/relative-time'

describe('Format - relativeTime function', () => {
  const now = new Date('2024-01-15T12:00:00Z').getTime()

  it('should return empty string for invalid ISO date', () => {
    const result = relativeTime('invalid-date', now)
    expect(result).toBe('')
  })

  it('should format time 1 minute ago', () => {
    const oneMinuteAgo = new Date(now - 60 * 1000).toISOString()
    const result = relativeTime(oneMinuteAgo, now)
    expect(result).toContain('minuto')
  })

  it('should format time 1 hour ago', () => {
    const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString()
    const result = relativeTime(oneHourAgo, now)
    expect(result).toContain('hora')
  })

  it('should format time 1 day ago', () => {
    const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000).toISOString()
    const result = relativeTime(oneDayAgo, now)
    expect(result).toBe('ayer')
  })

  it('should format time 3 days ago', () => {
    const threeDaysAgo = new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString()
    const result = relativeTime(threeDaysAgo, now)
    expect(result).toContain('día')
  })

  it('should format time in the future', () => {
    const oneHourLater = new Date(now + 60 * 60 * 1000).toISOString()
    const result = relativeTime(oneHourLater, now)
    expect(result).toBeTruthy()
    expect(result.length).toBeGreaterThan(0)
  })

  it('should use current time when not provided', () => {
    const now = Date.now()
    const oneMinuteAgo = new Date(now - 60 * 1000).toISOString()
    const result = relativeTime(oneMinuteAgo)
    expect(result).toContain('minuto')
  })
})
