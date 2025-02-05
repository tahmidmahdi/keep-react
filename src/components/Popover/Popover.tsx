'use client'
import { Children, FC, ReactNode, isValidElement, useEffect, useRef, useState } from 'react'
import { Description } from './Description'
import { Title } from './Title'
import { cn } from '../../helpers/cn'
import { Action } from './Action'
import {
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useTransitionStyles,
  FloatingArrow,
  arrow,
  autoPlacement,
  hide,
} from '@floating-ui/react'
import { Container } from './Container'
import { XCircle } from 'phosphor-react'
import { PopoverContext } from './PopoverContext'
import { useTheme } from '../../Keep/ThemeContext'

export interface PopoverProps {
  children?: ReactNode
  className?: string
  position?:
    | 'top'
    | 'top-end'
    | 'top-start'
    | 'bottom'
    | 'bottom-end'
    | 'bottom-start'
    | 'left'
    | 'left-end'
    | 'left-start'
    | 'right'
    | 'right-end'
    | 'right-start'
  showDismissIcon?: boolean
  trigger?: 'hover' | 'click'
  showArrow?: boolean
  icon?: ReactNode
  // [key: string]: any
}

export interface keepPopoverTheme {
  root: {
    base: string
    icon: string
  }
  title: string
  description: {
    base: string
    title: {
      off: string
      on: string
    }
  }
  container: string
}

export const PopoverComponent: FC<PopoverProps> = ({
  children,
  className,
  trigger = 'click',
  position = 'bottom-start',
  showDismissIcon = true,
  showArrow = true,
  icon,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState(true)
  const arrowRef = useRef(null)
  const { root } = useTheme().theme.popover
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
      autoPlacement({
        crossAxis: true,
        alignment: 'start',
        allowedPlacements: ['top', 'right', 'bottom', 'left'],
      }),
      hide({
        strategy: 'escaped',
      }),
    ],
    whileElementsMounted: autoUpdate,
    placement: position,
  })
  const hover = useHover(context, {
    enabled: trigger === 'hover',
  })
  const click = useClick(context, {
    enabled: trigger === 'click',
  })
  const dismiss = useDismiss(context)
  const role = useRole(context)
  const { styles } = useTransitionStyles(context, {
    duration: 300,
  })

  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role, hover])
  const actions = Children.toArray(children).filter((child) => isValidElement(child) && child.type === Action)
  const isTitleExists = Children.toArray(children).some((child) => isValidElement(child) && child.type === Title)
  const filteredChildren = Children.toArray(children).filter((child) => isValidElement(child) && child.type !== Action)

  useEffect(() => {
    if (isTitleExists) {
      setTitle(true)
    } else {
      setTitle(false)
    }
  }, [isTitleExists])
  return (
    <PopoverContext.Provider value={{ isTitleExist: title }}>
      <div className="inline-block" ref={refs.setReference} {...getReferenceProps()} onClick={() => setIsOpen(!isOpen)}>
        {actions}
      </div>
      {isOpen && (
        <div
          {...props}
          ref={refs.setFloating}
          style={{ ...floatingStyles, ...styles }}
          {...getFloatingProps()}
          className={cn(className, root.base)}>
          {showArrow && <FloatingArrow ref={arrowRef} context={context} fill="#FFFFFF" />}
          {showDismissIcon && (
            <button onClick={() => setIsOpen(false)} className={root.icon}>
              {typeof icon !== 'undefined' ? icon : <XCircle size={24} color="#5E718D" weight="light" />}
            </button>
          )}
          <div>{filteredChildren}</div>
        </div>
      )}
    </PopoverContext.Provider>
  )
}

Title.displayName = 'Popover.Title'
Description.displayName = 'Popover.Description'
Action.displayName = 'Popover.Body'
Container.displayName = 'Popover.Container'

export const Popover = Object.assign(PopoverComponent, {
  Title,
  Description,
  Action,
  Container,
})
