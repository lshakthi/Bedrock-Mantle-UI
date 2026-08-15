import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AppLayoutCS from '@cloudscape-design/components/app-layout';
import SideNavigation from '@cloudscape-design/components/side-navigation';
import TopNavigation from '@cloudscape-design/components/top-navigation';
import { TierSwitcher } from '@/components/shared/TierSwitcher';
import { PromotionBanner } from '@/components/shared/PromotionBanner';
import { AiAssistant } from '@/components/shared/AiAssistant';

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { type: 'link' as const, text: 'Model catalog', href: '/model-catalog' },
    { type: 'link' as const, text: 'Projects', href: '/projects' },
    { type: 'link' as const, text: 'Code samples', href: '/code-samples' },
    { type: 'link' as const, text: 'Errors', href: '/errors' },
    { type: 'link' as const, text: 'Quotas and pricing', href: '/quotas-pricing' },
  ];

  return (
    <>
      <TopNavigation
        identity={{
          href: '/',
          title: 'Amazon Bedrock',
        }}
        utilities={[
          {
            type: 'menu-dropdown',
            text: 'View settings',
            items: [],
            // TierSwitcher renders in the header area below
          },
        ]}
      />
      <AppLayoutCS
        headerSelector="#top-nav"
        navigation={
          <SideNavigation
            activeHref={location.pathname}
            header={{ href: '/', text: 'Bedrock Mantle' }}
            items={navItems}
            onFollow={(e) => {
              e.preventDefault();
              navigate(e.detail.href);
            }}
          />
        }
        notifications={<PromotionBanner />}
        content={
          <>
            <TierSwitcher />
            <Outlet />
            <AiAssistant />
          </>
        }
        toolsHide={true}
      />
    </>
  );
}
