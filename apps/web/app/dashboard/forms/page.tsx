"use client"

import React, { useEffect, useState } from "react"
import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"
import FormCreateModal from "~/components/form-create-modal"
import { useListForms } from "~/hooks/api/form"

export default function Page() {
  const { forms, isLoading, isFetching } = useListForms()
  const formatDate = (v: any) => {
    if (!v) return ""
    if (v instanceof Date) return v.toLocaleDateString()
    try {
      return new Date(v).toLocaleDateString()
    } catch {
      return ""
    }
  }
  const [selectedForm, setSelectedForm] = useState<typeof forms extends (infer U)[] ? U : any | null>(null)

  useEffect(() => {
    // if URL contains an id, try to select it from loaded forms
    if (!forms || forms.length === 0) return
    try {
      const pathname = typeof window !== "undefined" ? window.location.pathname : ""
      // if path ends with /dashboard/forms or /dashboard/forms/ clear selection
      if (pathname === "/dashboard/forms" || pathname === "/dashboard/forms/") {
        setSelectedForm(null)
        return
      }
      const parts = pathname.split("/")
      const id = parts.length ? parts[parts.length - 1] : null
      if (id) {
        const found = forms.find((f: any) => f.id === id)
        if (found) setSelectedForm(found)
      }
    } catch {
      // ignore
    }
  }, [forms])

  const handleSelect = (form: any) => {
    setSelectedForm(form)
    if (typeof window !== "undefined") {
      // update URL without triggering a Next navigation
      try {
        window.history.pushState({}, "", `/dashboard/forms/${form.id}`)
      } catch {
        // ignore
      }
    }
  }
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        <div className="flex flex-1 gap-4">
          {/* Main column */}
          <div className="flex-1 flex flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedForm ? "Form Builder" : "Forms"}</h2>
                    <p className="text-sm text-muted-foreground">{selectedForm ? "" : "List of forms will appear here."}</p>
                  </div>
                  <FormCreateModal />
                </div>

                <div className="px-4 lg:px-6">
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading forms...</p>
                  ) : !forms || forms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No forms yet. Create one to get started.</p>
                  ) : selectedForm ? (
                    // Form Builder replaces list entirely when selected
                    <div className="mt-4">
                      <div className="rounded-md border p-6">
                        <h3 className="text-lg font-semibold">{selectedForm.title}</h3>
                        {selectedForm.description ? (
                          <p className="text-sm text-muted-foreground mt-2">{selectedForm.description}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">No description</p>
                        )}
                        {/* rest intentionally empty for now */}
                      </div>
                    </div>
                  ) : (
                    // List view (default)
                    <ul className="mt-4 space-y-3">
                      {forms.map((form) => (
                        <li
                          key={form.id}
                          className={`rounded-md border p-3 hover:shadow-sm ${selectedForm?.id === form.id ? "bg-muted" : ""}`}
                        >
                          <button
                            onClick={() => handleSelect(form)}
                            className="w-full text-left block"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{form.title}</p>
                                {form.description ? (
                                  <p className="text-sm text-muted-foreground">{form.description}</p>
                                ) : null}
                              </div>
                              <div className="text-sm text-muted-foreground">{formatDate(form.createdAt)}</div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
