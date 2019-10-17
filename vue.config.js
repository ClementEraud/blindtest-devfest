module.exports = {
  chainWebpack: config => {
    config.module.rule('vue').use('vue-loader').tap(options => {
      options.transformToRequire = { 
        img: 'src',
        image: 'xlink:href',
        'audio': 'src' 
      }
    });
  }
};