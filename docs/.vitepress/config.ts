import { DefaultTheme, defineConfig } from 'vitepress'

function getBaseSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Base',
      items: [
        {
          text: 'Introduction',
          link: '/base/'
        },
        {
          text: 'Depedeny Injection',
          link: '/base/dependency-injection'
        }
      ]
    }
  ]
}

function getServiceSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Services',
      items: [
        {
          text: 'Introduction',
          link: '/services/'
        },
        {
          text: 'Platform References',
          items: [
            {
              text: 'Instantiation',
              link: '/services/platform/instantiation'
            }
          ]
        }
      ]
    }
  ]
}
function getEditorSideBar(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Editor',
      collapsed: false,
      items: [
        {
          text: 'Introduction',
          link: '/editor/',
        }
      ]
    },
    {
      text: 'Commands',
      collapsed: false,
      items: [
        {
          text: 'Shift Command',
          link: '/editor/commands/shiftCommand'
        }
      ]

    },
    {
      text: 'Utils',
      collapsed: false,
      items: [
        {
          text: 'Code Editor',
          link: '/editor/utils/codeEditor'
        }
      ]
    }
  ]
}
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Code Architecture",
  description: "A easy way to learn code architecture",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Base', link: '/base/', activeMatch: '/base/' },
      { text: 'Editor', link: '/editor/', activeMatch: '/editor/' },
      { text: 'Services', link: '/services/', activeMatch: '/services/' },
    ],

    sidebar: {
      '/base': getBaseSidebar(),
      '/services': getServiceSidebar(),
      '/editor': getEditorSideBar()
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hipotecas/code' }
    ],
    editLink: {
      pattern: 'https://github.com/hipotecas/code/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
  }
})
