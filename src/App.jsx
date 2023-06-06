import { useEffect, useState } from "react";
import "./App.css";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { sqlTransform } from "./components/SqlTransform";

function App() {
  const [valueInput, setValueInput] = useState("");
  const [valueTitle, setValueTitle] = useState("");
  const [textSql, setTextSql] = useState("");
  const [sql, setSql] = useState(true);
  const [lengthArray, setLengthArray] = useState();

  useEffect(() => {
    const { text } = sqlTransform(valueInput, valueTitle);
    setTextSql(text);
    setLengthArray(length);
  }, [sql]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(valueInput);
    setSql((prev) => !prev);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(textSql);
  };

  return (
    <>
      <h1>Formateador de una tabla Oracle</h1>
      <div className="principal-div">
        <div className="first-container">
          <input
            type="text"
            value={valueTitle}
            onChange={(e) => setValueTitle(e.target.value)}
          />
          <textarea
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            autoComplete="off"
          ></textarea>
        </div>
        <BsFillArrowRightCircleFill
          onClick={handleSubmit}
          size={35}
          className="arrow"
        />
        <div className="second-container">
          <FaRegCopy
            size={"1.5rem"}
            className="copy-clip"
            onClick={handleCopy}
          />
          {textSql}
        </div>
        {length && <h2>length</h2>}
      </div>
    </>
  );
}

export default App;
