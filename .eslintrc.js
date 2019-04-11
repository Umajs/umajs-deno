module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: [
        'typescript',
        '@typescript-eslint',
    ],
    extends: ['airbnb-base'],
    rules: {
        // allow debugger during development
        'linebreak-style': 0,
        'indent': [2, 4, {
            'SwitchCase': 1
        }],
        'max-len': [2, {'code': 160, 'ignoreUrls': true}],
        'radix': ['error', 'as-needed'],
        'object-shorthand': ['error', 'methods'],
        'no-unused-expressions': ["error", {
            "allowShortCircuit": true
        }],
        'no-bitwise': ['error', {
            'allow': ['~']
        }],
        'import/no-unresolved': 0,
        'import/prefer-default-export': 0,
        'import/no-dynamic-require': 0,
        'object-curly-newline': 0,
        'consistent-return': 0,
        'no-unused-vars': 0,
        '@typescript-eslint/no-unused-vars': 2,
        'no-restricted-syntax': 0,
        'no-param-reassign': 0,
        'no-return-await': 0,
        'no-use-before-define': 0,
        'no-await-in-loop': 0,
        'no-plusplus': 0,
        'no-debugger': 0,
        'no-console': 0,
        'no-bitwise': 0,
    }
}