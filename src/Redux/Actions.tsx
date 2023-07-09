import { ADD, CHECK, DEL, EDIT, INPUT, MOVE_TASK, REORDER_TASKS } from './ActionTypes';

export interface Task {
  id: number;
  task: string;
  status: string;
}

export const input = (val: string) => {
  return {
    type: INPUT as typeof INPUT,
    payload: val,
  };
};

export const add = () => {
  return {
    type: ADD as typeof ADD,
  };
};

export const del = (id: number) => {
  return {
    type: DEL as typeof DEL,
    payload: id,
  };
};

export const check = (id: number) => {
  return {
    type: CHECK as typeof CHECK,
    payload: id,
  };
};

export const edit = (id: number) => {
  return {
    type: EDIT as typeof EDIT,
    payload: id,
  };
};

export const moveTask = (
  sourceTasks: Task[],
  destinationTasks: Task[],
  sourceDroppableId: string,
  destinationDroppableId: string
) => {
  return {
    type: MOVE_TASK as typeof MOVE_TASK,
    payload: {
      sourceTasks,
      destinationTasks,
      sourceDroppableId,
      destinationDroppableId,
    },
  };
};

export const reorderTasks = (
  startIndex: number,
  endIndex: number,
  droppableId: string
) => {
  return {
    type: REORDER_TASKS as typeof REORDER_TASKS,
    payload: {
      startIndex,
      endIndex,
      droppableId,
    },
  };
};
