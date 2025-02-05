'use client'
import { ReactNode, HTMLProps, createElement, FC } from 'react'
import { cn } from '../../helpers/cn'
import { KeepTypography } from '../../Keep/KeepTheme'

interface TypographyProps extends HTMLProps<HTMLElement> {
  variant?: keyof JSX.IntrinsicElements | KeepTypography
  children?: ReactNode
  className?: string
}

const mapStringToElement = (variant: string): keyof JSX.IntrinsicElements | undefined => {
  if (variant.startsWith('heading')) {
    const headingNumber = parseInt(variant.substring('heading-'.length), 10)

    if (headingNumber >= 7) return 'h6'

    if (!isNaN(headingNumber) && headingNumber >= 1 && headingNumber <= 6) {
      return `h${headingNumber}` as keyof JSX.IntrinsicElements
    }
  }

  if (variant.startsWith('display')) {
    return 'h1'
  }

  if (variant.startsWith('body') || variant.startsWith('description')) {
    return 'p'
  }

  return undefined
}

export const Typography: FC<TypographyProps> = ({ variant = 'div', children, className, ...otherProps }) => {
  const Element = variant || 'div'
  const mappedElementType = typeof variant === 'string' ? mapStringToElement(variant) : undefined
  const FinalElement = mappedElementType || Element

  switch (true) {
    case variant?.startsWith('heading'):
      const heading = +variant?.split('-')[1]
      return createElement(
        FinalElement,
        {
          className: cn(heading > 6 ? `heading-6` : variant, className),
          ...otherProps,
        },
        children,
      )
    case variant?.startsWith('display'):
      const display = +variant?.split('-')[1]
      return createElement(
        FinalElement,
        {
          className: cn(display > 4 ? `display-4` : variant, className),
          ...otherProps,
        },
        children,
      )
    case variant?.startsWith('body'):
      const body = +variant?.split('-')[1]
      return createElement(
        FinalElement,
        {
          className: cn(body > 6 ? `body-6` : variant, className),
          ...otherProps,
        },
        children,
      )
    case variant?.startsWith('description'):
      const description = +variant?.split('-')[1]
      return createElement(
        FinalElement,
        {
          className: cn(description > 4 ? `description-4` : variant, className),
          ...otherProps,
        },
        children,
      )
    default:
      return createElement(
        FinalElement,
        {
          className: cn(className),
          ...otherProps,
        },
        children,
      )
  }
}
