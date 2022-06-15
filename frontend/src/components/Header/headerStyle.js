import { styled } from 'goober'

export const HeaderContainer = styled('header')`
  display: flex;
  align-items: center;
  margin-bottom: 1em;
  font-family: var(--font-feature);
  gap: 1em;
  user-select: none;

  ${p => p.$center && `
    justify-content: center;
  `}

  a {
    color: inherit;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 1em;
  }
`
