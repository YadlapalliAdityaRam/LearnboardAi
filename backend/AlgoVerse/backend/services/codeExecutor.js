const axios = require('axios');
const { spawn } = require('child_process');

class CodeExecutor {
    constructor() {
        this.apiUrl = process.env.JUDGE0_API_URL;
        this.apiKey = process.env.JUDGE0_API_KEY;

        this.languageIds = {
            javascript: 63,
            python: 71, // python 3
            java: 62,
            cpp: 54,
            c: 50
        };
    }

    async executeCode(code, language, input = '') {
        // Prefer local execution for supported languages if no API key or explicitly preferred
        // Prefer local execution for supported languages if no API key or explicitly preferred
        if (['javascript', 'python', 'java', 'cpp', 'c'].includes(language)) {
            return this.executeLocally(code, language, input);
        }

        if (!this.apiKey || this.apiKey === 'your_rapidapi_key_here') {
            return {
                status: 'error',
                stdout: '',
                stderr: 'Execution Error: API Key missing and local execution not supported for this language.',
                time: 0,
                memory: 0
            };
        }

        try {
            const languageId = this.languageIds[language];
            if (!languageId) throw new Error('Unsupported language');

            const submitResponse = await axios.post(
                `${this.apiUrl}/submissions?base64_encoded=true&wait=true`,
                {
                    source_code: Buffer.from(code).toString('base64'),
                    language_id: languageId,
                    stdin: Buffer.from(input).toString('base64'),
                    cpu_time_limit: 2,
                    memory_limit: 128000
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Key': this.apiKey,
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    }
                }
            );

            const result = submitResponse.data;
            return this.formatResult(result);
        } catch (error) {
            console.error('Code execution error:', error.message);
            return {
                status: 'error',
                stdout: '',
                stderr: `Execution Error: ${error.message}`,
                time: 0,
                memory: 0
            };
        }
    }

    async executeLocally(code, language, input) {
        const fs = require('fs-extra');
        const path = require('path');
        const { v4: uuidv4 } = require('uuid');
        const tmpDir = path.join(__dirname, '../tmp');

        await fs.ensureDir(tmpDir);

        const jobId = uuidv4();
        let fileName, compileCommand, runCommand, runArgs;

        if (language === 'javascript') {
            return this.runInterpreted('node', ['-e', code], input);
        } else if (language === 'python') {
            return this.runInterpreted('python', ['-c', code], input);
        } else if (language === 'java') {
            fileName = `Main_${jobId}.java`;
            const filePath = path.join(tmpDir, fileName);
            // Java requires class name to match file name. We need to replace class Solution with class Main_uuid
            const className = `Main_${jobId.replace(/-/g, '_')}`;
            code = code.replace(/class Solution/g, `class ${className}`);
            fileName = `${className}.java`; // Update filename to match class

            await fs.writeFile(path.join(tmpDir, fileName), code);
            const javaHome = 'C:\\Program Files\\Java\\jdk-21.0.10\\bin';
            compileCommand = `"${path.join(javaHome, 'javac.exe')}" ${fileName}`;
            runCommand = `"${path.join(javaHome, 'java.exe')}" ${className}`;
        } else if (language === 'cpp') {
            fileName = `${jobId}.cpp`;
            await fs.writeFile(path.join(tmpDir, fileName), code);
            const outPath = path.join(tmpDir, `${jobId}.exe`);
            compileCommand = `g++ ${fileName} -o ${jobId}.exe`;
            runCommand = outPath;
        } else if (language === 'c') {
            fileName = `${jobId}.c`;
            await fs.writeFile(path.join(tmpDir, fileName), code);
            const outPath = path.join(tmpDir, `${jobId}.exe`);
            compileCommand = `gcc ${fileName} -o ${jobId}.exe`;
            runCommand = outPath;
        }

        // Execution Logic for Compiled Languages
        try {
            return await new Promise((resolve) => {
                // 1. Compile
                const { exec } = require('child_process');
                exec(compileCommand, { cwd: tmpDir }, (error, stdout, stderr) => {
                    if (error) {
                        resolve({
                            stdout: '',
                            stderr: `Compilation Error:\n${stderr}`,
                            status: 'compilation_error',
                            time: 0,
                            memory: 0
                        });
                        return;
                    }

                    // 2. Run
                    const { spawn } = require('child_process');
                    // Split runCommand for spawn (e.g. "java classname")
                    const parts = runCommand.split(' ');
                    const cmd = parts[0];
                    const args = parts.slice(1);

                    const startTime = process.hrtime();
                    const processRef = spawn(cmd, args, { cwd: tmpDir });

                    let execStdout = '';
                    let execStderr = '';

                    if (input) {
                        processRef.stdin.write(input);
                        processRef.stdin.end();
                    }

                    processRef.stdout.on('data', (data) => execStdout += data.toString());
                    processRef.stderr.on('data', (data) => execStderr += data.toString());

                    processRef.on('close', async (code) => {
                        const diff = process.hrtime(startTime);
                        const time = (diff[0] * 1e9 + diff[1]) / 1e9;

                        // Cleanup
                        try {
                            if (language === 'java') {
                                await fs.remove(path.join(tmpDir, fileName)); // .java
                                await fs.remove(path.join(tmpDir, `${className}.class`)); // .class
                            } else if (language === 'cpp' || language === 'c') {
                                await fs.remove(path.join(tmpDir, fileName)); // source
                                await fs.remove(path.join(tmpDir, `${jobId}.exe`)); // binary
                            }
                        } catch (e) { console.error("Cleanup error", e); }

                        resolve({
                            stdout: execStdout,
                            stderr: execStderr,
                            status: code === 0 ? 'accepted' : 'runtime_error',
                            time: time.toFixed(3),
                            memory: 0
                        });
                    });
                });
            });
        } catch (e) {
            return { status: 'error', stderr: e.message };
        }
    }

    runInterpreted(command, args, input) {
        const { spawn } = require('child_process');
        return new Promise((resolve) => {
            const startTime = process.hrtime();
            const processRef = spawn(command, args);
            let stdout = '', stderr = '';

            if (input) {
                processRef.stdin.write(input);
                processRef.stdin.end();
            }

            processRef.stdout.on('data', d => stdout += d);
            processRef.stderr.on('data', d => stderr += d);

            processRef.on('close', code => {
                const diff = process.hrtime(startTime);
                const time = (diff[0] * 1e9 + diff[1]) / 1e9;
                resolve({
                    stdout: stdout,
                    stderr: stderr,
                    status: code === 0 ? 'accepted' : 'runtime_error',
                    time: time.toFixed(3),
                    memory: 0
                });
            });
        });
    }

    formatResult(rawResult) {
        return {
            stdout: rawResult.stdout ? Buffer.from(rawResult.stdout, 'base64').toString() : '',
            stderr: rawResult.stderr ? Buffer.from(rawResult.stderr, 'base64').toString() : '',
            compile_output: rawResult.compile_output ? Buffer.from(rawResult.compile_output, 'base64').toString() : '',
            status: rawResult.status.description.toLowerCase().replace(' ', '_'),
            time: rawResult.time,
            memory: rawResult.memory
        };
    }

    async runTestCases(code, language, testCases) {
        const results = [];
        for (const testCase of testCases) {
            const result = await this.executeCode(code, language, testCase.input);
            const passed = result.stdout.trim() === testCase.output.trim();
            results.push({
                input: testCase.input,
                expectedOutput: testCase.output,
                actualOutput: result.stdout.trim(),
                passed,
                runtime: result.time,
                error: result.stderr
            });
        }
        return results;
    }
}

module.exports = new CodeExecutor();
