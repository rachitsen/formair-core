"use client"

import React, { useEffect, useState } from "react"
import { useListForms } from "~/hooks/api/form"

export default function FormBuilderClient({ id }: { id: string }) {
  const { forms, isLoading } = useListForms()
  const [form, setForm] = useState<any | null>(null)

  useEffect(() => {
    if (!forms) return
    const found = forms.find((f: any) => f.id === id)
    setForm(found || null)
  }, [forms, id])

  const formatDate = (v: any) => {
    if (!v) return ""
    if (v instanceof Date) return v.toLocaleDateString()
    try {
      return new Date(v).toLocaleDateString()
    } catch {
      return ""
    }
  }

  return (
    <>
      <div className="px-4 lg:px-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Form Builder</h2>
          <p className="text-sm text-muted-foreground">{form ? "" : ""}</p>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : form ? (
          <div className="mt-4 rounded-md border p-6">
            <h3 className="text-lg font-semibold">{form.title}</h3>
            {form.description ? (
              <p className="text-sm text-muted-foreground mt-2">{form.description}</p>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">No description</p>
            )}
            <p className="text-sm text-muted-foreground mt-4">Form ID: {form.id}</p>
            <p className="text-sm text-muted-foreground">Created: {formatDate(form.createdAt)}</p>
            {/* rest intentionally empty */}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Form not found.</p>
        )}
      </div>
    </>
  )
}
