import "../style/App.css"
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import CreateEntry from "./CreateEntry";
import { useEffect, useState } from "react";
import AllEntries from "./AllEntries";
import CalendarView from "./CalendarView";
import { callApi } from "../api/utils";
import EntryById from "./EntryById";
import Register from "./Register";
import Login from "./Login";

const stringifyCurrentDate = () => {
  let today = new Date();
  let day = `${today.getDate()}`;
  let month = `${today.getMonth() + 1}`;
  let year = `${today.getFullYear()}`;
  if (day.length < 2) {
    day = "0" + day;
  }
  if (month.length < 2) {
    month = "0" + month;
  }

  let currentDateServer = `${year}-${month}-${day}`;
  let currentDateClient = `${day}/${month}/${year}`;

  let currentDateFormatted = {
    currentDateServer,
    currentDateClient,
  };
  return currentDateFormatted;
};

function App() {
  const [currentDate, setCurrentDate] = useState({});
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [allEntries, setAllEntries] = useState([]);
  const navigate = useNavigate();

  const [token, setToken] = useState(
    window.localStorage.getItem("token") || ""
  );
  useEffect(() => {
    window.localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    window.localStorage.setItem("allEntries", JSON.stringify(allEntries));
  }, [allEntries]);

  useEffect(() => {
    const data = window.localStorage.getItem("allEntries");
    if (data) setAllEntries(JSON.parse(data));
  }, []);

  const getAllEntries = async () => {
    try {
      let entries = await callApi({
        path: "/entries",
      });
      entries.map((entry) => {
        entry.start = entry.eventDate;
        entry.end = entry.eventDate;
        return entry;
      });
      setAllEntries(entries);
      return entries;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllEntries();
  }, []);

  useEffect(() => {
    setCurrentDate(stringifyCurrentDate());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("allEntries"); //this doesn't work for some reason
    navigate("/");
    window.location.reload(false);
  };
  return (
    <div className="app">
      <nav className="navbarContainer">
        <div className="logoContainer">
          <h1 className="logo">
            CONFIDANT. <span className="jingle">a shoulder to type on</span>
          </h1>
        </div>
        <ul className="navbar">
          {!token ? (
            <>
              <li>
                <Link className="navbarLinks" to="/register">
                  Register
                </Link>
              </li>
              <li>
                <Link className="navbarLinks" to="/">
                  Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link className="navbarLinks" to="/calendar">
                  Calendar
                </Link>
              </li>
              <li>
                <Link className="navbarLinks" to="/newEntry">
                  Create Entry
                </Link>
              </li>
              <li>
                <Link className="navbarLinks" to="/entries">
                  All Entries
                </Link>
              </li>
              <li>
                <Link
                  className="navbarLinks"
                  to="/login"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </li>
            </>
          )}
          {/* <li>
          <button className="dropbtn">
            Customize
            <i className="fa fa-caret-down"></i>
          </button>
          <div className="dropdown-content">
            <button>Dreamy</button>
            <button>Sleek</button>
            <button>Clean</button>
          </div>
            </li> */}
        </ul>
      </nav>
      <Routes>
        <Route
          path="/calendar"
          element={<CalendarView allEntries={allEntries} setDate={setDate} />}
        ></Route>
        <Route
          path="/register"
          element={<Register setToken={setToken} />}
        ></Route>
        <Route path="/" element={<Login setToken={setToken} />}></Route>
        <Route
          path="/newEntry"
          element={
            <CreateEntry
              currentDate={currentDate}
              date={date}
              setDate={setDate}
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              stringifyCurrentDate={stringifyCurrentDate}
              setAllEntries={setAllEntries}
              allEntries={allEntries}
            />
          }
        ></Route>
        <Route
          path="/entries"
          element={<AllEntries allEntries={allEntries} />}
        ></Route>
        <Route
          path="/entries/entry/:id"
          element={
            <EntryById allEntries={allEntries} setAllEntries={setAllEntries} />
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default App;