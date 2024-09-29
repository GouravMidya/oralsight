"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BriefcaseMedical, Upload, FileImage } from "lucide-react"

export function UploadPageComponent() {
  const [files, setFiles] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (files.length === 0) {
      alert("Please select at least one file to upload.")
      return
    }

    setIsUploading(true)

    const formData = new FormData()
    files.forEach((file) => {
      formData.append("files", file)
    })

    try {
      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      localStorage.setItem('analysisResults', JSON.stringify(result))
      router.push("/result")
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("An error occurred while uploading the files. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <a className="flex items-center justify-center" href="/">
          <BriefcaseMedical className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">Oral Sights</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Upload Your Dental X-rays
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Get instant AI-powered analysis and annotations for your dental X-rays.
                </p>
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <Label htmlFor="x-ray-upload">Upload X-ray Images</Label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="x-ray-upload"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FileImage className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            JPG, PNG, or DICOM (MAX. 800x400px)
                          </p>
                        </div>
                        <Input
                          id="x-ray-upload"
                          type="file"
                          accept=".jpg,.jpeg,.png,.dcm"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <div>
                      <p className="font-medium">Selected files:</p>
                      <ul className="list-disc list-inside">
                        {files.map((file, index) => (
                          <li key={index}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isUploading}>
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload and Analyze"}
                  </Button>
                </form>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl mb-4">
                  How to Prepare Your X-rays
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">1. Image Format</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ensure your X-rays are in JPG, PNG, or DICOM format. We support most common dental X-ray image types.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">2. Image Quality</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      For best results, use high-resolution images. The maximum supported size is 800x400 pixels.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">3. Patient Privacy</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ensure all patient identifying information is removed from the X-ray images before uploading.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
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
    </div>
  )
}