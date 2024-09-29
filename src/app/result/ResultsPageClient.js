"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { BriefcaseMedical, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react"

export function ResultsPageClient() {
  const [results, setResults] = useState([])
  const [zoom, setZoom] = useState(200)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [visibleAnnotations, setVisibleAnnotations] = useState([])
  const [classVisibility, setClassVisibility] = useState({})
  const [collapsedClasses, setCollapsedClasses] = useState({})
  const router = useRouter()
  const canvasRef = useRef(null)

  const classColors = {
    cavity: "red",
    fillings: "blue",
    "impacted tooth": "green",
    implant: "purple",
    normal: "orange"
  }

  useEffect(() => {
    const storedResults = localStorage.getItem('analysisResults')
    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)
      setResults(parsedResults)
      setVisibleAnnotations(parsedResults.map(res => res.annotations.map(() => true)))
      localStorage.removeItem('analysisResults')
    }
  }, [])

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 500))  // Increased max zoom to 500%
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 10))   // Decreased min zoom to 10%
  const handleZoomChange = (value) => setZoom(value[0])

  const handlePrevImage = () => setCurrentImageIndex(prev => Math.max(prev - 1, 0))
  const handleNextImage = () => setCurrentImageIndex(prev => Math.min(prev + 1, results.length - 1))

  const toggleAnnotationVisibility = (index) => {
    setVisibleAnnotations(prev => {
      const updatedAnnotations = [...prev]
      updatedAnnotations[currentImageIndex] = [...updatedAnnotations[currentImageIndex]]
      updatedAnnotations[currentImageIndex][index] = !updatedAnnotations[currentImageIndex][index]
      return updatedAnnotations
    })
  }

  const toggleClassVisibility = (className) => {
    setVisibleAnnotations(prev => {
      const updatedAnnotations = [...prev]
      updatedAnnotations[currentImageIndex] = updatedAnnotations[currentImageIndex].map((visible, index) => {
        const annotation = results[currentImageIndex].annotations[index]
        return annotation.predicted_class === className ? !classVisibility[className] : visible
      })
      return updatedAnnotations
    })
    setClassVisibility(prev => ({ ...prev, [className]: !prev[className] }))
  }

  const toggleCollapseClass = (className) => {
    setCollapsedClasses(prev => ({ ...prev, [className]: !prev[className] }))
  }

  const drawAnnotationsOnCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const image = new Image()

    // Load the base64 image
    image.src = `data:image/jpeg;base64,${results[currentImageIndex].image_data}`
    image.onload = () => {
      // Set canvas dimensions based on image size
      canvas.width = image.width
      canvas.height = image.height

      // Draw the image onto the canvas
      ctx.drawImage(image, 0, 0)

      // Draw annotations (only the visible ones)
      results[currentImageIndex].annotations.forEach((annotation, index) => {
        if (visibleAnnotations[currentImageIndex]?.[index]) {
          ctx.strokeStyle = classColors[annotation.predicted_class]
          ctx.lineWidth = 2
          ctx.strokeRect(
            annotation.bbox[0],
            annotation.bbox[1],
            annotation.bbox[2] - annotation.bbox[0],
            annotation.bbox[3] - annotation.bbox[1]
          )

          // Add annotation text
          ctx.font = "6px Arial"  // Font size 6, as per your preference
          ctx.fillStyle = classColors[annotation.predicted_class]
          ctx.fillText(`#${index + 1} ${annotation.predicted_class}`, annotation.bbox[0], annotation.bbox[1] - 5)
        }
      })
    }
  }

  const handleDownload = () => {
    drawAnnotationsOnCanvas()

    const canvas = canvasRef.current
    const link = document.createElement("a")
    link.download = `annotated-xray-${currentImageIndex + 1}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  if (results.length === 0) {
    return <div>No results available. Please upload some X-rays first.</div>
  }

  const currentResult = results[currentImageIndex]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <a className="flex items-center justify-center" href="/">
          <BriefcaseMedical className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Oral Sights</span>
        </a>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">X-ray Annotation Results</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative border border-neutral-200 rounded-lg overflow-hidden dark:border-neutral-800" style={{ height: "60vh" }}>
              <div className="absolute inset-0 flex items-center justify-center overflow-auto">
                <div style={{ transform: `scale(${zoom / 100})`, transition: "transform 0.2s" }}>
                  <img 
                    src={`data:image/jpeg;base64,${currentResult.image_data}`}
                    alt={`Annotated X-ray ${currentImageIndex + 1}`} 
                    className="max-w-full h-auto" 
                    style={{ minWidth: "100%", minHeight: "100%" }} 
                  />
                  {/* Annotation overlay */}
                  <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                    {currentResult.annotations.map((annotation, index) => (
                      visibleAnnotations[currentImageIndex]?.[index] && (
                        <g key={index}>
                          <rect
                            x={annotation.bbox[0]}
                            y={annotation.bbox[1]}
                            width={annotation.bbox[2] - annotation.bbox[0]}
                            height={annotation.bbox[3] - annotation.bbox[1]}
                            stroke={classColors[annotation.predicted_class]}
                            strokeWidth="2"
                            fill="none"
                          />
                          <text
                            x={annotation.bbox[0]}
                            y={annotation.bbox[1] - 5}
                            fill={classColors[annotation.predicted_class]}
                            fontSize="6"
                            fontWeight="bold"
                          >
                            {`#${index + 1} ${annotation.predicted_class}`}
                          </text>
                        </g>
                      )
                    ))}
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button onClick={handleZoomOut} size="icon" variant="outline">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Slider
                  value={[zoom]}
                  onValueChange={handleZoomChange}
                  min={10}  // Decreased min zoom-out
                  max={500} // Increased max zoom-in
                  step={1}
                  className="w-[200px]"
                />
                <Button onClick={handleZoomIn} size="icon" variant="outline">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button onClick={handlePrevImage} size="icon" variant="outline" disabled={currentImageIndex === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Image {currentImageIndex + 1} of {results.length}</span>
                <Button onClick={handleNextImage} size="icon" variant="outline" disabled={currentImageIndex === results.length - 1}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          {/* Diagnosis Panel */}
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Diagnosis</h2>
              <p className="text-sm mb-2">
                Filename: <span className="font-bold">{currentResult.filename}</span>
              </p>
              <p className="text-sm mb-2">
                Annotations:
              </p>
              <div className="space-y-2">
                {Object.entries(
                  currentResult.annotations.reduce((acc, annotation, index) => {
                    acc[annotation.predicted_class] = acc[annotation.predicted_class] || []
                    acc[annotation.predicted_class].push({ annotation, index })
                    return acc
                  }, {})
                ).map(([className, classAnnotations], i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center cursor-pointer" onClick={() => toggleCollapseClass(className)}>
                        {collapsedClasses[className] ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                        <span className="ml-2">{className} ({classAnnotations.length})</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={classVisibility[className] !== false}
                        onChange={() => toggleClassVisibility(className)}
                      />
                    </div>
                    {!collapsedClasses[className] && (
                      <div className="ml-4">
                        {classAnnotations.map(({ annotation, index }) => (
                          <div key={index} className="flex items-center justify-between">
                            <span>Annotation #{index + 1}: {className} ({annotation.confidence.toFixed(2)}%)</span>
                            <input
                              type="checkbox"
                              checked={visibleAnnotations[currentImageIndex][index]}
                              onChange={() => toggleAnnotationVisibility(index)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}
