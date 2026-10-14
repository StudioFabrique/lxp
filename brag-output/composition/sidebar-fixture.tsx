/** Offline markup from the application's actual navigation component/config. */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import { writeFileSync } from 'node:fs';
import SidebarItem from '../../front/src/components/sidebar/SidebarItem';
import { sidebarItems } from '../../front/src/config/sidebarItems';

const navigation: Record<string, string> = {};
for (const layout of ['student', 'admin'] as const) {
  navigation[layout] = renderToStaticMarkup(
    <MemoryRouter initialEntries={[`/${layout}/dashboard`]}>
      <ul className="dashboard-navigation">
        {sidebarItems[layout].map(item => (
          <SidebarItem key={item.key} currentRoute={[layout, 'dashboard']} itemPath={item.path}
            linkTo={`/${layout}/${item.path}`} icon={React.createElement(item.icon)} tooltipText={item.label}>
            {item.label}
          </SidebarItem>
        ))}
      </ul>
    </MemoryRouter>,
  ).replace(/href="([^"]+)"/g, 'data-app-route="$1"');
}
writeFileSync(new URL('./assets/sidebar-fragments.json', import.meta.url), JSON.stringify(navigation, null, 2));
