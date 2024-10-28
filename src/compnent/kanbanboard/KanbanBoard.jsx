import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Button, Input, Form, DatePicker, notification, Select, Modal, Spin } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import dell from "../../image/dell.svg"
import line from "../../image/line.svg"
import sub from "../../image/sub.svg"
import useProjects from '../customehookapi/useProjects';
import Singleproject from './Singleproject';
import Comments from '../comment/Comments ';
// Sample initial task data for columns
const KanbanBoard = ({ selectedProjectId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskModal, setTaskModal] = useState(false);
  const [taskData, setTaskData] = useState("");
  const [isSubtaskModalVisible, setIsSubtaskModalVisible] = useState(false);
  const [parentTaskId, setParentTaskId] = useState(null);
  const [subtasks, setSubtasks] = useState([]); // State to hold subtasks
  const [tasskid,setTaskId]=useState([])
  const { user, role } = useSelector((state) => state.auth);
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
        title: 'testing',
        taskIds: [],
      },
      'column-4': {
        id: 'column-4',
        title: 'hold',
        taskIds: [],
      },
      'column-5': {
        id: 'column-5',
        title: 'completed',
        taskIds: [],
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
  };

  const [boardData, setBoardData] = useState(initialData);
  const [parentid, setParentId] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  console.log(boardData)
  // Function to show the modal



  const showModal = (subtask) => {

    // addSubtask(subtask)
    setIsModalVisible(true);
  };

  // Function to handle modal cancellation
  const handleCancel = () => {
    setIsModalVisible(false);
    setTaskModal(false)

    form.resetFields(); // Reset form fields when modal is closed
  };

  const cancelTaskModal = () => {
    setIsModalVisible(false);
    setIsSubtaskModalVisible(false)
    setTaskModal(false)
    form.resetFields();
  };

  const openTaskModal = (content) => {
    console.log("taskcontent", content)
    setTaskId(content.id)
    setTaskData(content);
    setTaskModal(true)
    setTaskModal(true);
  };
  // Fetch tasks by project

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedTasks = response.data.data;
      console.log(fetchedTasks)
      const newTasks = {};
      const newColumns = {
        'column-1': { id: 'column-1', title: 'ToDo', taskIds: [] },
        'column-2': { id: 'column-2', title: 'InProgress', taskIds: [] },
        'column-3': { id: 'column-3', title: 'testing', taskIds: [] },
        'column-4': { id: 'column-4', title: 'hold', taskIds: [] },
        'column-5': { id: 'column-5', title: 'completed', taskIds: [] },
      };

      fetchedTasks.forEach((task) => {
        const taskId = `task-${task.id}`;
        newTasks[taskId] = {
          id: taskId,
          content: task.name,
          des: task.description,
          due_date: task.due_date,
        };

        // Assign task to the appropriate column based on its status
        switch (task.status) {
          case 'todo':
            newColumns['column-1'].taskIds.push(taskId);
            break;
          case 'in-progress':
            newColumns['column-2'].taskIds.push(taskId);
            break;
          case 'testing':
            newColumns['column-3'].taskIds.push(taskId);
            break;
          case 'hold':
            newColumns['column-4'].taskIds.push(taskId);
            break;
          case 'completed':
            newColumns['column-5'].taskIds.push(taskId);
            break;
          default:
            break;
        }
      });

      setBoardData({
        tasks: newTasks,
        columns: newColumns,
        columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
      notification.error({ message: 'Failed to fetch tasks!' });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {


    fetchTasks();
  }, [selectedProjectId, token]);
  // Function to handle task addition
  const addTask = async (values) => {
    console.log(values)
    const { name, description, due_date, status } = values; // Assume parent_id comes from the form
    // const status = 'todo'; // Default status

    setLoading(true);

    try {
      // Prepare the data to be sent
      const taskData = {
        name,
        description,
        due_date,
        status
      };

      // Make a POST request to add a new task
      const response = await axios.post(
        `https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,  // Add token to Authorization header
          },
        }
      );

      const newTask = response.data.data; // Assuming the new task details are in the response
      fetchTasks();
      // Add new task to the board data
      setBoardData((prevData) => {
        const newTaskId = `task-${newTask.id}`;
        return {
          ...prevData,
          tasks: {
            ...prevData.tasks,
            [newTaskId]: { id: newTaskId, content: newTask.name },
          },
          columns: {
            ...prevData.columns,
            'column-1': {
              ...prevData.columns['column-1'],
              taskIds: [...prevData.columns['column-1'].taskIds, newTaskId],
            },
          },
        };
      });



      notification.success({ message: 'Task added successfully!' });
      handleCancel(); // Close the modal after successful submission
    } catch (error) {
      notification.error({ message: 'Failed to add task!' });
    } finally {
      setLoading(false);
    }
  };
  const deleteTask = async (taskId) => {

console.log(taskId)
    const taskRealId = taskId.split('-')[1]; // Extract the real task ID if needed
    console.log(taskRealId)

    try {
      await axios.delete(
        `https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task/${taskRealId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the task from the board data after successful deletion
      setBoardData((prevData) => {
        const { [taskId]: removedTask, ...remainingTasks } = prevData.tasks;

        // Remove task from columns
        const newColumns = { ...prevData.columns };
        Object.keys(newColumns).forEach((columnId) => {
          newColumns[columnId].taskIds = newColumns[columnId].taskIds.filter(id => id !== taskId);
        });

        return {
          ...prevData,
          tasks: remainingTasks,
          columns: newColumns,
        };
      });

      notification.success({ message: 'Task deleted successfully!' });
    } catch (error) {
      console.error("Error deleting task:", error);
      notification.error({ message: 'Failed to delete task!' });
    }
  };


  const addSubtask = async (values) => {
    if (!parentTaskId) {
      notification.error({ message: 'Parent task ID is not set!' });
      return;
    }
    console.log(parentTaskId)
    const realTaskId = parentTaskId.id.split('-')[1]; // Extract real task ID
    const { name, description, due_date } = values;


    const subtaskData = {
      name,
      description,
      due_date,
      status: "todo", // Default status for subtask
      parent_id: realTaskId,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task`,
        subtaskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newSubtask = response.data.data;
      console.log(newSubtask)

      fetchTasks(newSubtask);
      const newSubtaskId = `subtask-${newSubtask.id}`;

      setBoardData((prevData) => {
        const updatedTask = {
          ...prevData.tasks[parentTaskId],
          subtasks: [...(prevData.tasks[parentTaskId].newSubtask || []), { id: newSubtaskId, content: newSubtask.name }],
        };

        return {
          ...prevData,
          tasks: {
            ...prevData.tasks,
            [parentTaskId]: updatedTask,
          },
        };
      });

      notification.success({ message: 'Subtask added successfully!' });
      handleCancel(); // Close the modal after successful submission
    } catch (error) {
      console.error('Error adding subtask:', error);
      notification.error({ message: 'Failed to add subtask!' });
    } finally {
      setLoading(false);
    }
  };

  // Function to show the subtask modal and set the parent task ID
  // Show subtask modal
  const showSubtaskModal = (task) => {
    console.log(task)
    if (task) {
      setParentTaskId(task);
      setSubtasks(task?.subtasks || []); // Set existing subtasks for the task
      setIsSubtaskModalVisible(true);
    } else {
      console.error('Task is undefined or does not have an ID');
    }
  };



  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    // If the task is dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = boardData.columns[source.droppableId];
    const endColumn = boardData.columns[destination.droppableId];

    // Get the current task from the tasks object
    const movedTask = boardData.tasks[draggableId];

    // Determine the new status based on the column ID
    let newStatus;
    if (endColumn.id === 'column-1') {
      newStatus = 'todo';
    } else if (endColumn.id === 'column-2') {
      newStatus = 'in-progress';
    }
    else if (endColumn.id === 'column-3') {
      newStatus = 'testing';
    }
    else if (endColumn.id === 'column-4') {
      newStatus = 'hold';
    } else if (endColumn.id === 'column-5') {
      newStatus = 'completed';
    }
    console.log(startColumn)
    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      console.log(newTaskIds)
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
      console.log(newStatus)
      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newStartColumn.id]: newStartColumn,
          [newEndColumn.id]: newEndColumn,
        },
      });

      const taskId = movedTask.id.split('-')[1];

      // Update the task's status on the server using the correct API endpoint

      console.log(movedTask)
      try {

        // Prepare the updated task data
        const updatedTaskData = {
          name: movedTask.content, // Assuming content is the task name
          description: movedTask.des, // Ensure you have a description in movedTask
          due_date: movedTask.due_date, // Set the due date if applicable, otherwise send null
          status: newStatus
        };
        const update = await axios.put(
          `https://task-manager.codionslab.com/api/v1/project/${selectedProjectId.id}/task/${taskId}`,
          updatedTaskData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const statusupdate = update.data.data.status;
        if (statusupdate === 'todo') {
          notification.success({
            message: 'Task is in "To Do" status!',
            duration: 1, // Notification stays for 5 seconds
          });
        } else if (statusupdate === 'in-progress') {
          notification.success({
            message: 'Task status updated to "In Progress"!',
            duration: 1, // Stays for 3 seconds
          });
        }
        else if (statusupdate === 'hold') {
          notification.success({
            message: 'Task status updated to "In Hold"!',
            duration: 1, // Stays for 3 seconds
          });
        } else if (statusupdate === 'testing') {

          notification.success({
            message: 'Task status updated to "Testing"!',
            duration: 1, // Stays for 10 seconds
          });
        }
        else if (statusupdate === 'completed') {

          notification.success({
            message: 'Task status updated to "Complete"!',
            duration: 1, // Stays for 10 seconds
          });
        } else {
          notification.warning({
            message: 'Unknown status!',
            duration: 5, // Stays for 7 seconds
          });
        }

      } catch (error) {
        console.error("Error updating task status:", error);
        notification.error({ message: 'Failed to update task status!' });
      }
    }
  };

  return (
    <>
  

      {
        role === 'admin' && (
          <>
           <Singleproject selectedProjectId={selectedProjectId} />
           <Button type="primary" onClick={showModal} style={{ marginBottom: '16px' }}>
        Add Task
      </Button>
          </>
         
          
        )
      }
     

     
      {/* New Task Modal */}
      <Modal title="Add a new task" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} onFinish={addTask}>
          <Form.Item name="name" label="Task Name" rules={[{ required: true, message: 'Please input the task name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="due_date" label="Due Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Status" initialValue="todo">
            <Select>
              <Select.Option value="todo">To Do</Select.Option>
              <Select.Option value="in-progress">In Progress</Select.Option>
              <Select.Option value="testing">testing</Select.Option>
              <Select.Option value="hold">hold</Select.Option>
              <Select.Option value="completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>

            <Button type="primary" htmlType="submit" loading={loading}>
              Add Task
            </Button>
          </Form.Item>
        </Form>
      </Modal>


      {/* New sub Task Modal */}
      {/* Subtask Modal */}
      <Modal title="Subtasks" visible={isSubtaskModalVisible} onCancel={cancelTaskModal} footer={null}>
        <h3>Existing Subtasks:</h3>
        <ul>
          {subtasks.map(subtask => (
            <li key={subtask.id}>{subtask.content}</li> // Assuming subtask has content field
          ))}
        </ul>
        <Form form={form} onFinish={addSubtask}>
          <Form.Item name="name" label="Subtask Name" rules={[{ required: true, message: 'Please input the subtask name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="due_date" label="Due Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Add Subtask
            </Button>
          </Form.Item>
        </Form>
      </Modal>



      {/* taskdetail modal */}
      <div className='bg-gray-400'>
        <Modal className="custom-modal" open={taskModal} onCancel={handleCancel} footer={null}>
          <div className='grid grid-cols-2'>
            <div className=''>  <h1 className='text-xl font-bold'>Task Name: {taskData.content}</h1>
              <h1 className='text-xl font-medium mt-5 text-gray-500'>Description</h1>
              <p>{taskData.des}</p>
              <div className='subtask'>
                <h2 className='font-bold '>SubTask</h2>
                <Button className='my-5' onClick={() => { showModal(taskData) }}>Add</Button>
              </div>
            </div>


           

          </div>
          <div className=''>
              <h1 className='text-xl font-bold'>Comment</h1>

              <Comments taskData={taskData} tasskid={tasskid}  selectedProjectId={selectedProjectId} />
            </div>
        </Modal>
      </div>


      {/* Kanban Board */}

      {
      loading ? (
        <Spin size='large' />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex' }}>
            {boardData.columnOrder.map((columnId) => {
              const column = boardData.columns[columnId];
              const tasks = column.taskIds.map((taskId) => boardData.tasks[taskId]);
      
              return (
                <Droppable key={column.id} droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        border: '1px solid lightgrey',
                        borderRadius: '10px',
                        width: '300px',
                        margin: '8px',
                        padding: '16px',
                        background: 'transparent',
                        overflowY: 'auto', // Enable vertical scrolling
                        maxHeight: '400px', // Set a max height to enable scrolling
                      }}
                    >
                      <h3>{column.title}</h3>
                      <div > {/* Inner div for scrolling */}
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: 'none',
                                  padding: '6px',
                                  margin: '0 0 8px 0',
                                  minHeight: '50px',
                                  background: 'white',
                                  border: '1px solid lightgrey',
                                  borderRadius: '10px',
                                  color: 'black',
                                  cursor: "pointer",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                {task.content}
                                <div className='flex justify-around mt-10'>
                                  {role === "admin" ? (
                                    <>
                                      <div className='test-end'><img width="15px" onClick={() => { deleteTask(task.id) }} src={dell} alt="" /></div>
                                      <div className='test-end'><img width="15px" onClick={() => { showSubtaskModal(task) }} src={sub} alt="" /></div>
                                    </>
                                  ) : null}
      
                                  <div><img width="15px" onClick={() => openTaskModal(task)} src={line} alt="" /></div>
                                </div>
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
          </div>
        </DragDropContext>
      )
      
      }
      
    </>
  );
};

export default KanbanBoard;
