import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/taskService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
  });

  const [editForm, setEditForm] = useState({
    description: "",
    status: "To Do",
  });

  const fetchTasks = async () => {
    try {
      const data = await getTasks(filters);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      await createTask(form);

      setForm({
        title: "",
        description: "",
        status: "To Do",
        priority: "Medium",
      });

      fetchTasks();
    } catch (error) {
      alert("Failed to add task");
      console.error(error);
    }
  };

  const handleEdit = (task) => {
    setSelectedTask(task);

    setEditForm({
      description: task.description || "",
      status: task.status,
    });
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateTask(selectedTask._id, {
        title: selectedTask.title,
        priority: selectedTask.priority,
        description: editForm.description,
        status: editForm.status,
      });

      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      alert("Failed to update task");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      alert("Failed to delete task");
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>Personal Task Board</h1>
          <p>Manage your daily work in one place</p>
        </div>

        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="task-form-card">
          <h2>Add New Task</h2>

          <form onSubmit={handleAdd}>
            <input
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Task description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>

            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button type="submit">Add Task</button>
          </form>
        </div>

        <div className="task-list-section">
          <div className="task-list-header">
            <h2>My Tasks</h2>

            <div className="filter-panel">
              <p>Filter Tasks</p>

              <div className="filter-buttons">
                {["", "To Do", "In Progress", "Done"].map((status) => (
                  <button
                    key={status || "all-status"}
                    className={
                      filters.status === status
                        ? "filter-chip active"
                        : "filter-chip"
                    }
                    onClick={() => setFilters({ ...filters, status })}
                  >
                    {status || "All Status"}
                  </button>
                ))}
              </div>

              <div className="filter-buttons">
                {["", "Low", "Medium", "High"].map((priority) => (
                  <button
                    key={priority || "all-priority"}
                    className={
                      filters.priority === priority
                        ? "filter-chip active"
                        : "filter-chip"
                    }
                    onClick={() => setFilters({ ...filters, priority })}
                  >
                    {priority || "All Priority"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">No tasks found.</div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div className="task-card" key={task._id}>
                  <div className="task-card-top">
                    <h3>{task.title}</h3>

                    <span className={`priority ${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </div>

                  <p>{task.description || "No description added."}</p>

                  <div className="task-footer">
                    <span>{task.status}</span>
                    <span>
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <div className="task-actions">
                    <button onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>

                    <button onClick={() => handleEdit(task)}>Update</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedTask && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Update Task</h2>
            <p className="modal-task-title">{selectedTask.title}</p>

            <form onSubmit={handleSaveUpdate}>
              <textarea
                placeholder="Update description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />

              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Done</option>
              </select>

              <div className="modal-actions">
                <button type="button" onClick={() => setSelectedTask(null)}>
                  Cancel
                </button>

                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}