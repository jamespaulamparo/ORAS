import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { parseTimeToMinutes } from '../../lib/timetable';

interface ParsedRow {
  id: string;
  course_code: string;
  course_title: string;
  section_code: string;
  units: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  instructor: string;
  isValid: boolean;
  error?: string;
}

interface SpreadsheetImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportOfferings: (rows: ParsedRow[]) => Promise<void>;
}

const DAY_MAP: Record<string, number> = {
  m: 1, mon: 1, monday: 1, '1': 1,
  t: 2, tue: 2, tues: 2, tuesday: 2, '2': 2,
  w: 3, wed: 3, wednesday: 3, '3': 3,
  th: 4, thu: 4, thur: 4, thurs: 4, thursday: 4, '4': 4,
  f: 5, fri: 5, friday: 5, '5': 5,
  s: 6, sat: 6, saturday: 6, '6': 6,
  su: 7, sun: 7, sunday: 7, '7': 7,
};

export const SpreadsheetImportModal: React.FC<SpreadsheetImportModalProps> = ({
  isOpen,
  onClose,
  onImportOfferings,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('paste');
  const [pasteText, setPasteText] = useState(
`Course Code\tCourse Title\tSection\tUnits\tDay\tStart\tEnd\tRoom\tInstructor
CS 101\tData Structures\tA\t3.0\tMon\t08:30\t10:00\tLab 1\tDr. Garcia
CS 101\tData Structures\tA\t3.0\tWed\t08:30\t10:00\tLab 1\tDr. Garcia
MATH 201\tLinear Algebra\tB\t3.0\tTue\t10:30\t12:00\tHall 2\tProf. Reyes
MATH 201\tLinear Algebra\tB\t3.0\tThu\t10:30\t12:00\tHall 2\tProf. Reyes`
  );
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseRawLines = (text: string) => {
    const lines = text.trim().split('\n');
    if (lines.length === 0) return;

    const rows: ParsedRow[] = [];
    // Check if first line is header
    const startIndex = lines[0].toLowerCase().includes('course') || lines[0].toLowerCase().includes('code') ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Split by tab or comma
      const parts = line.includes('\t') ? line.split('\t') : line.split(',');
      const cleanParts = parts.map(p => p.trim().replace(/^["']|["']$/g, ''));

      const course_code = (cleanParts[0] || '').toUpperCase();
      const course_title = cleanParts[1] || course_code;
      const section_code = cleanParts[2] || 'A';
      const units = cleanParts[3] || '3.0';
      const dayRaw = (cleanParts[4] || '1').toLowerCase();
      const day_of_week = DAY_MAP[dayRaw] || 1;
      let start_time = cleanParts[5] || '08:30';
      let end_time = cleanParts[6] || '10:00';
      const room = cleanParts[7] || '';
      const instructor = cleanParts[8] || '';

      // Normalize time strings (ensure HH:MM format)
      if (start_time.length === 4) start_time = `0${start_time}`;
      if (end_time.length === 4) end_time = `0${end_time}`;

      const sMin = parseTimeToMinutes(start_time);
      const eMin = parseTimeToMinutes(end_time);

      let isValid = true;
      let error = '';

      if (!course_code) {
        isValid = false;
        error = 'Missing course code';
      } else if (sMin >= eMin) {
        isValid = false;
        error = 'Start time must be before end time';
      }

      rows.push({
        id: `row-${i}-${Date.now()}`,
        course_code,
        course_title,
        section_code,
        units,
        day_of_week,
        start_time,
        end_time,
        room,
        instructor,
        isValid,
        error,
      });
    }

    setParsedRows(rows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPasteText(content);
      parseRawLines(content);
      setActiveTab('paste');
    };
    reader.readAsText(file);
  };

  const handleCommit = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    if (validRows.length === 0) {
      showToast('No valid rows to import', 'danger');
      return;
    }

    try {
      setIsSubmitting(true);
      await onImportOfferings(validRows);
      showToast(`Successfully imported ${validRows.length} class offering sessions`, 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Import failed', 'danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCount = parsedRows.filter(r => r.isValid).length;
  const errorCount = parsedRows.filter(r => !r.isValid).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Offerings (CSV / Spreadsheet)"
      description="Upload a CSV file or paste tabular class data to batch-import your courses and sections."
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-border-subtle pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'paste'
                ? 'bg-accent text-accent-contrast shadow-sm'
                : 'text-fg-secondary hover:text-fg hover:bg-surface-secondary'
            }`}
          >
            Paste Text / Table
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'upload'
                ? 'bg-accent text-accent-contrast shadow-sm'
                : 'text-fg-secondary hover:text-fg hover:bg-surface-secondary'
            }`}
          >
            Upload File (.csv, .tsv)
          </button>
        </div>

        {/* Tab: Upload */}
        {activeTab === 'upload' && (
          <div className="p-8 rounded-xl border border-dashed border-border-default bg-surface-secondary/40 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-accent-surface text-accent flex items-center justify-center mx-auto">
              <Upload size={20} />
            </div>
            <div>
              <p className="font-bold text-fg">Drop your spreadsheet or CSV file here</p>
              <p className="text-[11px] text-fg-muted mt-0.5">Supports CSV, TSV, and plain text tables</p>
            </div>
            <label className="inline-block cursor-pointer px-4 py-2 rounded-lg bg-surface border border-border-default hover:border-border-strong text-fg font-semibold hover:bg-surface-secondary transition-colors">
              <span>Browse Computer</span>
              <input
                type="file"
                accept=".csv, .tsv, .txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Tab: Paste Text */}
        {activeTab === 'paste' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-fg">Paste Tabular Data</label>
              <button
                type="button"
                onClick={() => parseRawLines(pasteText)}
                className="text-xs text-accent font-bold hover:underline"
              >
                Parse Rows
              </button>
            </div>
            <textarea
              rows={6}
              value={pasteText}
              onChange={(e) => {
                setPasteText(e.target.value);
                parseRawLines(e.target.value);
              }}
              className="w-full font-mono text-[11px] p-3 rounded-lg border border-border-default bg-surface text-fg focus:outline-none focus:ring-1 focus:ring-accent leading-relaxed"
              placeholder="Paste tab-separated or comma-separated rows..."
            />
          </div>
        )}

        {/* Live Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-fg flex items-center gap-1.5">
                <FileSpreadsheet size={14} className="text-accent" />
                <span>Parsed Preview ({parsedRows.length} rows)</span>
              </span>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-status-success font-semibold flex items-center gap-1">
                  <CheckCircle2 size={12} /> {validCount} Valid
                </span>
                {errorCount > 0 && (
                  <span className="text-status-danger font-semibold flex items-center gap-1">
                    <AlertCircle size={12} /> {errorCount} Invalid
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto border border-border-subtle rounded-lg">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-surface-secondary text-fg-muted sticky top-0 border-b border-border-subtle font-semibold">
                  <tr>
                    <th className="py-1.5 px-2">Code</th>
                    <th className="py-1.5 px-2">Title</th>
                    <th className="py-1.5 px-1">Sec</th>
                    <th className="py-1.5 px-1">Day</th>
                    <th className="py-1.5 px-2">Time</th>
                    <th className="py-1.5 px-2">Room</th>
                    <th className="py-1.5 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {parsedRows.map((r) => (
                    <tr
                      key={r.id}
                      className={r.isValid ? 'hover:bg-surface-secondary/40' : 'bg-status-danger-surface/40'}
                    >
                      <td className="py-1.5 px-2 font-bold font-mono text-fg">{r.course_code}</td>
                      <td className="py-1.5 px-2 truncate max-w-[120px] text-fg-secondary">{r.course_title}</td>
                      <td className="py-1.5 px-1 font-mono">{r.section_code}</td>
                      <td className="py-1.5 px-1 font-mono">D{r.day_of_week}</td>
                      <td className="py-1.5 px-2 font-mono">{r.start_time}-{r.end_time}</td>
                      <td className="py-1.5 px-2 text-fg-muted">{r.room || '—'}</td>
                      <td className="py-1.5 px-2">
                        {r.isValid ? (
                          <span className="text-status-success font-medium">Ready</span>
                        ) : (
                          <span className="text-status-danger font-medium">{r.error}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleCommit}
            disabled={validCount === 0 || isSubmitting}
            isLoading={isSubmitting}
          >
            Import {validCount} Offerings
          </Button>
        </div>
      </div>
    </Modal>
  );
};
