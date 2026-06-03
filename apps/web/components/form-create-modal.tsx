"use client"

import React from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { useForm } from "react-hook-form"
import { useCreateForm } from "~/hooks/api/form"

type FormValues = {
  title: string
  description?: string
}

export function FormCreateModal() {
  const [open, setOpen] = React.useState(false)
  const { createFormAsync, isLoading } = useCreateForm()

  const { register, handleSubmit, reset } = useForm<FormValues>()

  async function onSubmit(values: FormValues) {
    try {
      await createFormAsync(values)
      reset()
      setOpen(false)
    } catch (err) {
      // swallow; mutation exposes error to caller if needed
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">New Form</Button>
      </DialogTrigger>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Create Form</DialogTitle>
            <DialogDescription>Add a title and optional description for the form.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Title</label>
            <Input {...register("title", { required: true, maxLength: 55 })} />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Description</label>
            <Input {...register("description", { maxLength: 255 })} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default FormCreateModal
