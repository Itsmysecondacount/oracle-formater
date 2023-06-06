import { useEffect, useRef, useState } from "react";
import "./App.css";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { sqlTransform } from "./components/SqlTransform";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-tomorrow.css";

function App() {
  const [valueInput, setValueInput] = useState("");
  const [valueTitle, setValueTitle] = useState("");
  const [textSql, setTextSql] = useState("");
  const [sql, setSql] = useState(true);
  const [numeroColumnas, setNumeroColumnas] = useState();

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightElement(ref.current);
    }
  }, [textSql]);

  useEffect(() => {
    const { text, numeroColumnasFinal } = sqlTransform(valueInput, valueTitle);
    setTextSql(text);
    setNumeroColumnas(numeroColumnasFinal);
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
            placeholder="Título de la tabla"
            value={valueTitle}
            onChange={(e) => setValueTitle(e.target.value)}
          />
          <textarea
            placeholder="Columnas"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            autoComplete="off"
          ></textarea>
        </div>
        <BsFillArrowDownCircleFill
          onClick={handleSubmit}
          size={35}
          className="arrow"
        />
        <div className="second-container">
          <div className="columnas-number">Columnas: {numeroColumnas}</div>
          <FaRegCopy size={"2rem"} className="copy-clip" onClick={handleCopy} />
          <pre>
            <code ref={ref} className="language-sql">
              {textSql}
            </code>
          </pre>
        </div>
      </div>
    </>
  );
}

export default App;
