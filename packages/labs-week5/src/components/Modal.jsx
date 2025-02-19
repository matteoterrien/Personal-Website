import { useRef } from "react";

function Modal(props) {
  const ref = useRef(null);

  const handleOverlayClick = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      props.onCloseRequested();
    }
  };

  return (
    <div
      className="w-screen h-screen fixed z-1 bg-white/50 flex justify-center items-center"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white flex flex-col justify-center items-center"
        ref={ref}
      >
        <header className="w-full flex flex-row justify-between">
          <h1 className="font-bold">{props.headerLabel}</h1>
          <button
            aria-label="Close"
            className="w-1/10 rounded-lg hover:bg-stone-300 active:bg-stone-500"
            onClick={props.onCloseRequested}
          >
            X
          </button>
        </header>
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
