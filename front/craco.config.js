module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'react-transition-group/TransitionGroupContext':
          'react-transition-group/TransitionGroupContext.js',
      };
      return webpackConfig;
    },
  },
};
