const { spawn } = require('child_process');
const path = require('path');
console.log('\x1b[36m%s\x1b[0m', '项目正在初始化...');

const electronPath = path.join(__dirname, 'node_modules', '.bin', 'electron');

function runCommand(command, args) {
  const proc = spawn(command, args, { stdio: 'inherit', shell: true });

  proc.on('error', (err) => {
    console.error(`Failed to start command ${command}: ${err}`);
  });

  proc.on('close', (code) => {
    if (code !== 0) {
      console.error(`Command ${command} ${args.join(' ')} exited with code ${code}`);
    }
  });
}

// 使用本地安装的 electron 和 npm
runCommand(electronPath, ['.']);
runCommand('npm', ['run', 'uiDev']);
