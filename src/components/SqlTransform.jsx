function func1(a, title) {
  let arrayString = a.split(/\s+/);
  console.log(arrayString.length);
  let newString = `with t_fechas as
        (select to_date(:P_FECHA_INICIO, 'dd/mm/yyyy hh24:mi:ss') + interval '5' hour P_FECHA_INICIO,
        to_date(:P_FECHA_FIN, 'dd/mm/yyyy hh24:mi:ss') + interval '5' hour P_FECHA_FIN
        from dual)
        select \n
        `;
  for (let i = 0; i < arrayString.length; i += 30) {
    for (let j = i; j < Math.min(i + 30, arrayString.length); j++) {
      if (arrayString.length - 1 === j) {
        newString +=
          "'" +
          arrayString[j] +
          "' " +
          "\n" +
          `BLOQUE_${Math.floor(i / 30) + 1} \n \n \n`;
      } else {
        if (j % 30 === 0 && j != 0) {
          newString +=
            "'" +
            arrayString[j] +
            "'" +
            "\n" +
            `BLOQUE_${Math.floor(i / 30)}, \n \n \n`;
        } else {
          newString += "'" + arrayString[j] + "'" + " || :P_SEPARADOR || \n";
        }
      }
    }
  }

  newString += `from dual \n
  UNION ALL  
  select `;

  for (let i = 0; i < arrayString.length; i += 30) {
    for (let j = i; j < Math.min(i + 30, arrayString.length); j++) {
      if (arrayString.length - 1 === j) {
        newString +=
          arrayString[j] + "\n" + `BLOQUE_${Math.floor(i / 30) + 1} \n \n \n`;
      } else {
        if (j % 30 === 0 && j != 0) {
          newString +=
            arrayString[j] + "\n" + `BLOQUE_${Math.floor(i / 30)}, \n \n \n`;
        } else {
          newString += arrayString[j] + " || :P_SEPARADOR || \n";
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

  let finalString = `from ${title} ${minTitle} 
  where 1 = 1
  and ((${minTitle}.creation_date between
    nvl((select P_FECHA_INICIO from t_fechas), ${minTitle}.creation_date) and
    nvl((select P_FECHA_FIN from t_fechas), ${minTitle}.creation_date)) or
    (${minTitle}.last_update_date between
    nvl((select P_FECHA_INICIO from t_fechas), ${minTitle}.last_update_date) and
    nvl((select P_FECHA_FIN from t_fechas), ${minTitle}.last_update_date)))`;
  return newString + finalString;
}

export const sqlTransform = (text = "hola", title) => {
  if (text === "") {
    text = "SQL Transform";
  } else {
    text = func1(text, title);
  }
  return { text };
};
