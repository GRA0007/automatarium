import { useEffect, useCallback, DependencyList } from 'react'
import { SidePanelKey } from '/src/components/Sidepanel/Panels'
import { PositionedTransition } from '/src/util/states'

import { Coordinate } from '/src/types/ProjectTypes'

/**
 * Mouse event that includes the original event but also adds extra info like where in the view the click was
 * and if it was clicking the SVG
 */
type SVGMouseData = {originalEvent: MouseEvent, didTargetSVG: boolean, viewX: number, viewY: number}
type CommentEventData = {originalEvent: MouseEvent, comment: {id: number, text: string}}

/**
 * Mapping of events to what data the event accepts.
 * If making a custom event just add it here first
 */
export interface CustomEvents {
  'editTransition': {id: number},
  'editComment': {id?: number, x: number, y: number},
  'editStateName': {id: number},
  'editStateLabel': {id: number},
  'modal:preferences': null,
  'exportImage': {type: string, clipboard?: boolean} | null,
  /**
   * Event to open a side panel.
   * @see SidePanelKey for available panels
   */
  'sidepanel:open': {panel: SidePanelKey},
  'modal:shortcuts': null,
  'svg:mousedown': SVGMouseData,
  'svg:mouseup': SVGMouseData,
  'state:mouseup': SVGMouseData,
  'state:mousedown': SVGMouseData,
  'transition:mouseup': {originalEvent: MouseEvent, transition: PositionedTransition},
  'transition:mousedown': {originalEvent: MouseEvent, transition: PositionedTransition},
  'ctx:svg': Coordinate,
  'ctx:state': Coordinate,
  'ctx:transition': Coordinate,
  'ctx:comment': Coordinate,
  'bottomPanel:open': { panel: string },
  'bottomPanel:close': null,
  'comment:mousedown': CommentEventData,
  'comment:mouseup': CommentEventData,
  /**
   * Called when an edge (The line joining two states) is called. It contains
   * all the transitions that use that edge
   */
  'edge:mousedown': {originalEvent: MouseEvent, transitions: PositionedTransition[]}
}

/**
 * The mapping of all available events.
 * It is a combination of our custom events along with DOM events
 */
export type Events = {[K in keyof CustomEvents]: CustomEvent<CustomEvents[K]>} & DocumentEventMap & WindowEventMap

/**
 * What a function that handles an event should look like
 */
type EventHandler<T extends keyof Events> = (e: Events[T]) => void

interface EventOptions {
  target?: Document | Window,
  options?: boolean | AddEventListenerOptions
}

const useEvent = <T extends keyof Events>(name: T, handler: EventHandler<T>,
  dependencies?: DependencyList, {
    target = document,
    options
  } = {} as EventOptions) => {
  const callback = useCallback(handler, dependencies)
  useEffect(() => {
    target.addEventListener(name, callback, options)
    return () => target.removeEventListener(name, callback, options)
  }, [callback])
}

export default useEvent
