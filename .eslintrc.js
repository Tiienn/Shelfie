module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: ['./tsconfig.json', './client/tsconfig.json', './server/tsconfig.json', './shared/tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/prefer-const': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    
    // General rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'template-curly-spacing': 'error',
    'arrow-spacing': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'eol-last': 'error',
    'no-trailing-spaces': 'error',
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
    'func-call-spacing': ['error', 'never'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'no-spaced-func': 'error',
    'space-before-blocks': 'error',
    'space-in-parens': ['error', 'never'],
    'spaced-comment': ['error', 'always'],
    
    // Security rules
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-script-url': 'error',
    'no-alert': 'error',
  },
  overrides: [
    // Client-specific rules
    {
      files: ['client/**/*.{ts,tsx,js,jsx}'],
      env: {
        browser: true,
        es6: true,
      },
      extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
      ],
      plugins: [
        'react',
        'react-hooks',
        'jsx-a11y',
      ],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {
        // React specific rules
        'react/react-in-jsx-scope': 'off', // Not needed with React 17+
        'react/prop-types': 'off', // Using TypeScript for prop validation
        'react/jsx-uses-react': 'off', // Not needed with React 17+
        'react/jsx-uses-vars': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-wrap-multilines': 'error',
        'react/jsx-closing-bracket-location': 'error',
        'react/jsx-closing-tag-location': 'error',
        'react/jsx-curly-spacing': ['error', 'never'],
        'react/jsx-equals-spacing': ['error', 'never'],
        'react/jsx-first-prop-new-line': ['error', 'multiline'],
        'react/jsx-indent': ['error', 2],
        'react/jsx-indent-props': ['error', 2],
        'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
        'react/jsx-no-duplicate-props': 'error',
        'react/jsx-no-unused-vars': 'error',
        'react/jsx-pascal-case': 'error',
        'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
        'react/self-closing-comp': 'error',
        
        // React Hooks rules
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        
        // Accessibility rules
        'jsx-a11y/alt-text': 'error',
        'jsx-a11y/anchor-has-content': 'error',
        'jsx-a11y/anchor-is-valid': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-proptypes': 'error',
        'jsx-a11y/aria-unsupported-elements': 'error',
        'jsx-a11y/heading-has-content': 'error',
        'jsx-a11y/img-redundant-alt': 'error',
        'jsx-a11y/mouse-events-have-key-events': 'error',
        'jsx-a11y/no-access-key': 'error',
        'jsx-a11y/no-distracting-elements': 'error',
        'jsx-a11y/role-has-required-aria-props': 'error',
        'jsx-a11y/role-supports-aria-props': 'error',
      },
    },
    
    // Server-specific rules
    {
      files: ['server/**/*.{ts,js}'],
      env: {
        node: true,
        es2022: true,
      },
      rules: {
        // Node.js specific rules
        'no-process-env': 'off', // We use process.env for configuration
        'no-process-exit': 'off', // Sometimes needed for graceful shutdown
      },
    },
    
    // Test files
    {
      files: ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}', '**/tests/**/*.{ts,tsx,js,jsx}'],
      env: {
        jest: true,
      },
      extends: [
        'plugin:jest/recommended',
      ],
      plugins: ['jest'],
      rules: {
        // Jest specific rules
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
        
        // Allow console in tests
        'no-console': 'off',
      },
    },
    
    // Configuration files
    {
      files: ['*.config.{ts,js}', '.*rc.{ts,js}'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '*.min.js',
    'public/',
    '.next/',
    '*.d.ts',
  ],
};