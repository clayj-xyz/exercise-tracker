import ProgramName from "./components/ProgramName";
import Variables from "./components/Variables";
import Schedule from "./components/Schedule";
import "./App.css";

function App() {
  return (
    <main class="container">
      <ProgramName />
      <section class="variables">
        <Variables />
      </section>
      <Schedule />
    </main>
  );
}

export default App;
