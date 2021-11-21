import { define } from 'typeorm-seeding';
import { Settings } from './entities/settings.entity';

define(Settings, (
  _,
  settings: {
    key: string;
    value: string;
  },
) => {
  const newSettings = new Settings();

  newSettings.key = settings.key;
  newSettings.value = settings.value;
  return newSettings;
});
