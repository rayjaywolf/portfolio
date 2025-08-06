"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { OrbitControls, View as ViewImpl } from "@react-three/drei";
import { Three } from "./helpers/Three";

interface ViewProps {
  children: React.ReactNode;
  orbit?: boolean;
  [key: string]: any;
}

const View = forwardRef<HTMLDivElement, ViewProps>(
  ({ children, orbit, ...props }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => localRef.current!);

    return (
      <>
        <div ref={localRef} {...props} />
        <Three>
          <ViewImpl track={localRef as any}>
            {children}
            {orbit && <OrbitControls />}
          </ViewImpl>
        </Three>
      </>
    );
  }
);

View.displayName = "View";

export { View };
