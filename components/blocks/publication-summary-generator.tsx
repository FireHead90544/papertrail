"use client"

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, UploadIcon, DownloadIcon } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Document, Packer, Paragraph } from 'docx'
import dummyText from "@/components/blocks/dummyText.json"

interface Publication {
  title: string;
  author: string;
  year: number;
  type: string;
  journal?: string;
  booktitle?: string;
  publisher?: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
}

export default function PublicationSummaryGenerator() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [publicationTypeFilter, setPublicationTypeFilter] = useState<string>('all');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [filteredPublications, setFilteredPublications] = useState<Publication[]>([]);
  const [summaryText, setSummaryText] = useState<string>(dummyText.data);

  useEffect(() => {
    filterPublications();
  }, [startDate, endDate, publicationTypeFilter, publications]);

  const filterPublications = () => {
    let filtered = [...publications];
    if (startDate) {
      filtered = filtered.filter(pub => pub.year >= parseInt(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(pub => pub.year <= parseInt(endDate));
    }
    if (publicationTypeFilter === 'journal') {
      filtered = filtered.filter(pub => pub.type.toLowerCase() === 'article');
    } else if (publicationTypeFilter === 'conference') {
      filtered = filtered.filter(pub => pub.type.toLowerCase() === 'inproceedings');
    }
    setFilteredPublications(filtered);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        if (file.name.endsWith('.bib')) {
          parseBibTeX(content);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          parseExcel(content);
        } else {
          alert('Please upload a .bib or Excel file');
        }
      }
    };
    reader.readAsText(file);
  };

  const parseBibTeX = (content: string) => {
    const entries = content.split('@');
    const parsedPublications: Publication[] = entries.slice(1).map(entry => {
      const lines = entry.split('\n');
      const type = lines[0].split('{')[0].trim();
      const publication: Publication = {
        title: '',
        author: '',
        year: 0,
        type: type
      };

      lines.forEach(line => {
        const [key, value] = line.split('=').map(part => part.trim());
        if (key && value) {
          const cleanValue = value.replace(/[{},]/g, '').trim();
          switch (key) {
            case 'title':
              publication.title = cleanValue;
              break;
            case 'author':
              publication.author = cleanValue;
              break;
            case 'year':
              publication.year = parseInt(cleanValue);
              break;
            case 'journal':
            case 'booktitle':
            case 'publisher':
            case 'volume':
            case 'number':
            case 'pages':
            case 'doi':
              publication[key] = cleanValue;
              break;
          }
        }
      });

      return publication;
    });

    setPublications(parsedPublications);
  };

  const parseExcel = (content: string) => {
    console.log('Excel parsing not implemented');
  };

  const exportToExcel = () => {
    const data: any[] = filteredPublications.map(pub => {
      if (publicationTypeFilter === 'journal') {
        return {
          Title: pub.title,
          Author: pub.author,
          Journal: pub.journal,
          Publisher: pub.publisher,
          Year: pub.year,
          DOI: pub.doi,
        };
      } else if (publicationTypeFilter === 'conference') {
        return {
          Title: pub.title,
          Author: pub.author,
          'Book Title': pub.booktitle,
          Publisher: pub.publisher,
          Year: pub.year,
          Note: pub.pages, // Assuming Note refers to pages for conference papers
        };
      } else {
        return {
          Title: pub.title,
          Author: pub.author,
          'Journal/Book Title': pub.journal || pub.booktitle,
          Publisher: pub.publisher,
          Year: pub.year,
        };
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Publications');

    // Download the Excel file
    XLSX.writeFile(workbook, 'filtered_publications.xlsx');
  };

  const exportToWord = () => {
    const doc = new Document({
      sections: []
    });

    const author = filteredPublications?.[0]?.author || "Author Name";

    doc.addSection({
      children: [
        new Paragraph({
          text: author,
          heading: "Heading1",
        }),
        new Paragraph(`Research Summary for ${author}`),
        new Paragraph(summaryText),
      ],
    });

    Packer.toBlob(doc).then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "publication_summary.docx";
      link.click();
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Publication Summary Generator</h1>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex items-center w-max space-x-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">
            <UploadIcon className="w-5 h-5" />
            <span>Upload File</span>
          </div>
          <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".bib,.xlsx,.xls" />
        </Label>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Label htmlFor="start-date">From:</Label>
            <div className="relative">
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
                placeholder="Start Year"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="end-date">Upto:</Label>
            <div className="relative">
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
                placeholder="End Year"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center w-max">
        <Select onValueChange={(val) => setPublicationTypeFilter(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Publication Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="journal">Journal</SelectItem>
            <SelectItem value="conference">Conference</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publication Records {(publications.length !== 0) && `- ${publications?.[0].author}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>{publicationTypeFilter === "all" ? "Journal/Book" : (publicationTypeFilter === "journal" ? "Journal" : "Book Title")}</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPublications.map((pub, index) => (
                <TableRow key={index}>
                  <TableCell>{pub.title}</TableCell>
                  <TableCell>{pub.journal || pub.booktitle}</TableCell>
                  <TableCell>{pub.year}</TableCell>
                  <TableCell>{pub.type === "article" ? "Journal" : "Conference"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
        <Button onClick={exportToExcel}>
          <DownloadIcon className="w-5 h-5 mr-2" />
          Export to Excel
        </Button>
        <Button onClick={exportToWord}>
          <DownloadIcon className="w-5 h-5 mr-2" />
          Export to Word
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Publication Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Publications: {filteredPublications.length}</p>
          <p>Journal Articles: {filteredPublications.filter(p => p.type.toLowerCase() === 'article').length}</p>
          <p>Conference Papers: {filteredPublications.filter(p => p.type.toLowerCase() === 'inproceedings').length}</p>
          <p>Most Recent Year: {(isFinite(Math.max(...filteredPublications.map(p => p.year)))) ? Math.max(...filteredPublications.map(p => p.year)) : "None"}</p>
        </CardContent>
        <CardContent>
          <p>{summaryText}</p>
        </CardContent>
      </Card>
    </div>
  );
}
