import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import DotGrid from './DotGrid';

export default function MainLayout({ children }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden">

      {/* 🔹 Background */}
      <DotGrid
        dotSize={5}
        gap={50}
        baseColor="#B6AE9F"
        activeColor="#6F00FF"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      />

      <div className="relative z-11">
        <Nav />
      </div>

      <div className="relative z-10 h-full overflow-y-auto pt-20 px-9">
        <Outlet />
      </div>

    </div>
  );
}
