'use client'

import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock component para testing
function SimpleButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="px-2 py-1">
      {children}
    </button>
  )
}

describe('Components - SimpleButton', () => {
  it('should render button with text', () => {
    render(<SimpleButton>Click me</SimpleButton>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('should call onClick handler when clicked', () => {
    const handleClick = jest.fn()
    render(<SimpleButton onClick={handleClick}>Click me</SimpleButton>)
    const button = screen.getByRole('button', { name: /click me/i })
    button.click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should have correct classes', () => {
    const { container } = render(<SimpleButton>Click me</SimpleButton>)
    const button = container.querySelector('button')
    expect(button).toHaveClass('px-2')
    expect(button).toHaveClass('py-1')
  })
})
