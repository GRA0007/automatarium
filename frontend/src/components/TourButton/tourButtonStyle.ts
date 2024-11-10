import { css } from 'goober'

type WrapperProps = {
    $icon: boolean;
    $surface: boolean;
    $secondary: boolean;
}

export const TourButtonStyleClass = ({ $icon, $secondary, $surface }: WrapperProps) => css({
  margin: 0,
  border: 0,
  background: 'var(--primary)',
  font: 'inherit',
  color: 'var(--white)',
  fontWeight: '600',
  borderRadius: '50%', // Keep it circular
  fontSize: '.9em',
  cursor: 'pointer',
  display: 'flex', // Ensure it's a flex container
  justifyContent: 'center',
  alignItems: 'center',
  appearance: 'none',
  gap: '.5em',
  padding: $icon ? '.375em' : '.5em 1.2em',
  position: 'fixed',
  bottom: '55px',
  right: '55px',
  width: '60px', // Set a fixed width
  height: '60px', // Set a fixed height
  textDecoration: 'none',

  '&:active': {
    filter: 'brightness(0.94)'
  },

  '&:disabled': {
    filter: 'none',
    backgroundColor: 'var(--disabled-button)',
    opacity: '.8',
    cursor: 'default'
  },

  backgroundColor: $secondary ? 'var(--toolbar)' : $surface ? 'var(--surface)' : undefined
})
