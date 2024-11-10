import { styled } from 'goober'
import { forwardRef } from 'react'

export const ModuleWindowWrapper = styled('div', forwardRef)<{ width: string }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${(props) => props.width}; /* Dynamic width */
  background-color: var(--surface);
  border-right: 1px solid var(--surface);
  overflow-y: auto;
  color: var(--white);
  position: relative; /* To position the resize handle */
  overflow-y: auto;
  overflow: visible; 
  padding: 0 1em 1em;
`

export const ResizeHandle = styled('div')`
  height: 100%;

  background-color: rgb(165, 165, 165);
  width: 2px;

  position: absolute;
  top: 0;
  right: 0;

  cursor: ew-resize;

  // these prevent text selection while dragging
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  transition: background-color 0.2s ease-out, width 0.2s ease-out;

  &:hover {
    width: 3px;
    background-color: rgb(93, 159, 235);
  }
`

export const CloseButton = styled('button')`
  position: absolute;
  top: .6em;
  z-index: 1;
  right: -1em;
  height: 2em;
  width: 2em;
  font: inherit;
  color: inherit;
  background: var(--toolbar);
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border-radius: .3em;
  cursor: pointer;
`

export const TitleWrapper = styled('div')`
  display: flex;
`

export const Title = styled('h2')`
  font-size: 1.2em;
  font-weight: 600;
`

export const Content = styled('div')`
  margin-top: 30px;
`

export const ButtonContainer = styled('div')`
  position: absolute;
  top: .6em;
  right: 2em;
  height: 2em;
  display: flex;
  justify-content: center; 
  gap: 0.5em; 


  Button:nth-child(1) {
    background-color: transparent;
    color: var(--primary-dark);
    border: 2.5px solid var(--toolbar); 

    &:hover {
      background-color: var(--toolbar);
      color: white;
    }
  }
`

export const EditButton = styled('div')`
  position: absolute;
  top: .6em;
  right: 2em;
  height: 2em;
  display: flex;
  justify-content: center; 
  gap: 0.5em; 
`

export const TextArea = styled('textarea')`
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.3rem;
  margin-bottom: 0.8rem;
  box-sizing: border-box;
  background-color: var(--toolbar);
  color: white; 
  resize: none;

  
  &:focus {
    outline: none;
    border-color: var(--primary); 
  }
`

export const PaginationWrapper = styled('div')`
  display: flex;
  justify-content: center;

  gap: 8px;
  margin-top: auto; /* Ensures pagination sticks to the bottom */
`

export const SelectBox = styled('select')`
  background-color: var(--surface);
  color: var(--white);
  border: 1px solid var(--white);
  padding: 0.2em;
  font-size: 14px;
  border-radius: 0.3em;
  cursor: pointer;

  &:hover {
    background-color: var(--white);
    color: var(--toolbar);
  }
`
