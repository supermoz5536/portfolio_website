import { useRef } from "react";
import "./interface.css";

export function MovementPad() {
  const padRef = useRef<any>();
  const regionRef = useRef<any>();
  const handleRef = useRef<any>();

  return (
    <>
      <div
        ref={padRef}
        className="movement-pad"
        style={{
          zIndex: 10,
        }}
      >
        <div ref={regionRef} className="region">
          <div ref={handleRef} className="handle"></div>
        </div>
      </div>
    </>
  );
}
