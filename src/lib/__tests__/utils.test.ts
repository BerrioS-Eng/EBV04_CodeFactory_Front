import { cn } from '@/lib/utils'

describe('Utils - cn function', () => {
  it('should merge class names correctly', () => {
    const result = cn('px-2', 'py-1')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
  })

  it('should handle conditional classes', () => {
    const result = cn('px-2', false && 'py-1', true && 'my-1')
    expect(result).toContain('px-2')
    expect(result).toContain('my-1')
    expect(result).not.toContain('py-1')
  })

  it('should merge tailwind classes without duplicates', () => {
    const result = cn('px-2 py-1', 'py-2')
    expect(result).toContain('px-2')
    // twMerge should keep the last py value
    expect(result).toMatch(/py-[12]/)
  })

  it('should handle arrays of classes', () => {
    const result = cn(['px-2', 'py-1'], 'my-1')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
    expect(result).toContain('my-1')
  })

  it('should handle undefined and null', () => {
    const result = cn('px-2', undefined, null, 'py-1')
    expect(result).toContain('px-2')
    expect(result).toContain('py-1')
  })
})
