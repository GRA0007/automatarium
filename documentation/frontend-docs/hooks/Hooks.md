# Hooks

How individual custom hooks work and gives examples of where they are used.

As an overview: something something something here.

### Table of contents

- [Hooks](#hooks)
    - [Table of contents](#table-of-contents)
- [useActions](#useactions)
- [useAuth](#useauth)
- [useAutosaveProject](#useautosaveproject)
- [useComment__](#usecomment__)
  - [useCommentCreation](#usecommentcreation)
  - [useCommentDragging](#usecommentdragging)
  - [useCommentSelection](#usecommentselection)
- [useContextMenus](#usecontextmenus)
- [useDeleteTool](#usedeletetool)
- [useEvent](#useevent)
- [useImageExport](#useimageexport)
- [useResource__](#useresource__)
  - [useResourceDragging](#useresourcedragging)
  - [useResourceSelection](#useresourceselection)
- [useState__](#usestate__)
  - [useStateCreation](#usestatecreation)
  - [useStateDragging](#usestatedragging)
  - [useStateSelection](#usestateselection)
- [useSyncCurrentProject](#usesynccurrentproject)
- [useSyncProject](#usesyncproject)
- [useTransition__](#usetransition__)
  - [useTransitionCreation](#usetransitioncreation)
  - [useTransitionSelection](#usetransitionselection)

# useActions


# useAuth


# useAutosaveProject


# useComment__

## useCommentCreation
When the user equips the comment tool, it displays a comment upon the surface of the editor panel. This hook contains a couple of methods using the ``useEvent`` hook, to recognise the events from the users clicks. When a comment is created, it also retrieves the x and y axis, which these preceding elements are then stored into the ``store`` (``useProjectStore``); 

## useCommentDragging
useCommentDragging is a custom hook that contains a selection of comments. The comments were originally selected from the ``useResourceDragging`` custom hook. useCommentDragging is simply a selected area of comments that can be used as reference. 

## useCommentSelection

Selects the 'comment' object from the  ``store``. It is also set to be referred to as ``'comment'``. 

For example, it can be used with useEvent:

```
 useEvent('comment:mousedown', event => {
       // Logic here.
 })
```

# useContextMenus
Creates and sets parameter presets for the ``useEvent`` hook. (Will need to explain further)

**Current presets:**
```
useEvent('svg:mouseup')

useEvent('state:mouseup')

useEvent('transition:mouseup')

useEvent('comment:mouseup')
```
**Example:**
```
useEvent('state:mouseup', event => {
    setShowGhost(false);
})

```
# useDeleteTool
The delete tool consists of ultilising the prominent custom hook of ``useEvent``. It follows the default MouseEvent syntax such as 
mousedown, but specific selects states, comments and transitions.

The states, transistions and comments are selected using the three hooks: ``useStateSelection, useTransitionSelection, useCommentSelection``.
These three corresponding hooks retrieve the needed elements to select in order for the ``useDeleteTool`` to have element/s to delete. 

Likewise, the delete tool hook contains methods to recognise the users click events and consists of logic for the resembling actions. For example, when the delete tool is selected and used on a state, the ``useEvent`` selects that state and deletes the state from the ``store`` (refer to ``useProjectStore``  for more information on the store). 

**How to use:**
1. Select the delete tool
2. Option A. Click on either a state, comment or transition to delete.
   
   Option B. Use the **Selection tool** to drag and select a area of the automata, then switch to the delete tool to delete selected area.

# useEvent

useEvent is essentially equivalent to the UI events for ``MouseEvent``. Except useEvent has more to utilise. 

# useImageExport
Exports the svg components of the automata as an image, and saves it to the users local computer. 

# useResource__

## useResourceDragging
This hook enables elements to be dragged

## useResourceSelection


# useState__

## useStateCreation
When the user equips the state tool, it displays a state svg upon the surface of the editor panel. This hook contains a couple of methods using the ``useEvent`` hook, to recognise the events from the users clicks. When a svg state is created, it also retrieves the x and y axis, which these preceding elements are then
stored into the ``store`` (``useProjectStore``); 

Additionally, upon creating a state, if the user holds down their mouse button, it will create a 'ghost' state. This UI element signifies a guide of placing a state. 

## useStateDragging
useStateDragging is a custom hook that contains a selection of states. The states were originally selected from the ``useResourceDragging`` custom hook. useStateDragging is simply a selected  area of states that can be used as reference. 

## useStateSelection

Selects the 'state' object from the  ``store``. It is also set to be referred to as ``'state'``. 

For example, it can be used with useEvent:

```
 useEvent('state:mousedown', event => {
       // Logic here.
 })
```

# useSyncCurrentProject
When the user is editing their autonoma project live, the ``useSyncCurrentProject`` hook ensures that the user is editing the most updated autonoma. This is done to prevent the user from editing a previous save, so that it doesn't create any conflicts within localStorage and the backend data. 

An example of where this was used is in the ``Editor.js`` file. 
```
const loading = useSyncCurrentProject()
```
This was essentially used to load a previously saved project before the user was able to edit anything on it. 

# useSyncProject
Updates autonoma projects in both local storage and backend database to makes sure it is matching. 

This hook retrieves both the autonoma projects in localStorage and in the backend, then compares the projects by their corresponding id. If any of those corresponding matching projects do not match with one another, then it syncs and updates either of the projects to ensure the user is working with the most up to date project.

This hook is used in the index file, by simply calling the method:
```
useSyncProject()
```

# useTransition__
## useTransitionCreation

Similar to the ``useStateCreation``, it uses the actions of mouse clicks with ``useEvent`` and creates a svg transition. Although, the user would need to click and hold and drag the transition into another state and enter a symbol to incorporate a tranisition if it was between two states. 

The transition object and the x and y coordinates for that object are then stored into the ``store``.

## useTransitionSelection

Selects the 'transition' object from the  ``store``. It is also set to be referred to as ``'transition'``. 

For example, it can be used with useEvent:

```
 useEvent('tranisition:mouseup', event => {
       // Logic here.
 })
```
