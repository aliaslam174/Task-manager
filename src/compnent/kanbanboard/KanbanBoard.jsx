import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Button, Input } from 'antd';

// Sample initial task data for columns
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Set up project' },
    'task-2': { id: 'task-2', content: 'Design database schema' },
    'task-3': { id: 'task-3', content: 'Develop API endpoints' },
    'task-4': { id: 'task-4', content: 'Test API' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Completed',
      taskIds: ['task-4'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
};

const KanbanBoard = () => {
  const [boardData, setBoardData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = boardData.columns[source.droppableId];
    const endColumn = boardData.columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      });
    } else {
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const endTaskIds = Array.from(endColumn.taskIds);
      endTaskIds.splice(destination.index, 0, draggableId);
      const newEndColumn = {
        ...endColumn,
        taskIds: endTaskIds,
      };

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        },
      });
    }
  };

  return (
    <>
    
    <h2 align="center">Kanban Board</h2>
    <div className="kanban-board">
     
      <DragDropContext onDragEnd={onDragEnd}>
        {boardData.columnOrder.map((columnId) => {
          const column = boardData.columns[columnId];
          const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);

          return (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div
                  className="kanban-column"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ margin: '8px', border: '1px solid lightgrey', borderRadius: '4px', width: '300px', display: 'inline-block' }}
                >
                  <h3 style={{ padding: '8px' }}>{column.title}</h3>
                  <div style={{ padding: '8px' }}>
                    {tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              padding: '16px',
                              marginBottom: '8px',
                              backgroundColor: 'white',
                              borderRadius: '4px',
                              border: '1px solid lightgrey',
                              ...provided.draggableProps.style,
                            }}
                          >
                            <Card>{task.content}</Card>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </DragDropContext>
    </div>
    </>
  );
};

export default KanbanBoard;
