import { DependencyList, MouseEvent, useCallback, useEffect } from 'react'
import { SidePanelKey } from '/src/components/Sidepanel/Panels'
import { PositionedTransition } from '/src/util/states'

import { Coordinate } from '/src/types/ProjectTypes'

/**
 * Mouse event that includes the original event but also adds extra info like where in the view the click was
 * and if it was clicking the SVG
 */
export type SVGMouseEventData = { originalEvent: MouseEvent, didTargetSVG: boolean, viewX: number, viewY: number, ctx: null }

export type StateEventData = { originalEvent: MouseEvent, state: { id: number, name: string, cx: number, cy: number }, ctx: null | number }

export type CommentEventData = { originalEvent: MouseEvent, comment: { id: number, text: string }, ctx: null | number }
/**
 * Contains information about the click along with the transition that was clicked
 */
export type TransitionEventData = { originalEvent: MouseEvent, transition: PositionedTransition, ctx: null | number }
export type EdgeEventData = { originalEvent: MouseEvent, transitions: PositionedTransition[], ctx: null | number }
export type TransitionHandleEventData = { originalEvent: MouseEvent, transitionInfo: { transitionIds: number[], fromId: number, toId: number, isMovingStart: boolean, otherPosition: Coordinate } }
/**
 * Mapping of events to what data the event accepts.
 * If making a custom event just add it here first
 */
export interface CustomEvents {
  'editTransition': { id: number, new?: boolean },
  'editComment': { id?: number, x: number, y: number },
  'editStateName': { id: number },
  'editStateLabel': { id: number },
  'modal:preferences': null,
  'exportImage': { type: string, clipboard?: boolean } | null,
  'editTransitionGroup': { ctx: number },
  /**
   * Event to open a side panel.
   * @see SidePanelKey for available panels
   */
  'sidepanel:open': { panel: SidePanelKey },
  'modal:shortcuts': null,
  'modal:finalstate': null,
  'svg:mousedown': SVGMouseEventData,
  'svg:mouseup': SVGMouseEventData,
  'svg:mousemove': SVGMouseEventData,
  'state:mouseup': StateEventData,
  'state:mousedown': StateEventData,
  'state:dblclick': StateEventData
  'transition:mouseup': TransitionEventData,
  'transition:mousedown': TransitionEventData,
  'transition:dblclick': TransitionEventData,
  /**
   * Context menu events
   */
  'ctx:svg': Coordinate,
  'ctx:state': Coordinate,
  'ctx:transition': Coordinate,
  'ctx:comment': Coordinate,
  'ctx:edge': Coordinate,
  'ctx:close': null,
  'bottomPanel:open': { panel: string },
  'bottomPanel:close': null,
  'comment:mousedown': CommentEventData,
  'comment:mouseup': CommentEventData,
  'comment:dblclick': CommentEventData,
  /**
   * Called when an edge (The line joining two states) is called. It contains
   * all the transitions that use that edge
   */
  'edge:mousedown': EdgeEventData,
  'edge:mouseup': EdgeEventData,
  'edge:dblclick': EdgeEventData,
  /**
   * On the edge handle for when you want to drag transitions
   * from one state to another
   */
  'transitionhandle:mouseup': TransitionHandleEventData,
  'transitionhandle:mousedown': TransitionHandleEventData,
  'showWarning': string,
  'modal:deleteConfirm': null,
  'modal:editorConfirmation': { title: string, description: string, tid: string },
  'modal:import': null,
  'modal:importModule': null,
  'modal:createModule': { project: boolean},
  'showSharing': null,
  'showModuleSharing': null,
  'stackVisualiser:toggle': { state: boolean },
  'createTemplateThumbnail': string,
  'storeTemplateThumbnail': string,
  'selectionGraph:hide': null,
}

/**
 * The mapping of all available events.
 * It is a combination of our custom events along with DOM events
 */
export type Events = { [K in keyof CustomEvents]: CustomEvent<CustomEvents[K]> } & DocumentEventMap & WindowEventMap

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
