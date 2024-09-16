"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { BriefcaseMedical, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight } from "lucide-react";

export function ResultPageComponent() {
  const [zoom, setZoom] = useState(100)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50))
  const handleZoomChange = (value) => setZoom(value[0])

  const handlePrevImage = () => setCurrentImageIndex(prev => Math.max(prev - 1, 0))
  const handleNextImage = () => setCurrentImageIndex(prev => Math.min(prev + 1, 2)) // Assuming 3 images total

  const handleDownload = () => {
    // Implement download logic here
    console.log("'Downloading annotated X-ray'")
  }

  return (
    (<div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <a className="flex items-center justify-center" href="/">
          <BriefcaseMedical className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Oral Sights</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#">
            Features
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#">
            Pricing
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#">
            About
          </a>
          <a
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#">
            Contact
          </a>
        </nav>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">X-ray Annotation Results</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div
              className="relative border border-neutral-200 rounded-lg overflow-hidden dark:border-neutral-800"
              style={{ height: "'60vh'" }}>
              <div
                className="absolute inset-0 flex items-center justify-center overflow-auto">
                <div
                  style={{ transform: `scale(${zoom / 100})`, transition: "'transform 0.2s'" }}>
                  <img
                    src="/placeholder.svg"
                    alt="Annotated X-ray"
                    className="max-w-full h-auto"
                    style={{ minWidth: "'100%'", minHeight: "'100%'" }} />
                  {/* Annotation overlay */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ pointerEvents: "'none'" }}>
                    <circle cx="50%" cy="30%" r="5%" fill="rgba(255, 0, 0.5)" />
                    <rect x="20%" y="60%" width="10%" height="10%" fill="rgba(0, 255, 0, 0.5)" />
                    <path d="M 70 80 Q 90 50 110" stroke="blue" strokeWidth="2" fill="none" />
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
                  min={50}
                  max={200}
                  step={1}
                  className="w-[200px]" />
                <Button onClick={handleZoomIn} size="icon" variant="outline">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handlePrevImage}
                  size="icon"
                  variant="outline"
                  disabled={currentImageIndex === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Image {currentImageIndex + 1} of 3</span>
                <Button
                  onClick={handleNextImage}
                  size="icon"
                  variant="outline"
                  disabled={currentImageIndex === 2}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Diagnosis</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Cavity detected in upper right molar</li>
                <li>Potential root issue in lower left incisor</li>
                <li>Previous filling in lower right premolar</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Remarks</h2>
              <p className="text-sm text-gray-600">
                The X-ray reveals a cavity in the upper right molar that requires immediate attention. There's also a
                potential root issue in the lower left incisor that should be monitored closely. The previous filling in
                the lower right premolar appears to be in good condition. Overall, the patient should schedule a
                follow-up appointment for treatment of the cavity and further evaluation of the potential root issue.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 Oral Sights. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>)
  );
}