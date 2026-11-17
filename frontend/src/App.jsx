
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", course: "" });
  const [editId, setEditId] = useState(null);

  const loadStudents = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setStudents(data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      alert("Operation failed");
      return;
    }

    setForm({ name: "", email: "", course: "" });
    setEditId(null);
    loadStudents();
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course
    });
    setEditId(student.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    const response = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    if (response.ok) loadStudents();
    else alert("Delete failed");
  };

  return (
    <div className="container">
      <header>
        <h1>Student Management System</h1>
        <p>Manage your student records easily</p>
      </header>

      <section className="form-card">
        <h2>{editId ? "Update Student" : "Add New Student"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Student Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Course"
            value={form.course}
            onChange={e => setForm({ ...form, course: e.target.value })}
            required
          />
          <button type="submit">
            {editId ? "Update Student" : "Add Student"}
          </button>
        </form>
      </section>

      <section className="list-card">
        <h2>Students List ({students.length})</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>
                    <button className="edit" onClick={() => handleEdit(student)}>
                      Edit
                    </button>
                    <button className="delete" onClick={() => handleDelete(student.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan="5">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
