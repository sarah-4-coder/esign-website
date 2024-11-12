"use client";

import { useRef, useState, useEffect } from 'react';
import { Button } from '../ui/button';

export default function SignatureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasContent, setHasContent] = useState(false); 
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 150 }); 

  
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvasWidth = Math.min(window.innerWidth * 0.8, 600); 
      const canvasHeight = canvasWidth / 2; 
      setCanvasSize({ width: canvasWidth, height: canvasHeight });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) context.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);

    setHasContent(true);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    setHasContent(false); 
  };

  const downloadSignature = () => {
    if (canvasRef.current && hasContent) {
      const scale = 2; 
      const canvas = canvasRef.current;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;

      const tempContext = tempCanvas.getContext('2d');
      if (tempContext) {
        tempContext.scale(scale, scale);
        tempContext.drawImage(canvas, 0, 0);

        const dataUrl = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'signature.png';
        link.href = dataUrl;
        link.click();
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        className="border border-gray-300 rounded-md touch-none"
        style={{ width: '100%', maxWidth: '600px', height: 'auto' }}
      />
      <div className="flex space-x-2">
        <Button onClick={clearCanvas}>Clear</Button>
        <Button onClick={downloadSignature} disabled={!hasContent}>Download</Button> 
      </div>
    </div>
  );
}
