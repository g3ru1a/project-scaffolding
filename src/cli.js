import arg from 'arg';
import inquirer from 'inquirer';
import {createProject} from './main';

function parseArgumentsIntoOptions(rawArgs){
    let args = arg(
        {
            '--git': Boolean,
            '--yes': Boolean,
            '--install': Boolean,
            '--typescript': Boolean,
            '-g': '--git',
            '-y': '--yes',
            '-i': '--install',
            '-ts': '--typescript'
        },
        {
            argv: rawArgs.slice(2)
        }
    );
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],
        runInstall: args['--install'] || false,
        typescript: args['--typescript'] || false,
    }
}

async function promptForMissingOptions(options) {
    const defaultTemplate = 'api';
    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
   
    const questions = [];
    if (!options.template) {
      questions.push({
        type: 'list',
        name: 'template',
        message: 'Please choose which project template to use',
        choices: ['api'],
        default: defaultTemplate,
      });
    }

    if(!options.runInstall){
        questions.push({
          type: 'confirm',
          name: 'typescript',
          message: 'Use TypeScript?',
          default: false,
        });
      }

    if(!options.runInstall){
      questions.push({
        type: 'confirm',
        name: 'runInstall',
        message: 'Install dependencies?',
        default: false,
      });
    }
   
    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false,
      });
    }
   
    const answers = await inquirer.prompt(questions);
    return {
      ...options,
      template: options.template || answers.template,
      git: options.git || answers.git,
      runInstall: options.runInstall || answers.runInstall,
      typescript: options.typescript || answers.typescript
    };
   }

export async function cli(args){
    let options = parseArgumentsIntoOptions(args);
    options = await promptForMissingOptions(options);
    await createProject(options);
}