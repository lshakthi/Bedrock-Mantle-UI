import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProficiencyCtx, useProficiencyProvider } from '@/hooks/useProficiency';
import { AppLayout } from '@/components/layout/AppLayout';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { ModelCatalogPage } from '@/pages/ModelCatalogPage';
import { ProjectViewPage } from '@/pages/ProjectViewPage';
import { CodeSamplesPage } from '@/pages/CodeSamplesPage';
import { ErrorsPage } from '@/pages/ErrorsPage';
import { QuotasPricingPage } from '@/pages/QuotasPricingPage';
import { PlaygroundPage } from '@/pages/PlaygroundPage';
import { UsageDashboardPage } from '@/pages/UsageDashboardPage';

export function App() {
  const proficiency = useProficiencyProvider();

  return (
    <ProficiencyCtx.Provider value={proficiency}>
      <BrowserRouter>
        {!proficiency.state.onboardingComplete ? (
          <Routes>
            <Route path="*" element={<OnboardingPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/model-catalog" replace />} />
              <Route path="/model-catalog" element={<ModelCatalogPage />} />
              <Route path="/playground" element={<PlaygroundPage />} />
              <Route path="/projects" element={<ProjectViewPage />} />
              <Route path="/usage" element={<UsageDashboardPage />} />
              <Route path="/code-samples" element={<CodeSamplesPage />} />
              <Route path="/errors" element={<ErrorsPage />} />
              <Route path="/quotas-pricing" element={<QuotasPricingPage />} />
            </Route>
          </Routes>
        )}
      </BrowserRouter>
    </ProficiencyCtx.Provider>
  );
}
