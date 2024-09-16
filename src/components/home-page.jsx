"use client";
import { Button } from "@/components/ui/button"
import { BriefcaseMedical, Upload, Info } from "lucide-react"
import Link from "next/link";

export function HomePageComponent() {
  return (
    (<div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
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
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Advanced Dental X-ray Analysis
                </h1>
                <p
                  className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload your dental X-rays and receive instant, AI-powered annotations and insights. Enhance your
                  diagnostic capabilities with our cutting-edge segmentation technology.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="inline-flex items-center justify-center" component={Link} href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload X-ray
                </Button>
                <Button variant="outline" className="inline-flex items-center justify-center">
                  <Info className="mr-2 h-4 w-4" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 mt-8">
              <div className="flex flex-col items-center text-center">
                <Upload className="h-12 w-12 mb-4 text-neutral-900 dark:text-neutral-50" />
                <h3 className="text-lg font-bold">Upload X-ray</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Securely upload your dental X-ray images to our platform.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <BriefcaseMedical className="h-12 w-12 mb-4 text-neutral-900 dark:text-neutral-50" />
                <h3 className="text-lg font-bold">AI Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Our advanced AI algorithms analyze and segment the X-ray images.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Info className="h-12 w-12 mb-4 text-neutral-900 dark:text-neutral-50" />
                <h3 className="text-lg font-bold">Get Insights</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive detailed annotations and remarks to aid your diagnosis.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer
        className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 Oral Sights. All rights reserved.</p>
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