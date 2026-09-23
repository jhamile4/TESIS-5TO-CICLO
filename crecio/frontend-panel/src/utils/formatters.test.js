import { describe, expect, it } from 'vitest'
import { statusClass } from './formatters'

describe('statusClass', () => {
  it('maps order states to panel styles', () => {
    expect(statusClass('pagado')).toBe('paid')
    expect(statusClass('cancelado')).toBe('cancelled')
    expect(statusClass('pendiente')).toBe('pending')
  })
})
