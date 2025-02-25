module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/controllers/**/*.js',
        'src/routes/**/*.js',
        'src/middlewares/**/*.js',
        'src/schemas/**/*.js',
        'src/loaders/**/*.js',
        'src/models/**/*.js',
        'src/index.js',
        'src/app.js'
    ],
    coverageReporters: ['json', 'lcov', 'text-summary', 'clover'],
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        },
        './src/controllers/': {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        },
        './src/routes/': {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        },
        './src/middlewares/': {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        },
        './src/models/': {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        },
        './src/schemas/': {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        },
        './src/loaders/': {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        }
    }
};
