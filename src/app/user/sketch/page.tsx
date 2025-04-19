"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Type definitions for points and drawing actions
interface Point {
  x: number;
  y: number;
}

interface DrawingAction {
  path: Point[];
  style: {
    color: string;
    lineWidth: number;
  };
}

const SketchPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lineWidth, setLineWidth] = useState<number>(3);
  const [drawingActions, setDrawingActions] = useState<DrawingAction[]>([]);
  const [undoneActions, setUndoneActions] = useState<DrawingAction[]>([]); // For redo functionality
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [currentStyle, setCurrentStyle] = useState({
    color: "black",
    lineWidth: 3,
  });

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      setContext(ctx);
      if (ctx) {
        ctx.fillStyle = "#ffffff";
      }
      reDrawPreviousData(ctx);
    }
  }, [drawingActions, undoneActions]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
      setCurrentPath([{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !context) return;
    context.strokeStyle = currentStyle.color;
    context.lineWidth = currentStyle.lineWidth;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();

    setCurrentPath((prevPath) => [
      ...prevPath,
      { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY },
    ]);
  };

  const endDrawing = () => {
    if (context && currentPath.length > 0) {
      setIsDrawing(false);
      context.closePath();
      setDrawingActions((prevActions) => [
        ...prevActions,
        { path: currentPath, style: currentStyle },
      ]);
      setUndoneActions([]);
      setCurrentPath([]);
    }
  };

  const changeColor = (color: string) => {
    setCurrentColor(color);
    setCurrentStyle({ ...currentStyle, color });
  };

  const changeWidth = (width: number) => {
    setLineWidth(width);
    setCurrentStyle({ ...currentStyle, lineWidth: width });
  };

  const undoDrawing = () => {
    if (drawingActions.length > 0) {
      const newDrawingActions = [...drawingActions];
      const undoneAction = newDrawingActions.pop();
      setDrawingActions(newDrawingActions);
      if (undoneAction) {
        setUndoneActions((prevUndone) => [undoneAction, ...prevUndone]);
      }
    }
  };

  const redoDrawing = () => {
    if (undoneActions.length > 0) {
      const undoneAction = undoneActions[0];
      setDrawingActions((prevActions) => [...prevActions, undoneAction]);
      setUndoneActions((prevUndone) => prevUndone.slice(1));
    }
  };

  const clearDrawing = () => {
    setDrawingActions([]);
    setCurrentPath([]);
    const newContext = canvasRef.current?.getContext("2d");
    if (newContext) {
      newContext.clearRect(
        0,
        0,
        canvasRef.current?.width || 0,
        canvasRef.current?.height || 0
      );
    }
  };

  const reDrawPreviousData = (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return;

    drawingActions.forEach(({ path, style }) => {
      ctx.beginPath();
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.lineWidth;
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  };

  const handleGenerateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const response = axios.post("/api/generate-image", { imageData: dataURL });
    toast.promise(response, {
      loading: "Generating real Image...",
      success: (data) => {
        setImage(data.data.imageData);
        console.log(data);
        return "Image generated";
      },
      error: (err) => err.response?.data?.message || "Something went wrong",
    });
  };

  return (
    <>
      <h1 className="text-4xl uppercase text-center font-bold mb-4">
        Sketch Page
      </h1>
      <canvas
        ref={canvasRef}
        className="border border-base-content cursor-crosshair w-full h-[60vh]"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        style={{
          backgroundImage:
            "url(https://img.freepik.com/premium-photo/seamless-transparent-background-grey-white-squares_346312-2733.jpg?w=360)",
        }}
        width={800}
        height={480}
      />

      <div className="mt-4 flex justify-center items-center space-x-4">
        <div className="flex space-x-2">
          {["black", "red", "blue", "green", "yellow"].map((color) => (
            <button
              key={color}
              style={{ backgroundColor: color }}
              onClick={() => changeColor(color)}
              className="w-8 h-8 rounded-full"
            />
          ))}
        </div>

        <input
          type="range"
          min={1}
          max={10}
          value={lineWidth}
          onChange={(e) => changeWidth(Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        <button onClick={undoDrawing} className="btn btn-secondary">
          Undo
        </button>
        <button onClick={redoDrawing} className="btn btn-secondary">
          Redo
        </button>
        <button onClick={clearDrawing} className="btn btn-error">
          Clear
        </button>
      </div>

      <button
        onClick={handleGenerateImage}
        className="mt-4 btn btn-primary btn-outline w-full"
      >
        Generate Image
      </button>

      {image && (
        <div className="mt-4 mx-auto w-full max-w-md text-center">
          <h2 className="text-lg font-semibold">Generated Image:</h2>
          <img src={image} alt="Generated Sketch" className="border mt-2" />
          <a
            href={image}
            download="generated_sketch.png"
            className="btn btn-primary mt-2"
          >
            Download Image
          </a>
        </div>
      )}
    </>
  );
};

export default SketchPage;
