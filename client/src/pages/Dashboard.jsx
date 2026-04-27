import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, createTask } from "../services/taskService";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "To Do",
    priority: "Medium",
  });

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    await createTask(form);
    setForm({
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
    });
    fetchTasks();
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
        <button onClick={logout} className="logout-btn">Logout</button>
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
          <h2>My Tasks</h2>

          {tasks.length === 0 ? (
            <div className="empty-state">No tasks added yet.</div>
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
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}