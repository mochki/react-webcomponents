import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx',
];

export default {
  external: ['react'],
  input: './src/index.ts',
  plugins: [
    // Allows node_modules resolution
    resolve({ extensions }),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs(),

    babel({
      extensions,
      include: ["src/**/*"],
      runtimeHelpers: true,
      sourceMaps: 'inline'
    })
  ],
  output: [{
    file: pkg.main,
    format: 'cjs',
  }],
};
