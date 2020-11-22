import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import pkg from './package.json';

const dependencies = Object.keys(pkg.dependencies);

export default [
  {
    input: 'src/index.js',
    external: (id) => {
        if (dependencies.includes(id)) {
          return true;
        }

        if (id === 'ajv/lib/compile/equal') {
          // This module just requires 'fast-deep-equal'.
          // By inlining it we can break the dependency on ajv.
          return false;
        }

        if (id.startsWith('ajv')) {
          throw new Error('AJV is now a required dependency again. Adjust the dependencies and this code.');
        }

        return id.startsWith('lodash');
    },
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
    ],
    plugins: [
      commonjs(),
      nodeResolve(),
      babel({
        babelHelpers: 'bundled',
        exclude: ['node_modules/**'],
      })
    ],
  }
];
