import { useState } from "react";
import BootSequence from "./boot/BootSequence";
import Desktop from "./os/Desktop";

const HAS_BOOTED_KEY = "portfolio-os-has-booted";
const IS_DEV = import.meta.env.DEV;

function App() {
  const [booted, setBooted] = useState(() => !IS_DEV && localStorage.getItem(HAS_BOOTED_KEY) === "true");

  const handleBootDone = () => {
    localStorage.setItem(HAS_BOOTED_KEY, "true");
    setBooted(true);
  };

  return (
    <>
      {!booted && <BootSequence onDone={handleBootDone} />}
      {booted && <Desktop />}
    </>
  );
}

export default App;
