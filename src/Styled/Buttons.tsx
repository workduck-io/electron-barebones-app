import { Icon } from '@iconify/react'
import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'
import { centeredCss } from './Layouts'

interface ButtonProps {
  highlight?: boolean
}

export const Button = styled.button<ButtonProps>`
  ${centeredCss};
  padding: ${({ theme }) => theme.spacing.small};
  margin: 0 ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  color: ${({ theme }) => theme.colors.text.subheading};
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    /* color: ${({ theme }) => theme.colors.text.heading}; */
    /* background: ${({ theme }) => theme.colors.gray[5]}; */
  }

  ${({ theme, highlight }) =>
    highlight
      ? css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          box-shadow: 0px 4px 8px ${({ theme }) => transparentize(0.33, theme.colors.primary)};
        `
      : ''}
`

export type IconButtonProps = {
  icon: any // eslint-disable-line @typescript-eslint/no-explicit-any
  title: string
  size?: string | number
  onClick?: any // eslint-disable-line @typescript-eslint/no-explicit-any
  highlight?: boolean
}

export const HeadlessButton = styled.button`
  border: none;
  background: transparent;
`

const IconButton: React.FC<IconButtonProps> = ({ icon, title, size, onClick, highlight }: IconButtonProps) => {
  return (
    <Button onClick={onClick} highlight={highlight} data-tip={title} data-place="bottom">
      <Icon icon={icon} height={size} />
    </Button>
  )
}

export default IconButton
