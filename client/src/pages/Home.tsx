import React, { useState } from 'react'

interface Subject {
  id: string
  name: string
  grade: string
}

const Home = () => {
  const [subjectInput, setSubjectInput] = useState('')
  const [subjects, setSubjects] = useState<Subject[]>([])

  const handleAddSubject = () => {
    if (!subjectInput.trim()) return
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name: subjectInput.trim(),
      grade: '',
    }
    setSubjects((prev) => [...prev, newSubject])
    setSubjectInput('')
  }

  const handleGradeChange = (id: string, value: string) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade: value } : s))
    )
  }

  const handleRemoveSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id))
  }

  const handleCompute = () => {
    // TODO: implement GWA computation logic
  }

  return (
    <div className="min-h-screen w-full bg-[#101826] flex justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] tracking-[0.25em] text-[#C9A24B] uppercase mb-1">
            Report Sheet
          </p>
          <h1 className="text-[#EDEAE0] text-3xl font-serif tracking-tight">
            GWA Calculator
          </h1>
          <p className="text-[#8D96A8] text-sm mt-1">
            Add your subjects, then key in your grades.
          </p>
        </div>

        {/* Add subject row */}
        <div className="mb-6">
          <label className="text-[11px] tracking-[0.15em] text-[#8D96A8] uppercase mb-2 block">
            Name Subject
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g. Physics"
              className="flex-1 bg-[#1B2536] border border-[#2C3648] rounded-lg px-3 py-2.5 text-[#EDEAE0] placeholder:text-[#5C6579] text-sm outline-none focus:border-[#C9A24B] transition-colors"
            />
            <button
              onClick={handleAddSubject}
              className="shrink-0 bg-[#C9A24B] text-[#101826] font-medium text-sm px-4 rounded-lg active:scale-95 transition-transform"
            >
              Add
            </button>
          </div>
        </div>

        {/* Subjects ledger */}
        {subjects.length > 0 && (
          <div className="mb-6 bg-[#1B2536] border border-[#2C3648] rounded-xl overflow-hidden">
            {subjects.map((subject, index) => (
              <div
                key={subject.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  index !== subjects.length - 1
                    ? 'border-b border-dashed border-[#2C3648]'
                    : ''
                }`}
              >
                <span className="text-[#C9A24B]/60 font-mono text-xs w-5 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span className="flex-1 text-[#EDEAE0] text-sm font-serif truncate">
                  {subject.name}
                </span>

                <input
                  type="text"
                  inputMode="decimal"
                  value={subject.grade}
                  onChange={(e) => handleGradeChange(subject.id, e.target.value)}
                  placeholder="—"
                  className="w-14 bg-transparent border border-[#2C3648] rounded-md px-2 py-1.5 text-center text-[#EDEAE0] font-mono text-sm placeholder:text-[#5C6579] outline-none focus:border-[#C9A24B] transition-colors"
                />

                <button
                  onClick={() => handleRemoveSubject(subject.id)}
                  className="text-[#5C6579] hover:text-[#C9A24B] text-xs shrink-0 transition-colors"
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
          <div className="mb-6 border border-dashed border-[#2C3648] rounded-xl px-4 py-8 text-center">
            <p className="text-[#5C6579] text-sm">
              No subjects yet. Add one above to get started.
            </p>
          </div>
        )}

        {/* Compute button */}
        {subjects.length > 0 && (
          <button
            onClick={handleCompute}
            className="w-full flex items-center justify-center gap-2 bg-[#C9A24B] text-[#101826] font-medium text-sm tracking-wide uppercase py-3.5 rounded-full active:scale-[0.98] transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-[#101826]" />
            Compute GWA
          </button>
        )}
      </div>
    </div>
  )
}

export default Home