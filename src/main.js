import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    await copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });

    return createDirectoryStructure(path.join(options.targetDirectory, 'src'));
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory,
    });
    if (result.failed) {
        return Promise.reject(new Error('Failed to initialize git'));
    }
    return;
}

async function createDirectoryStructure(folderPath){
    let folders = "../public,controllers,database,middleware,models,routes,utils,validators".split(',');
    folders.forEach(folder => {
        let finalPath = path.join(folderPath, folder);
        if(!fs.existsSync(finalPath)){
            fs.mkdirSync(finalPath, (err) => {
                if(err) return console.error(err);
            });
        }
    });

    let files = [".gitignore"];
    files.forEach(file => {
        let filePath = path.join(folderPath, '../'+file);
        if(!fs.existsSync(filePath)){
            fs.writeFileSync(filePath, "/node_modules\n.env", (err) => {
                if(err) return console.error(err);
            });
        }
    })
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };
    
    const currentFileUrl = import.meta.url;
    const templateDir = path.resolve(
        new URL(currentFileUrl).pathname,
        '../../templates',
        options.template
    );
    options.templateDirectory = templateDir;

    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Copying project files',
            task: () => copyTemplateFiles(options),
        },
        {
            title: 'Initializing git',
            task: () => initGit(options),
            // enabled: () => options.git,
            skip: () =>
                !options.git
                    ? 'Pass --git to automatically initialize a repo'
                    : undefined,
        },
        {
            title: 'Installing dependencies',
            task: () =>
                projectInstall({
                    cwd: options.targetDirectory,
                }),
            skip: () =>
                !options.runInstall
                    ? 'Pass --install to automatically install dependencies'
                    : undefined,
        },
    ]);
    await tasks.run();
    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}