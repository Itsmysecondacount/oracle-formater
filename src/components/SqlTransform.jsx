function func1(a, title) {
  let arrayString = a.split(/\s+/);
  let numeroColumnas = arrayString.length;
  let newString = `WITH t_fechas AS
        (select to_date(:P_FECHA_INICIO, 'dd/mm/yyyy hh24:mi:ss') + interval '5' hour P_FECHA_INICIO,
        to_date(:P_FECHA_FIN, 'dd/mm/yyyy hh24:mi:ss') + interval '5' hour P_FECHA_FIN
        from dual)
SELECT
\n`;
  for (let i = 0; i < arrayString.length; i += 30) {
    for (let j = i; j < Math.min(i + 30, arrayString.length); j++) {
      if (arrayString.length - 1 === j) {
        newString +=
          "\t'" +
          arrayString[j] +
          "' " +
          "\n" +
          `\tBLOQUE_${Math.floor(i / 30) + 1}\n\n`;
      } else {
        if (j % 30 === 0 && j != 0) {
          newString +=
            "\t'" +
            arrayString[j] +
            "'" +
            "\n" +
            `\tBLOQUE_${Math.floor(i / 30)}, \n \n \n`;
        } else {
          newString += "\t'" + arrayString[j] + "'" + " || :P_SEPARADOR || \n";
        }
      }
    }
  }

  newString += `FROM dual
UNION ALL \n  
SELECT \n\n`;

  for (let i = 0; i < arrayString.length; i += 30) {
    for (let j = i; j < Math.min(i + 30, arrayString.length); j++) {
      if (arrayString.length - 1 === j) {
        newString +=
          "\t" +
          arrayString[j] +
          "\n" +
          `\tBLOQUE_${Math.floor(i / 30) + 1} \n \n \n`;
      } else {
        if (j % 30 === 0 && j != 0) {
          newString +=
            arrayString[j] + "\n\t" + `BLOQUE_${Math.floor(i / 30)}, \n \n \n`;
        } else {
          newString += "\t" + arrayString[j] + " || :P_SEPARADOR || \n";
        }
      }
    }
  }

  const miniTitle = (title) => {
    const palabras = title.split("_");
    const iniciales = palabras.map((palabra) =>
      palabra.charAt(0).toLowerCase()
    );
    return iniciales.join("");
  };

  const minTitle = miniTitle(title);

  let finalString = `FROM ${title} ${minTitle} 
  WHERE 1 = 1
  AND ((${minTitle}.creation_date BETWEEN
    nvl((select P_FECHA_INICIO from t_fechas), ${minTitle}.creation_date) AND
    nvl((select P_FECHA_FIN from t_fechas), ${minTitle}.creation_date)) OR
    (${minTitle}.last_update_date BETWEEN
    nvl((select P_FECHA_INICIO from t_fechas), ${minTitle}.last_update_date) AND
    nvl((select P_FECHA_FIN from t_fechas), ${minTitle}.last_update_date)))`;
  const textoVuelta = newString + finalString;
  return { textoVuelta, numeroColumnas };
}

export const sqlTransform = (text = "hola", title) => {
  let numeroColumnasFinal = 0;
  if (text === "") {
    text = "SQL Transform";
  } else {
    const { textoVuelta, numeroColumnas } = func1(text, title);
    text = textoVuelta;
    numeroColumnasFinal = numeroColumnas;
  }
  return { text, numeroColumnasFinal };
};
