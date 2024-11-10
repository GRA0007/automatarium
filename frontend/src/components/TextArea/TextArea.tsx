import { ForwardedRef, forwardRef, TextareaHTMLAttributes } from 'react'

import { InputColor, StyledTextArea } from './textAreaStyle'

interface InputProps {
  type?: string
  color?: InputColor
  small?: boolean
}

const TextArea = forwardRef(({
  type,
  color,
  small = false,
  ...props
}: InputProps & TextareaHTMLAttributes<HTMLTextAreaElement>, ref: ForwardedRef<HTMLTextAreaElement>) => (
  <StyledTextArea
    id={props.id ?? props.name}
    $color={color}
    $small={small}
    {...props}
    as={type === 'select' ? 'select' : 'textarea'}
    ref={ref}
    {...(type && type !== 'textarea' ? { type } : {})}
  />
))

export default TextArea
