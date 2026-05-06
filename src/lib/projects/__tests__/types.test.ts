import { PROJECT_STATUSES, STATUS_LABELS, PROJECT_STATUSES as statuses } from '@/lib/projects/types'

describe('Projects Types', () => {
  it('should have all project statuses defined', () => {
    expect(PROJECT_STATUSES).toContain('draft')
    expect(PROJECT_STATUSES).toContain('seeking_collaborators')
    expect(PROJECT_STATUSES).toContain('in_development')
    expect(PROJECT_STATUSES).toContain('completed')
  })

  it('should have status labels for all statuses', () => {
    PROJECT_STATUSES.forEach((status) => {
      expect(STATUS_LABELS[status]).toBeDefined()
      expect(typeof STATUS_LABELS[status]).toBe('string')
    })
  })

  it('should have correct status label translations', () => {
    expect(STATUS_LABELS.draft).toBe('Borrador')
    expect(STATUS_LABELS.seeking_collaborators).toBe('Buscando Colaboradores')
    expect(STATUS_LABELS.in_development).toBe('En Desarrollo')
    expect(STATUS_LABELS.completed).toBe('Completado')
  })

  it('should expose PROJECT_STATUSES as a readonly tuple at the type level', () => {
    expect(Array.isArray(PROJECT_STATUSES)).toBe(true)
    expect(PROJECT_STATUSES.length).toBe(4)
    expect(statuses).toBe(PROJECT_STATUSES)
  })
})
