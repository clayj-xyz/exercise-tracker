const invoke = window.__TAURI__.core.invoke;

function defaultLiftParser(session) {
  const table = document.createElement("table");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Exercise", "Sets", "Reps"].forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  session.exercises.forEach(exercise => {
    if (exercise.exercises) {
      // Handle circuits
      const circuitRow = document.createElement("tr");
      const circuitCell = document.createElement("td");
      circuitCell.colSpan = 3;
      circuitCell.textContent = exercise.name;
      circuitRow.appendChild(circuitCell);
      tbody.appendChild(circuitRow);

      exercise.exercises.forEach(subExercise => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${subExercise.name}</td>
          <td>-</td>
          <td>${subExercise.reps}</td>
        `;
        tbody.appendChild(row);
      });
    } else {
      // Handle regular exercises
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${exercise.name}</td>
        <td>${exercise.sets || "-"}</td>
        <td>${exercise.reps || "-"}</td>
      `;
      tbody.appendChild(row);
    }
  });

  table.appendChild(tbody);
  return table;
}

function defaultCardioParser(session) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const columns = ["Exercise"];

  // Determine which keys are present in the data
  if (session.exercises.some(exercise => exercise.distance)) {
    columns.push("Distance");
  }
  if (session.exercises.some(exercise => exercise.time)) {
    columns.push("Time");
  }
  if (columns.length === 1) {
    throw new Error("Cardio data must have either 'distance' or 'time' keys.");
  }

  columns.forEach(headerText => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  session.exercises.forEach(exercise => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = exercise.name;
    row.appendChild(nameCell);

    if (columns.includes("Distance")) {
      const distanceCell = document.createElement("td");
      distanceCell.textContent = exercise.distance ? `${exercise.distance} ${exercise.units || ""}` : "-";
      row.appendChild(distanceCell);
    }

    if (columns.includes("Time")) {
      const timeCell = document.createElement("td");
      timeCell.textContent = exercise.time ? `${exercise.time} ${exercise.units || ""}` : "-";
      row.appendChild(timeCell);
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  return table;
}

function buildSessionDisplay(session) {
  const sessionElement = document.createElement("div");
  sessionElement.classList.add("session");

  if (session.parser === "default_lift") {
    sessionElement.appendChild(defaultLiftParser(session));
  } else if (session.parser === "default_cardio") {
    sessionElement.appendChild(defaultCardioParser(session));
  }

  return sessionElement;
}

window.addEventListener("DOMContentLoaded", async () => {
  const scheduleContainer = document.getElementById("schedule");

  // Fetch the program data using Tauri command
  const program = await invoke("read_program").then(JSON.parse);

  const name = program.name;
  const nameElement = document.getElementById("program-name");
  nameElement.textContent = name;

  // Render the schedule
  const week = program.schedule[0]; // Assuming only one week for now
  week.days.forEach((day, index) => {
    const sessionName = day.session;
    const session = program.sessions.find(s => s.name === sessionName);
    if (!session) {
      return;
    }

    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    const dayHeader = document.createElement("div");
    dayHeader.classList.add("day-header");
    const dayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index];
    dayHeader.textContent = `${dayName} - ${session.name}`;
    dayHeader.appendChild(document.createElement("hr"));
    dayElement.appendChild(dayHeader);

    const sessionElement = buildSessionDisplay(session);
    dayElement.appendChild(sessionElement);

    scheduleContainer.appendChild(dayElement);
  });
});
