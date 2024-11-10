import { Link, LinkProps, To } from 'react-router-dom'
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

import { TourButtonStyleClass } from './tourButtonStyle'

type BaseButtonProps = {
  children?: ReactNode
  icon?: JSX.Element
  surface?: boolean
  secondary?: boolean
}

type AnchorButtonProps = {
  href: string
} & BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>

type LinkButtonProps = {
  to: To
} & BaseButtonProps & LinkProps

type ButtonButtonProps = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement>

type ButtonProps = AnchorButtonProps | ButtonButtonProps | LinkButtonProps

const TourButton = ({
  type = 'button',
  children,
  icon,
  secondary,
  surface,
  ...props
}: ButtonProps) => {
  // Select which element to use.
  let Element: any
  if ('href' in props) {
    Element = 'a'
  } else if ('to' in props) {
    Element = Link
  } else {
    Element = 'button'
  }

  return (
    <Element
      className={TourButtonStyleClass({
        $icon: icon && !children,
        $secondary: secondary,
        $surface: surface
      })}
      type={type as ButtonHTMLAttributes<HTMLButtonElement>['type']}
      {...props}
    >
      {icon}
      {children}
    </Element>
  )
}

export default TourButton
