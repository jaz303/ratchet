import {readFileSync} from 'fs';

const fileName = process.argv[2];
const bundle = JSON.parse(readFileSync(fileName, 'utf8'));

class Frame {
    fn: string // name of function executing in this frame
    ip: number // instruction pointer
    bp: number // base stack pointer - variables are relative to this
    sp: number // stack pointer
}

class Task {
    stack: Array<any> = []
    currentFrame: Frame
    frames: Array<Frame> = []
    running: boolean = true
}

const runQueue : Array<Task> = [];

type Builtin = (t: Task, args: Array<any>) => void;

const builtins = new Map<string,Builtin>();

builtins.set('delay', (task: Task, args: Array<any>) => {
    pause(task);
    setTimeout(() => { resume(task); }, args[0].value);
});

builtins.set('print', (task: Task, args: Array<any>) => {
    console.log("print", args);
});

function pause(task: Task) {
    task.running = false;
}

function resume(task: Task) {
    task.running = true;
    runQueue.push(task);
    run();
}

function run() {
    while (runQueue.length) {
        const task = runQueue.shift();
        if (!task) {
            throw new Error("boom");
        }
        while (true) {
            if (!tick(task)) {
                if (task.running) {
                    runQueue.push(task);
                }
                break;
            }
        }
    }
}

function tick(task: Task): boolean {
    const ins = bundle.code[task.currentFrame.fn].instructions[task.currentFrame.ip++]
    switch (ins.op) {
        case "spawn":
        {
            // TODO: check the function exists
            // TODO: support args
            const task = new Task();
            task.stack = new Array<any>(2048);
            task.currentFrame = new Frame();
            task.currentFrame.fn = ins.fn;
            task.currentFrame.ip = 0;
            task.currentFrame.bp = 0;
            task.currentFrame.sp = bundle.code[task.currentFrame.fn].stackSize;
            runQueue.push(task);
            break;
        }
        case "load-constant":
            task.stack[task.currentFrame.bp + ins.local] = bundle.constants[ins.constant];
            break;
        case "push":
            task.stack[task.currentFrame.sp++] = task.stack[task.currentFrame.bp + ins.local];
            break;
        case "call":
            const b = builtins.get(ins.fn);
            if (b) {
                task.currentFrame.sp -= ins.args;
                b(task, task.stack.slice(task.currentFrame.sp, task.currentFrame.sp + ins.args));
                if (!task.running) {
                    return false;
                }
            } else {
                const frame = new Frame();
                frame.fn = ins.fn; // TODO: this doesn't work for built-ins
                frame.ip = 0;
                frame.sp = task.currentFrame.sp;
                task.currentFrame.sp -= ins.args;
                frame.bp = task.currentFrame.sp;
                task.frames.push(task.currentFrame);
                task.currentFrame = frame;
            }
            break;
        case "jmp":
            task.currentFrame.ip = ins.offset;
            break;
        case "exit":
            task.running = false;
            return false;
    }
    return true;
}

const main = new Task();
main.stack = new Array<any>(2048);
main.currentFrame = new Frame();
main.currentFrame.fn = "main";
main.currentFrame.ip = 0;
main.currentFrame.bp = 0;
main.currentFrame.sp = 0;
runQueue.push(main);

run();
