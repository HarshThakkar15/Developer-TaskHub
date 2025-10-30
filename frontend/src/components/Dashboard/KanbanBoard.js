import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../../api/api';
import TaskModal from './TaskModal';
import ConfirmDialog from '../UI/ConfirmDialog';  
import { toast } from 'react-toastify';           

export default function KanbanBoard({ projects }) {
  const [columns, setColumns] = useState({
    todo: { id: 'todo', title: '📝 To Do', tasks: [] },
    inprogress: { id: 'inprogress', title: '🚧 In Progress', tasks: [] },
    done: { id: 'done', title: '✅ Done', tasks: [] },
  });
  const [project, setProject] = useState(projects?.[0] || null);
  const [taskModal, setTaskModal] = useState({ open: false, mode: 'add', task: null });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, taskId: null });

  useEffect(() => { setProject(projects?.[0] || null); }, [projects]);

  useEffect(() => {
    if (!project?._id) return;
    (async () => {
      try {
        const res = await api.get(`/tasks/${project._id}`);
        const grouped = { todo: [], inprogress: [], done: [] };
        (res.data || []).forEach((t) => {
          const key = ['todo', 'inprogress', 'done'].includes(t.status)
            ? t.status
            : 'todo';
          grouped[key].push(t);
        });
        setColumns({
          todo: { id: 'todo', title: '📝 To Do', tasks: grouped.todo },
          inprogress: { id: 'inprogress', title: '🚧 In Progress', tasks: grouped.inprogress },
          done: { id: 'done', title: '✅ Done', tasks: grouped.done },
        });
      } catch (err) {
        console.error(err);
      }
    })();
  }, [project?._id]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index)
      return;

    const updated = JSON.parse(JSON.stringify(columns));
    const [moved] = updated[source.droppableId].tasks.splice(source.index, 1);
    moved.status = destination.droppableId;
    updated[destination.droppableId].tasks.splice(destination.index, 0, moved);
    setColumns(updated);

    try {
      await api.put(`/tasks/${moved._id}`, { status: moved.status });
    } catch (err) {
      console.error('Task update failed', err);
    }
  };

  const openAdd = () => setTaskModal({ open: true, mode: 'add', task: null });
  const openEdit = (task) => setTaskModal({ open: true, mode: 'edit', task });

  const handleTaskSaved = (task) => {
    setColumns((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      Object.values(copy).forEach((c) => {
        c.tasks = c.tasks.filter((t) => t._id !== task._id);
      });
      copy[task.status].tasks.push(task);
      return copy;
    });
    setTaskModal({ open: false, mode: 'add', task: null });
  };

  const handleTaskDeleted = (id) => {
    setColumns((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      Object.values(copy).forEach((c) => {
        c.tasks = c.tasks.filter((t) => t._id !== id);
      });
      return copy;
    });
    setTaskModal({ open: false, mode: 'add', task: null });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button className="button" onClick={openAdd}>+ Add Task</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban" style={{ overflowX: 'auto', display: 'flex', gap: 12, alignItems: 'flex-start',
  flexWrap: 'wrap' }}>
          {Object.values(columns).map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided) => (
                <div className="kanban-column card" ref={provided.innerRef} {...provided.droppableProps} style={{ width: 320, minHeight: 120 }}>
                  <h4>{col.title}</h4>
                  {(col.tasks || []).map((task, idx) => (
                    <Draggable key={task._id} draggableId={task._id} index={idx}>
                      {(p) => (
                        <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} className="task" style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong title={task.description || ''}>{task.title}</strong>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="button" onClick={() => openEdit(task)}>Edit</button>
                              <button
                                className="button"
                                onClick={() => setConfirmDelete({ open: true, taskId: task._id })}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          {task.description && (
                            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>
                              {task.description.length > 120
                                ? task.description.slice(0, 120) + '...'
                                : task.description}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {taskModal.open && (
        <TaskModal
          mode={taskModal.mode}
          projectId={project._id}
          task={taskModal.task}
          onClose={() => setTaskModal({ open: false })}
          onSaved={handleTaskSaved}
          onDeleted={handleTaskDeleted}
        />
      )}

      {confirmDelete.open && (
        <ConfirmDialog
          message="Are you sure you want to delete this task?"
          onConfirm={async () => {
            try {
              await api.delete(`/tasks/${confirmDelete.taskId}`);
              handleTaskDeleted(confirmDelete.taskId);
              toast.success('Task deleted');
            } catch (err) {
              console.error(err);
              toast.error('Failed to delete task');
            } finally {
              setConfirmDelete({ open: false, taskId: null });
            }
          }}
          onCancel={() => setConfirmDelete({ open: false, taskId: null })}
        />
      )}
    </div>
  );
}