const nodelibs = require('node-libs-react-native');
nodelibs.vm = require.resolve('vm-browserify');

module.exports = {
  resolver: {
    extraNodeModules: nodelibs,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
