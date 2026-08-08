import { useState, useEffect } from 'react'

interface Subject {
  id: string
  name: string
  units: string
  grade: string
}

type Theme = 'dark' | 'light'

interface GradeRemark {
  label: string
  passed: boolean
}

const GRADING_SYSTEM = [
  { range: '1.00', label: 'Excellent' },
  { range: '1.25 - 1.75', label: 'Very Good' },
  { range: '2.00 - 2.50', label: 'Satisfactory' },
  { range: '2.75 - 3.00', label: 'Fair' },
  { range: '5.00', label: 'Failed' },
]

const getRemark = (gwa: number): GradeRemark => {
  if (gwa <= 1.0) return { label: 'Excellent', passed: true }
  if (gwa <= 1.75) return { label: 'Very Good', passed: true }
  if (gwa <= 2.5) return { label: 'Satisfactory', passed: true }
  if (gwa <= 3.0) return { label: 'Fair', passed: true }
  return { label: 'Failed', passed: false }
}

const Home = () => {
  const [theme, setTheme] = useState<Theme>('dark')
  const [subjectInput, setSubjectInput] = useState('')
  const [unitsInput, setUnitsInput] = useState('')
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [gwaResult, setGwaResult] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [showGuide, setShowGuide] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('gwa-theme')
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved)
    }
  }, [])

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('gwa-theme', next)
  }

  const handleAddSubject = () => {
    if (!subjectInput.trim() || !unitsInput.trim()) return
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name: subjectInput.trim(),
      units: unitsInput.trim(),
      grade: '',
    }
    setSubjects((prev) => [...prev, newSubject])
    setSubjectInput('')
    setUnitsInput('')
    setGwaResult(null)
    setError('')
  }

  const handleGradeChange = (id: string, value: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade: value } : s))
    )
    setGwaResult(null)
    setError('')
  }

  const handleRemoveSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
    setGwaResult(null)
    setError('')
  }

  const handleCompute = () => {
    setError('')
    setGwaResult(null)

    if (subjects.length === 0) {
      setError('Add at least one subject first.')
      return
    }

    let weightedSum = 0
    let totalUnits = 0

    for (const subject of subjects) {
      const trimmedGrade = subject.grade.trim()
      if (!trimmedGrade) {
        setError(`Missing grade for "${subject.name}".`)
        return
      }

      const grade = Number(trimmedGrade)
      if (Number.isNaN(grade)) {
        setError(`Invalid grade for "${subject.name}".`)
        return
      }

      const units = Number(subject.units)
      if (Number.isNaN(units) || units <= 0) {
        setError(`Invalid units for "${subject.name}".`)
        return
      }

      weightedSum += grade * units
      totalUnits += units
    }

    const average = weightedSum / totalUnits
    setGwaResult(Number(average.toFixed(2)))
  }

  const remark = gwaResult !== null ? getRemark(gwaResult) : null

  return (
    <div
      className={`${theme} min-h-screen w-full max-w-full overflow-x-hidden bg-(--bg) flex justify-center px-4 py-10 transition-colors duration-300 box-border`}
    >
      <div className="w-full max-w-sm min-w-0">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] tracking-[0.25em] text-(--accent) uppercase mb-1">
              Report Sheet
            </p>
            <h1 className="text-(--text) text-3xl font-serif tracking-tight flex flex-wrap items-baseline gap-x-2">
              <span>GWA Calculator</span>
              <span className="text-(--text) text-xs tracking-wide font-sans opacity-80 whitespace-nowrap">
                By Tristhan
              </span>
            </h1>
            <p className="text-(--muted) text-sm mt-1">
              Add your subjects and units, then enter your grades.
            </p>
          </div>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light mode"
            className="shrink-0 w-9 h-9 rounded-full border border-(--border) bg-(--card) flex items-center justify-center text-(--text) active:scale-90 transition-transform"
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        {/* Grading system guide toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowGuide((prev) => !prev)}
            className="text-[11px] tracking-[0.15em] text-(--accent) uppercase flex items-center gap-1"
          >
            Grading System
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className={`transition-transform ${showGuide ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          {showGuide && (
            <div className="mt-2 bg-(--card) border border-(--border) rounded-lg px-3 py-3 flex flex-wrap gap-x-4 gap-y-2">
              {GRADING_SYSTEM.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="text-(--accent) shrink-0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-(--text) text-xs font-mono">{item.range}</span>
                  <span className="text-(--muted) text-xs">({item.label})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add subject row */}
        <div className="mb-6">
          <label className="text-[11px] tracking-[0.15em] text-(--muted) uppercase mb-2 block">
            Name Subject
          </label>
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g. Physics"
              className="w-full min-w-0 box-border bg-(--card) border border-(--border) rounded-lg px-3 py-2.5 text-(--text) placeholder:text-(--placeholder) text-base outline-none focus:border-(--accent) transition-colors"
            />
            <div className="flex gap-2 w-full">
              <input
                type="text"
                inputMode="decimal"
                value={unitsInput}
                onChange={(e) => setUnitsInput(e.target.value)}
                placeholder="Units"
                className="w-20 shrink-0 min-w-0 box-border bg-(--card) border border-(--border) rounded-lg px-2 py-2.5 text-(--text) placeholder:text-(--placeholder) text-base text-center outline-none focus:border-(--accent) transition-colors"
              />
              <button
                onClick={handleAddSubject}
                className="flex-1 min-w-0 box-border bg-(--accent) text-(--accent-contrast) font-medium text-sm px-3 rounded-lg active:scale-95 transition-transform"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>

        {/* Subjects ledger */}
        {subjects.length > 0 && (
          <div className="mb-6 bg-(--card) border border-(--border) rounded-xl overflow-hidden">
            {subjects.map((subject, index) => (
              <div
                key={subject.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  index !== subjects.length - 1
                    ? 'border-b border-dashed border-(--border)'
                    : ''
                }`}
              >
                <span className="text-(--accent)/60 font-mono text-xs w-5 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="flex-1 min-w-0">
                  <span className="block text-(--text) text-sm font-serif truncate">
                    {subject.name}
                  </span>
                  <span className="block text-(--muted) text-[11px] font-mono mt-0.5">
                    {Number(subject.units).toFixed(2)} unit{subject.units === '1' ? '' : 's'}
                  </span>
                </div>

                <input
                  type="text"
                  inputMode="decimal"
                  value={subject.grade}
                  onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                  placeholder="—"
                  className="w-16 shrink-0 min-w-0 box-border bg-transparent border border-(--border) rounded-md px-1 py-1.5 text-center text-(--text) font-mono text-base placeholder:text-(--placeholder) outline-none focus:border-(--accent) transition-colors"
                />

                <button
                  onClick={() => handleRemoveSubject(subject.id)}
                  className="text-(--placeholder) hover:text-(--accent) text-xs shrink-0 transition-colors"
                  aria-label="Remove subject"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {subjects.length === 0 && (
          <div className="mb-6 border border-dashed border-(--border) rounded-xl px-4 py-8 text-center">
            <p className="text-(--placeholder) text-sm">
              No subjects yet. Add one above to get started.
            </p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 border border-(--error-border) bg-(--error-bg) rounded-lg px-3 py-2.5">
            <p className="text-(--error-text) text-xs">{error}</p>
          </div>
        )}

        {/* Compute button */}
        {subjects.length > 0 && (
          <button
            onClick={handleCompute}
            className="w-full flex items-center justify-center gap-2 bg-(--accent) text-(--accent-contrast) font-medium text-sm tracking-wide uppercase py-3.5 rounded-full active:scale-[0.98] transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-(--accent-contrast)" />
            Compute GWA
          </button>
        )}

        {/* Result */}
        {gwaResult !== null && remark && (
          <div className="mt-6 bg-(--card) border border-(--accent)/40 rounded-xl px-4 py-6 text-center">
            <p className="text-[11px] tracking-[0.2em] text-(--muted) uppercase mb-2">
              Your GWA
            </p>
            <p className="text-(--text) text-4xl font-serif tracking-tight">
              {gwaResult}
            </p>

            <div
              className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 ${
                remark.passed
                  ? 'bg-[#4C9A6A]/15 text-[#4C9A6A]'
                  : 'bg-[#C9575A]/15 text-[#E19194]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  remark.passed ? 'bg-[#4C9A6A]' : 'bg-[#E19194]'
                }`}
              />
              <span className="text-xs font-medium tracking-wide uppercase">
                {remark.passed ? 'Passed' : 'Failed'} · {remark.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home