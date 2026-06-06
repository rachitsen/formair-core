"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useListForms, useGetFields, useCreateField, useUpdateField, useDeleteField } from "~/hooks/api/form"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog"

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD" | "DATE"

const FIELD_TYPES: FieldType[] = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD", "DATE"]

export default function FormBuilderClient({ id }: { id: string }) {
  const { forms, isLoading: formsLoading } = useListForms()
  const { fields, isLoading: fieldsLoading } = useGetFields(id)

  const createFieldHook = useCreateField(id)
  const updateFieldHook = useUpdateField(id)
  const deleteFieldHook = useDeleteField(id)

  const [form, setForm] = useState<any | null>(null)
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)

  const [values, setValues] = useState({
    label: "",
    type: "TEXT" as FieldType,
    description: "",
    placeholder: "",
    isRequired: false,
  })

  useEffect(() => {
    if (!forms) return
    const found = forms.find((f: any) => f.id === id)
    setForm(found || null)
  }, [forms, id])

  useEffect(() => {
    if (editing) {
      setValues({
        label: editing.label ?? "",
        type: (editing.type as FieldType) ?? "TEXT",
        description: editing.description ?? "",
        placeholder: editing.placeholder ?? "",
        isRequired: !!editing.isRequired,
      })
    } else {
      setValues({ label: "", type: "TEXT", description: "", placeholder: "", isRequired: false })
    }
  }, [editing])

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (f: any) => {
    setEditing(f)
    setDialogOpen(true)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editing) {
        await updateFieldHook.updateFieldAsync({ fieldId: editing.id, ...values })
      } else {
        await createFieldHook.createFieldAsync({ formId: id, ...values })
      }
      setDialogOpen(false)
      setEditing(null)
    } catch (err) {
      console.error(err)
    }
  }

  const onDelete = async (fieldId: string) => {
    if (!confirm("Delete this field?")) return
    try {
      await deleteFieldHook.deleteFieldAsync({ fieldId })
    } catch (err) {
      console.error(err)
    }
  }

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
          <p className="text-sm text-muted-foreground">{form ? form.title : ""}</p>
        </div>
        <div>
          <Button onClick={openCreate}>New Field</Button>
        </div>
      </div>

      <div className="px-4 lg:px-6 mt-4">
        {formsLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !form ? (
          <p className="text-sm text-muted-foreground">Form not found.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border p-6">
              <h3 className="text-lg font-semibold">{form.title}</h3>
              {form.description ? (
                <p className="text-sm text-muted-foreground mt-2">{form.description}</p>
              ) : (
                <p className="text-sm text-muted-foreground mt-2">No description</p>
              )}
              <p className="text-sm text-muted-foreground mt-4">Form ID: {form.id}</p>
              <p className="text-sm text-muted-foreground">Created: {formatDate(form.createdAt)}</p>
            </div>

            <div className="rounded-md border p-6">
              <h4 className="font-medium mb-4">Fields</h4>
              {fieldsLoading ? (
                <p className="text-sm text-muted-foreground">Loading fields…</p>
              ) : !fields || fields.length === 0 ? (
                <p className="text-sm text-muted-foreground">No fields yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {fields.map((f: any) => (
                    <div key={f.id} className="flex items-center justify-between gap-4 rounded-md border p-3">
                      <div>
                        <div className="font-medium">{f.label}</div>
                        <div className="text-sm text-muted-foreground">{f.type} • {f.placeholder ?? ""}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => openEdit(f)}>Edit</Button>
                        <Button variant="destructive" onClick={() => onDelete(f.id)}>Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Field" : "Create Field"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={onSubmit} className="grid gap-3">
            <label className="text-sm">Label</label>
            <Input value={values.label} onChange={(e) => setValues((s) => ({ ...s, label: e.target.value }))} />

            <label className="text-sm">Type</label>
            <select value={values.type} onChange={(e) => setValues((s) => ({ ...s, type: e.target.value as FieldType }))} className="h-9 rounded-md border px-3">
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            <label className="text-sm">Description</label>
            <Textarea value={values.description} onChange={(e) => setValues((s) => ({ ...s, description: e.target.value }))} />

            <label className="text-sm">Placeholder</label>
            <Input value={values.placeholder} onChange={(e) => setValues((s) => ({ ...s, placeholder: e.target.value }))} />

            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={values.isRequired} onChange={(e) => setValues((s) => ({ ...s, isRequired: e.target.checked }))} />
              <span className="text-sm">Required</span>
            </label>

            <DialogFooter>
              <Button type="submit" disabled={createFieldHook.status === "pending" || updateFieldHook.status === "pending"}>{editing ? "Update" : "Create"}</Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
