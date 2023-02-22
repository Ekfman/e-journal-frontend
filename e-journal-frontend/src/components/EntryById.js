import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../api/utils";

const EntryById = ({ setAllEntries, allEntries }) => {
  const [renderEntry, setRenderEntry] = useState({});
  const [editEntryButton, setEditEntryButton] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const createdDateDisplay = () => {
    const formatDate = new Date(`${renderEntry.createDate}`);
    let year = `${formatDate.getFullYear()}`;
    let month = `${formatDate.getMonth() + 1}`;
    let day = `${formatDate.getDate()}`;

    const displayDate = `${month}/${day}/${year}`;
    return displayDate;
  };
  const createEventDateDisplay = () => {
    const formatDate = new Date(`${renderEntry.eventDate}`);
    let year = `${formatDate.getFullYear()}`;
    let month = `${formatDate.getMonth() + 1}`;
    let day = `${formatDate.getDate()}`;

    const displayDate = `${month}/${day}/${year}`;
    return displayDate;
  };
  const fetchEntryById = async () => {
    try {
      const result = await callApi({
        path: `/entries/${id}`,
      });
      setRenderEntry(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEntryById();
  }, []);

  const [date, setDate] = useState("");
  const [title, setTitle] = useState(renderEntry.title);
  const [content, setContent] = useState(renderEntry.content);
  //need to figure out why these initial states are not saving

  const handleCancel = () => {
    setEditEntryButton((prev) => !prev);
    navigate(`/entries/entry/${id}`);
  };

  const formatDate = () => {
    const date = new Date(`${renderEntry.eventDate}`);
    let year = `${date.getFullYear()}`;
    let month = `${date.getMonth() + 1}`;
    let day = `${date.getDate()}`;
    if (day.length < 2) {
      day = "0" + day;
    }
    if (month.length < 2) {
      month = "0" + month;
    }
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  useEffect(() => {
    setDate(formatDate());
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await callApi({
        method: "PATCH",
        path: `/entries/${id}`,
        body: { eventDate: date, title, content },
      });
      if (result) window.alert("Your edits have been saved.");
      navigate(`/entries/entry/${id}`);
      window.location.reload(false);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async ({ id }) => {
    let prompt = window.confirm(
      "Are you sure you want to delete this entry? This cannot be undone."
    );
    if (prompt) {
      try {
        const result = await callApi({
          method: "DELETE",
          path: `/entries/${id}`,
        });
        setAllEntries((prev) => prev.filter((e) => e.id !== id));
        navigate("/entries");
        if (result) window.alert("You entry has been successfully deleted.");
        window.location.reload(false);
        return allEntries;
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    setDate(e.target.value);
  };

  return (
    <div className="container">
      <div className="singleEntryContainer">
        {!editEntryButton ? (
          <>
            <div className="allEntryContent">
              <h2 className="entryTitle">{renderEntry.title}</h2>
              <p>{createEventDateDisplay()}</p>
              <p>{renderEntry.content}</p>
            </div>
            <div className="buttons">
              <button onClick={() => navigate("/entries")}>
                View All Entries
              </button>
              <div className="editDeleteBut">
                <button onClick={() => setEditEntryButton((prev) => !prev)}>
                  Edit
                </button>
                <button onClick={() => deleteHandler({ id })}>Delete</button>
              </div>
            </div>
            <p className="createDate">Created on {createdDateDisplay()}</p>
          </>
        ) : (
          <>
            <form className="form-container">
              <input
                className="date"
                type="date"
                defaultValue={formatDate()}
                onChange={handleChange}
              />
              <br></br>
              <input
                className="title"
                defaultValue={renderEntry.title}
                onChange={(e) => setTitle(e.target.value)}
              ></input>
              <br></br>
              <textarea
                className="content"
                rows="5"
                cols="60"
                type="text"
                defaultValue={renderEntry.content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </form>
            <div className="cancelSubmitButtons">
              <button onClick={handleCancel}>Cancel</button>
              <button onClick={onSubmit} type="submit">
                Submit Edits
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EntryById;