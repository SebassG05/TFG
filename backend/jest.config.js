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
    coverageReporters: ['json', 'lcov', 'text', 'clover']
};
