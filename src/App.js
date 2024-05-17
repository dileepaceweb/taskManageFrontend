import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getTask");
      if (Array.isArray(response.data.fetchedTask)) {
        setTasks(response.data.fetchedTask);
        setFilteredTasks(response.data.fetchedTask);
      } else {
        console.error("Invalid response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;
  
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task._id === id) {
          return { ...task, [name]: value };
        }
        return task;
      });
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/createTask", newTask);
      setNewTask({ title: "", description: "" });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/deleteTask/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdate = async (id, title, description) => {
    try {
      await axios.put(`http://localhost:5000/updateTask/${id}`, { title, description });
      setEditingTaskId(null); // Reset editing status after update
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleSearch = () => {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleEditClick = (id) => {
    setEditingTaskId(id); // Set editing status when "Edit" button is clicked
  };

  return (
    <div className="container" style={{ textAlign: "center" }}>
      <h1>Task Management</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          required
        />
        <button type="submit">Add Task</button>
      </form>

      <table style={{ margin: "0 auto" }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task._id}>
              <td>
                {editingTaskId === task._id ? (
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={(e) => handleChange(e, task._id)}
                  />
                ) : (
                  task.title
                )}
              </td>
              <td>
                {editingTaskId === task._id ? (
                  <input
                    type="text"
                    name="description"
                    value={task.description}
                    onChange={(e) => handleChange(e, task._id)}
                  />
                ) : (
                  task.description
                )}
              </td>
              <td>
                {editingTaskId === task._id ? (
                  <button onClick={() => handleUpdate(task._id, task.title, task.description)}>Save</button>
                ) : (
                  <button onClick={() => handleEditClick(task._id)}>Edit</button>
                )}
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
