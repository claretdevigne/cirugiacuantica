import { useState } from "react";

const SwitcherFour = ( props: any ) => {
  const [enabled, setEnabled] = useState<boolean>(props.enable);

  return (
    <div>
      <label
        htmlFor="toggle4"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="toggle4"
            className="sr-only"
            onChange={() => {
              setEnabled(!enabled);
            }}
          />
          <div className={`block h-8 w-14 rounded-full ${ enabled ? "bg-yellow-500" : "bg-zinc-500" }`}></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              enabled && "!right-1 !translate-x-full"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherFour;
