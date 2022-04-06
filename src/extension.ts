import * as vscode from 'vscode';

// prettier-ignore
import { pink, green, black, brown, grey, lightBlue, blue, purple, red, orange, yellow, white, cream, Colour } from './constants/colours';
import { Day, friday, monday, saturday, sunday, thursday, tuesday, wednesday } from './constants/days';

const EXTENSION_NAME = 'ShirtColoursOfTheDay';

const COMMAND = {
    showInfo: `${EXTENSION_NAME}.showInfo`,
};

const CONFIG = {
    statusBarAlignment: vscode.StatusBarAlignment.Right,
    statusBarPriority: -10,
};

const SHIRT_COLOURS = {
    [sunday.en]: buildShirtColours(sunday, [pink], [green], [black, brown, grey], [lightBlue, blue]),
    [monday.en]: buildShirtColours(monday, [green], [purple], [lightBlue, blue], [red]),
    [tuesday.en]: buildShirtColours(tuesday, [purple], [orange], [red], [yellow, white, cream]),
    [wednesday.en]: buildShirtColours(wednesday, [orange], [black, brown, grey], [yellow, white, cream], [pink]),
    [thursday.en]: buildShirtColours(thursday, [lightBlue, blue], [red], [green], [purple]),
    [friday.en]: buildShirtColours(friday, [yellow, white, cream], [pink], [orange], [black, brown, grey]),
    [saturday.en]: buildShirtColours(saturday, [black, brown, grey], [lightBlue, blue], [pink], [green]),
};

function buildShirtColours(day: Day, power: Colour[], fortune: Colour[], assistance: Colour[], misfortune: Colour[]) {
    return { day, power, fortune, assistance, misfortune };
}

export function activate(context: vscode.ExtensionContext) {
    // const { subscriptions } = context;

    console.log('[Info] Shirt Colours of the Day is now activated');

    // subscriptions.push(
    //     vscode.commands.registerCommand(COMMAND.showInfo, () => {
    //         vscode.window.showInformationMessage(`HAHA IT WORKS`);
    //     })
    // );

    const statusBarItem = vscode.window.createStatusBarItem(CONFIG.statusBarAlignment, CONFIG.statusBarPriority);
    // statusBarItem.command = COMMAND.showInfo;

    // subscriptions.push(statusBarItem);

    const tooltip = getTooltipText();
    tooltip.isTrusted = true;

    statusBarItem.text = getStatusBarText();
    statusBarItem.tooltip = tooltip;
    statusBarItem.show();

    function getShirtColoursOfTheDay() {
        const today = new Date().getDay();
        const shirtColours = Object.values(SHIRT_COLOURS).find((s) => s.day.id === today);
        return shirtColours;
    }

    function getTooltipText() {
        const shirtColours = getShirtColoursOfTheDay()!;

        const wearText = [
            `- ${shirtColours.power.map(({ th }) => th).join(', ')} (เดช อำนาจ)`,
            `- ${shirtColours.fortune.map(({ th }) => th).join(', ')} (ศรี โชคลาภ)`,
            `- ${shirtColours.assistance.map(({ th }) => th).join(', ')} (มนตรี อุปถัมถ์)`,
        ].join('\n');

        const avoidText = [`- ${shirtColours.misfortune.map(({ th }) => th).join(', ')} (กาลกิณี)`].join('\n');

        const tooltip = new vscode.MarkdownString();
        tooltip.appendMarkdown(`### สีเสื้อประจำวัน${shirtColours.day.th}  \n`);
        tooltip.appendMarkdown('**ใส่:**\n');
        tooltip.appendMarkdown(wearText);
        tooltip.appendMarkdown('\n');
        tooltip.appendMarkdown('**หลีกเลี่ยง:**\n');
        tooltip.appendMarkdown(avoidText);

        return tooltip;
    }

    function getStatusBarText() {
        const shirtColours = getShirtColoursOfTheDay()!;

        const wearText = [...shirtColours.power, ...shirtColours.fortune, ...shirtColours.assistance]
            .map(({ th }) => th)
            .join(', ');

        const avoidText = [...shirtColours.misfortune].map(({ th }) => th).join(', ');

        return `👍: ${wearText} 👎: ${avoidText}`;
    }
}
