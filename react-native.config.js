module.exports = {
  assets: ['./src/assets/fonts/'],
  getTransformModulePath() {
    return require.resolve('react-native-svg-transformer');
  },
  getSourceExts() {
    return ['js', 'jsx', 'ts', 'tsx', 'svg'];
  },
};
