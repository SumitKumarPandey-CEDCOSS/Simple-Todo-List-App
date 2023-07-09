import { ADD, CHECK, DEL, EDIT, INPUT, MOVE_TASK, REORDER_TASKS } from './ActionTypes';

export interface Task {
  id: number;
  task: string;
  status: string;
}

export interface State {
  inpt: string;
  tasks: Task[];
  tag: string;
  id: number;
  itemsAdded: number;
}

const initialState: State = {
  inpt: '',
  tasks: [],
  tag: 'Add',
  id: -1,
  itemsAdded: 0,
};

export const taskReducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case INPUT:
      return {
        ...state,
        inpt: action.payload,
      };
    case ADD:
      let indx = state.tasks.findIndex((item) => item.id === state.id);
      if (state.inpt === '') {
        alert('Do leave the input field blank');
        return { ...state };
      }
      if (indx > -1) {
        state.tasks.splice(indx, 1, {
          id: state.id,
          task: state.inpt,
          status: 'not-completed',
        });
        return { ...state, tag: 'Add', inpt: '', id: -1 };
      }
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: state.itemsAdded, task: state.inpt, status: 'not-completed' },
        ],
        inpt: '',
        tag: 'Add',
        itemsAdded: state.itemsAdded + 1,
      };
    case DEL:
      return {
        ...state,
        tasks: [...state.tasks.filter((item) => item.id !== action.payload)],
      };
    case CHECK:
      return {
        ...state,
        tasks: state.tasks.map((item) =>
          item.id === action.payload
            ? { ...item, status: item.status === 'not-completed' ? 'completed' : 'not-completed' }
            : item
        ),
      };
    case EDIT:
      return {
        ...state,
        inpt: state.tasks.find((item) => item.id === action.payload)?.task ?? '',
        tag: 'Update',
        id: action.payload,
      };
    case MOVE_TASK:
      return moveTaskReducer(state, action.payload);
    case REORDER_TASKS:
      return reorderTasksReducer(state, action.payload);
    default:
      return state;
  }
};

const moveTaskReducer = (state: State, payload: any) => {
  const { sourceTasks, destinationTasks, sourceDroppableId, destinationDroppableId } = payload;

  const [removed] = sourceTasks.splice(0, 1);
  destinationTasks.splice(0, 0, removed);

  return {
    ...state,
    tasks: state.tasks.map((item) => {
      if (item.status === sourceDroppableId) {
        return sourceTasks.shift();
      }
      if (item.status === destinationDroppableId) {
        return destinationTasks.shift();
      }
      return item;
    }),
  };
};

const reorderTasksReducer = (state: State, payload: any) => {
  const { startIndex, endIndex, droppableId } = payload;
  const tasks = state.tasks.filter((item) => item.status === droppableId);

  const [removed] = tasks.splice(startIndex, 1);
  tasks.splice(endIndex, 0, removed);

  return {
    ...state,
    tasks: state.tasks.map((item) => {
      if (item.status === droppableId) {
        return tasks.shift();
      }
      return item;
    }),
  };
};
