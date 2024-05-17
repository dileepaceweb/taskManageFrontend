import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'; // Importing CSS for styling

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: ""
  });
  const [editTask, setEditTask] = useState({
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

  const handleChange = (e) => {
    console.log(" handle chage id,,,,,,,,,,", editingTaskId);
    const { name, value } = e.target;
    console.log("name:", name);
    console.log("value:", value);
    setEditTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
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

  const handleUpdate = async (id) => {
    try {
      console.log(editTask);
      await axios.put(`http://localhost:5000/updateTask/${id}`, editTask);
      console.log("id:", id);
      console.log("title:", editTask.title);
      console.log("description:", editTask.description);
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

  const handleEditClick = (task) => {

    setEditingTaskId(task._id); // Set editing status when "Edit" button is clicked
    setEditTask({ title: task.title, description: task.description });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Task Management</h1>
      <div>
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
                    value={editTask.title}
                    onChange={handleChange}
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
                    value={editTask.description}
                    onChange={handleChange}
                  />
                ) : (
                  task.description
                )}
              </td>
              <td>
                {editingTaskId === task._id ? (
                  <button onClick={() => handleUpdate(task._id)}>Save</button>
                ) : (
                  <button onClick={() => handleEditClick(task)}>Edit</button>
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
