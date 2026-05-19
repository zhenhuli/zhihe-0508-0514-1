const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const detectPort = require('detect-port');

module.exports = async () => {
  const DEFAULT_PORT = 3000;
  const port = await detectPort(DEFAULT_PORT);

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ],
    devServer: {
      port: port,
      open: true,
      historyApiFallback: true,
      hot: true,
      client: {
        overlay: true
      }
    }
  };
};
