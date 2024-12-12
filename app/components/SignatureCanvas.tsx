"use client"

import { useRef, useState, useEffect } from 'react'

export default function SignatureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 300, height: 150 })

  useEffect(() => {
    const updateCanvasSize = () => {
      const canvasWidth = Math.min(window.innerWidth - 64, 600) 
      const canvasHeight = Math.min(canvasWidth / 2, 300) 
      setCanvasSize({ width: canvasWidth, height: canvasHeight })
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      if (context) {
        context.lineWidth = 2
        context.lineCap = 'round'
        context.strokeStyle = '#000'
      }
    }
  }, [])

  const startDrawing = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) context.beginPath()
    }
  }

  const draw = (e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    let clientX, clientY

    if ('touches' in e) {
      e.preventDefault() 
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY

    context.lineTo(x, y)
    context.stroke()
    context.beginPath()
    context.moveTo(x, y)

    setHasContent(true)
  }

  const clearCanvas = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
    setHasContent(false)
  }

  const downloadSignature = () => {
    if (canvasRef.current && hasContent) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'signature.png'
      link.href = dataUrl
      link.click()
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-white border-2 border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          className="touch-none w-full h-auto"
        />
        <div className="absolute bottom-2 left-2 text-xs text-gray-400">
          Sign here
        </div>
      </div>
      <div className="flex space-x-4 justify-center">
        <button 
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
        >
          Clear
        </button>
        <button 
          onClick={downloadSignature} 
          disabled={!hasContent}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors ${
            !hasContent && 'opacity-50 cursor-not-allowed'
          }`}
        >
          Download
        </button>
      </div>
    </div>
  )
}

