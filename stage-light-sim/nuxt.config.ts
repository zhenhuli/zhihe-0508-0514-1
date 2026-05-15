export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    'materialize-css/dist/css/materialize.min.css',
    '~/assets/styles/main.css'
  ],
  app: {
    head: {
      title: '舞台灯光模拟器',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    }
  }
})
