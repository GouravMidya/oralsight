"use client";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { BriefcaseMedical, Download, Eye } from "lucide-react"

const mockRecords = [
  { id: "'1'", date: "'2023-06-01'", patientName: "'John Doe'", xrayType: "'Panoramic'", remarks: "'No significant issues detected.'" },
  { id: "'2'", date: "'2023-06-05'", patientName: "'Jane Smith'", xrayType: "'Bitewing'", remarks: "'Small cavity detected in upper right molar.'" },
  { id: "'3'", date: "'2023-06-10'", patientName: "'Alice Johnson'", xrayType: "'Periapical'", remarks: "'Potential root issue in lower left incisor.'" },
]

export function RecordsPageComponent() {
  const [selectedRecord, setSelectedRecord] = useState(null)

  const handleDownload = (id) => {
    // Implement download logic here
    console.log(`Downloading report for record ${id}`)
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
        <h1 className="text-3xl font-bold mb-6">X-ray Records</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Patient Name</TableHead>
              <TableHead>X-ray Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.patientName}</TableCell>
                <TableCell>{record.xrayType}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>X-ray Details</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Date:</span>
                            <span className="col-span-3">{selectedRecord?.date}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Patient:</span>
                            <span className="col-span-3">{selectedRecord?.patientName}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">X-ray Type:</span>
                            <span className="col-span-3">{selectedRecord?.xrayType}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <span className="font-medium">Remarks:</span>
                            <span className="col-span-3">{selectedRecord?.remarks}</span>
                          </div>
                          <div className="col-span-4">
                            <img
                              src="/placeholder.svg"
                              alt="X-ray"
                              className="w-full h-auto rounded-lg border" />
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(record.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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