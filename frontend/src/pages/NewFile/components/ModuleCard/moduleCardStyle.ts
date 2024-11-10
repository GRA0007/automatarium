import { styled } from 'goober'

export const CardContainer = styled('button')<{width: number, $istemplate: boolean}>`
  width: ${props => props.width}em;
  padding: 0;
  margin: 3px;
  background: none;
  border: 0;
  font: inherit;
  text-align: left;
  color: inherit;
  cursor: pointer;

  &:hover${props => !(props.$istemplate) && ', &:focus'} {
    outline: none;

    &:not(:disabled) > div:first-of-type {
      box-shadow: 0 0 0 3px var(--primary);
    }
  }
  &:disabled {
    cursor: default;
  }
`

export const CardImage = styled('div')<{$image?: boolean}>`
  aspect-ratio: 1;
  border-radius: .6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: var(--grid-bg);

  svg {
    width: 60%;
    height: 60%;
    aspect-ratio: inherit;
    display: block;
  }
  img {
    height: 100%;
    width: 100%;
    display: block;
    object-fit: contain;
  }

  ${props => !props.$image && `
    background: var(--grid-pattern);
    background-size: 1.875em 1.875em;
    background-position: .4735em .4735em;
  `}
`

export const TypeBadge = styled('div')`
  position: absolute;
  top: 1em;
  right: 1em;
  background: var(--toolbar);
  padding: .4em .6em;
  border-radius: .3em;
  letter-spacing: .1em;
  font-size: .8rem;
  font-weight: 600;
  opacity: .9;
`
export const TitleWithAction = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  a {
    color: var(--white);
    opacity: 0.5;

    &:hover {
      opacity: 1;
    }
  }
`

export const CardDetail = styled('div')`
  margin-block-start: 1em;
  list-style-type: none;

  span {
    display: block;
    opacity: .5;
    margin-block-start: .2rem;
    font-size: .9em;
  }
`

// Highlight and outline for selected template
export const SelectedTemplateOverlay = styled('div')`
  position: absolute;
  z-index: 9;
  background: hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.4);
  width: 100%;
  height: 100%;
  border-radius: .6rem;
  box-shadow: 0 0 0 3px var(--primary);
`
