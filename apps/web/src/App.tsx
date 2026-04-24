import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PortfolioIndex  from './pages/portfolinho/Index'
import TemplateEditor  from './pages/portfolinho/TemplateEditor'
import StudentView     from './pages/portfolinho/StudentView'
import AssessmentView  from './pages/portfolinho/AssessmentView'
import NotFound        from './pages/NotFound'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/"                   element={<Navigate to="/portfolinho" replace />} />
            <Route path="/portfolinho"         element={<PortfolioIndex />} />
            <Route path="/portfolinho/teacher" element={<TemplateEditor />} />
            <Route path="/portfolinho/student" element={<StudentView />} />
            <Route path="/portfolinho/assess"  element={<AssessmentView />} />
            <Route path="*"                   element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
