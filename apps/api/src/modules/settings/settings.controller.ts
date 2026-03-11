import { Controller, Get, Body, Patch } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';

let globalSettings = {
    schoolName: 'SAF Institute',
    supportEmail: 'admin@safinstitute.com',
    currency: 'GHS',
    timezone: 'Africa/Accra',
    aiAgentEnabled: true,
};

@Public()
@Controller('settings')
export class SettingsController {

    @Get()
    getSettings() {
        return globalSettings;
    }

    @Patch()
    updateSettings(@Body() updates: Partial<typeof globalSettings>) {
        globalSettings = { ...globalSettings, ...updates };
        return globalSettings;
    }
}
