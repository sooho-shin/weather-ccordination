if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.jpg'] = (module) => {
    module.exports = 'mock-asset.jpg';
  };
  require.extensions['.png'] = (module) => {
    module.exports = 'mock-asset.png';
  };
}
