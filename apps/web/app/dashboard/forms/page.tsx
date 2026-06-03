import { AppSidebar } from "~/components/app-sidebar"
import { SiteHeader } from "~/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "~/components/ui/sidebar"
import FormCreateModal from "~/components/form-create-modal"

export default function Page() {
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
          {/* Left / main column: reuse dashboard structure for now */}
          <div className="flex-1 flex flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {/* Keep same spacing and placeholders as dashboard; content can be filled later */}
                <div className="px-4 lg:px-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Forms</h2>
                    <p className="text-sm text-muted-foreground">List of forms will appear here.</p>
                  </div>
                  <FormCreateModal />
                </div>
              </div>
            </div>
          </div>

          {/* Right column: empty for now */}
          <aside className="hidden w-80 flex-col md:flex">
            <div className="p-4">{/* intentionally left empty for future content */}</div>
          </aside>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
