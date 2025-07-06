import * as XLSX from "xlsx";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImportQuestionsDialogProps {
  onImport: (questions: {
    correctAnswer: number;
    explanation: string;
    marks: number;
    negativeMarks: number;
    options: string[];
    question: string;
  }[]) => void; // Callback to pass imported questions
}

export default function ImportQuestionsDialog({ onImport }: ImportQuestionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [excelUrl, setExcelUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleImport() {
    setLoading(true);
    try {
      let url = excelUrl;

      // Convert Google Sheets to direct export if needed
      if (url.includes("docs.google.com/spreadsheets")) {
        const sheetId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
        if (sheetId) {
          url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
        }
      }

      const res = await fetch(url);
      const blob = await res.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });

      const questions = rows.map((curr) => {
        const row = curr as Record<string, string>;
        const options = [];
        for (let i = 1; i <= 8; i++) {
          const opt = row[`Answer${i}`];
          if (opt) options.push(opt);
        }

        // Return in your desired format
        return {
          question: row["Question"] || "",
          options,
          correctAnswer: parseInt(row["correctanswer"]) - 1, // convert to 0-based index
          explanation: row["Explanation"] || "",
          marks: parseFloat(row["Marks"]) || 1,
          negativeMarks: parseFloat(row["Negativemarks(%)"]) || 0,
        };
      });

      // Filter out empty or invalid ones
      const validQuestions = questions.filter(
        (q) =>
          q.question &&
          Array.isArray(q.options) &&
          q.options.length > q.correctAnswer &&
          q.correctAnswer >= 0
      );

      onImport(validQuestions);
    } catch (err) {
      console.error("Import failed", err);
    } finally {
      setLoading(false);
      setOpen(false);
      setExcelUrl("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button type="button">
          Import Questions
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Import Questions from Excel
          </DialogTitle>
        </DialogHeader>
        <Input
          type="url"
          placeholder="Paste public Excel file URL..."
          value={excelUrl}
          onChange={(e) => setExcelUrl(e.target.value)}
        />
        <Button
          onClick={handleImport}
          disabled={loading}
          type="button"
        >
          {loading ? "Importing..." : "Import"}
        </Button>
      </DialogContent>

    </Dialog>
  );
}
