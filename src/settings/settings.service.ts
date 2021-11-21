import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { pickBy, identity } from 'lodash';
import { getConnection, getRepository } from 'typeorm';

import { Settings } from './entities/settings.entity';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SettingsRepository } from './settings.repository';
import { SettingsCreateDTO, SettingsUpdateDTO } from './dto';
import { errorMessage } from '../shared/error-messages/error-messages';
import { RedisHelperService } from '../redis-helpers/redis-helpers.service';

@Injectable()
export class SettingsService extends TypeOrmCrudService<Settings> {
  constructor(
    @InjectRepository(SettingsRepository)
    private readonly settingsRepositry: SettingsRepository,
    private readonly redisHelperService: RedisHelperService,
  ) {
    super(settingsRepositry);
  }

  public async getSettingsByKey(key: string): Promise<Settings> {
    const redisSettings = await this.redisHelperService.getHash(
      'settings',
      key,
    );

    const setting: Settings = await this.settingsRepositry.findOne({
      where: { key },
    });

    const { key: settingKey, value: settingValue } = setting;

    if (redisSettings !== null)
      await this.redisHelperService.setHash(
        'settings',
        settingKey,
        settingValue,
      );

    return setting;
  }

  public async getSetting(keyToFind: string): Promise<string> {
    const quizQuestionsCount: string = await this.redisHelperService.getHash(
      'settings',
      keyToFind,
    );

    if (quizQuestionsCount !== null) return quizQuestionsCount;

    const settings = await getRepository(Settings).findOne({
      key: keyToFind,
    });

    if (!settings)
      throw new NotFoundException(
        `${errorMessage.settingsNotFound} ${keyToFind}`,
      );

    const { key, value } = settings;

    await this.redisHelperService.setHash('settings', key, value);

    return value;
  }

  public async createSettings(
    settingsPayload: SettingsCreateDTO,
  ): Promise<Settings> {
    return getConnection().transaction(async trx => {
      const newSetting = (await trx.save(Settings, {
        ...settingsPayload,
      })) as Settings;

      const { key, value } = newSetting;

      await this.redisHelperService.setHash('settings', key, value);

      return newSetting;
    });
  }

  public async updateSettings(
    settingsId: number,
    settingsPayload: SettingsUpdateDTO,
  ): Promise<Settings> {
    const settings: Settings = await this.settingsRepositry.findOne(settingsId);

    if (!settings) throw new NotFoundException(errorMessage.settingsNotFound);

    const settingsToUpdate = pickBy(settingsPayload, identity);

    return getConnection().transaction(async trx => {
      const updatedSettings = await trx.save(Settings, {
        ...settings,
        ...settingsToUpdate,
      });

      const { key, value } = updatedSettings;

      await this.redisHelperService.setHash('settings', key, value);

      return updatedSettings;
    });
  }

  public async deleteSetting(settingId: number): Promise<Settings> {
    const setting = await this.settingsRepositry.findOne(settingId);

    if (!setting) throw new NotFoundException(errorMessage.settingsNotFound);

    return getConnection().transaction(async trx => {
      const deletedSetitng: Settings = await trx.remove(Settings, setting);

      const { key } = deletedSetitng;

      await this.redisHelperService.delHash('settings', key);

      return deletedSetitng;
    });
  }
}
