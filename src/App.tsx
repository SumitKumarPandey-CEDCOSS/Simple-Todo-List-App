import React, { useEffect } from 'react'
import './index.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  add,
  check,
  del,
  edit,
  input,
  moveTask,
  reorderTasks
} from './Redux/Actions'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from 'react-beautiful-dnd'

interface Task {
  id: number
  task: string
  status: string
}

const App: React.FC = () => {
  const dispatch = useDispatch()
  const state = useSelector((state: any) => state)
  console.log(state, 'state')

  useEffect(() => {
    Aos.init({ duration: 2000 })
  }, [])

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      // Reorder tasks within the same list
      const tasks = Array.from(state.tasks)
      const [reorderedTask] = tasks.splice(source.index, 1)
      tasks.splice(destination.index, 0, reorderedTask)
      dispatch(
        reorderTasks(source.index, destination.index, source.droppableId)
      )
    } else {
      // Move tasks between lists
      const sourceTasks = Array.from(
        state.tasks.filter((item: Task) => item.status === source.droppableId)
      ) as Task[]
      const destinationTasks = Array.from(
        state.tasks.filter(
          (item: Task) => item.status === destination.droppableId
        )
      ) as Task[]
      const [movedTask] = sourceTasks.splice(source.index, 1)
      destinationTasks.splice(destination.index, 0, movedTask)
      dispatch(
        moveTask(
          sourceTasks,
          destinationTasks,
          source.droppableId,
          destination.droppableId
        )
      )
    }
  }

  return (
    <>
      <div className='container' data-aos='zoom-in'>
        <div className='bg'></div>
      </div>
      <div className='todoBox'>
        <h1>Simple Todo List App</h1>
        <input
          data-aos='fade-right'
          className='inputbox'
          name='title'
          type='text'
          value={state.inpt}
          onChange={e => dispatch(input(e.target.value))}
          autoFocus
        />
        {state.tag === 'Add' ? (
          <i
            id='add'
            className='fa-solid fa-plus add'
            onClick={() => dispatch(add())}
          ></i>
        ) : (
          <i
            className='fa-solid fa-pen-to-square add'
            onClick={() => dispatch(add())}
          ></i>
        )}

        <div
          // data-aos='fade-left'
          className='content'
          style={{ marginTop: '15px', wordBreak: 'break-word' }}
        >
          <h3>Incomplete</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='not-completed'>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {state.tasks.some(
                    (item: Task) => item.status === 'not-completed'
                  ) ? (
                    state.tasks
                      .filter((item: Task) => item.status === 'not-completed')
                      .reverse()
                      .map((item: Task, index: number) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {provided => (
                            <div
                              className='list'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <input
                                type='checkbox'
                                onClick={() => dispatch(check(item.id))}
                              />
                              <p>{item.task}</p>
                              <div>
                                <i
                                  style={{
                                    color: '#50c870',
                                    padding: '3px',
                                    cursor: 'pointer'
                                  }}
                                  className='fa-solid fa-pen-to-square fa-lg'
                                  onClick={() => dispatch(edit(item.id))}
                                ></i>
                                <i
                                  style={{
                                    color: '#df3c3c',
                                    padding: '3px',
                                    cursor: 'pointer'
                                  }}
                                  className='fa-solid fa-trash-can fa-lg'
                                  onClick={() => dispatch(del(item.id))}
                                ></i>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                  ) : (
                    <p style={{ padding: '0 10px 0 10px' }}>
                      Todo list is empty now
                    </p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <h3>Complete</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='completed'>
              {provided => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {state.tasks.some(
                    (item: Task) => item.status === 'completed'
                  ) ? (
                    state.tasks
                      .filter((item: Task) => item.status === 'completed')
                      .map((item: Task, index: number) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                        >
                          {provided => (
                            <div
                              className='list'
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <input
                                type='checkbox'
                                checked
                                onClick={() => dispatch(check(item.id))}
                              />
                              <p>
                                {' '}
                                <s>{item.task}</s>
                              </p>
                              <div>
                                <i
                                  style={{
                                    color: '#df3c3c',
                                    padding: '3px',
                                    cursor: 'pointer'
                                  }}
                                  className='fa-solid fa-trash-can fa-lg'
                                  onClick={() => dispatch(del(item.id))}
                                ></i>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                  ) : (
                    <p style={{ padding: '0 10px 0 10px' }}>
                      Completed tasks list is empty right now
                    </p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <hr />
          <div
            style={{ display: 'flex', justifyContent: 'end', padding: '10px' }}
          >
            <p>Total Tasks: {state.tasks.length}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
