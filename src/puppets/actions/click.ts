import { Page } from 'puppeteer';
import { BaseAction } from "./base";
import { ActionOptions } from '../types/actions';

// Map of predefined selector aliases
const predefinedSelectors: { [key: string]: string } = {
    'accept-google': 'button:nth-of-type(2) div[role="none"]',
    // Add more aliases here
};

// Function to add more predefined selectors dynamically
export function addPredefinedSelectors(newSelectors: { [key: string]: string }) {
    Object.assign(predefinedSelectors, newSelectors);
}
const CLICK_CONFIG = {
    defaultKeepOpen: true,
    description: 'Click on a specific element',
}

export class ClickAction extends BaseAction {
    constructor(browserManager: any, options: ActionOptions) {
        super(browserManager, options, CLICK_CONFIG);
    }
    async execute(params: string[], options: ActionOptions): Promise<void> {
        if (params.length === 0) {
            throw new Error("ClickAction requires a selector or alias (@alias) as the first parameter.");
        }
        const selectorOrAlias = params[0];
        let selector: string;
        let aliasUsed: string | null = null;

        if (selectorOrAlias.startsWith('@')) {
            aliasUsed = selectorOrAlias.substring(1);
            selector = predefinedSelectors[aliasUsed];
            if (!selector) {
                throw new Error(`Unknown selector alias used: "@${aliasUsed}"`);
            }
            console.log(`ℹ️ Using selector "${selector}" for alias "@${aliasUsed}"`);
        } else {
            selector = selectorOrAlias;
        }

        try {
            await this.page.waitForSelector(selector, { timeout: 5000 });
            await this.page.click(selector);
            const logSelector = aliasUsed ? `@${aliasUsed} (${selector})` : selector;
            console.log(`✅ Clicked on selector: ${logSelector}`);
        } catch (error: any) {
            const logSelector = aliasUsed ? `@${aliasUsed} (${selector})` : selector;
            console.error(`❌ Failed to click on selector "${logSelector}": ${error.message}`);
            throw error;
        }
        // No cleanup here, it should be handled by the orchestrator or runner
    }
}