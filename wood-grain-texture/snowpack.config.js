module.exports = {
  mount: {
    public: '/',
    src: '/_dist_'
  },
  plugins: [
    'snowpack-plugin-less'
  ],
  buildOptions: {
    out: 'dist'
  },
  devOptions: {
    open: 'none'
  }
};
