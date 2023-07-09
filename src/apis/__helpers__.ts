import dotenv from 'dotenv';
import * as C from '../__constants__.js';
import Logger from '../logs/logger.js';

/**
 * MTS アップロード用ヘルパークラス
 */
class HelperMTS {
  private accessToken: string | undefined;

  constructor(private id: string, private user: string) {
    dotenv.config();

    // Base
    this.accessToken = process.env[`MAPBOX_ACCESS_TOKEN`];
  }

  /**
   * @desc 指定秒数待機する
   * @param sec 待機秒数
   */
  public async sleep(sec: number): Promise<void> {
    Logger.log(`sleep in ${sec} sec.....`, {
      color: 'blue',
      emoji: ['🛌', 3],
    });
    return new Promise((resolve) => setTimeout(() => resolve(), sec * 1000));
  }

  /**
   * @desc ソース ID を置換する
   * @returns 置換後のソース ID
   */
  public replaceId(): string {
    const replacedId = C.SOURCE_ID.replace('{MTS_ID}', this.id).replace(
      '{MTS_USER}',
      this.user
    );

    // 全てのプレースホルダーが置換されているかチェック
    this.checkPlaceholdersReplaced(replacedId);

    return replacedId;
  }

  /**
   * @desc URL を置換する
   * @param baseUrl 置換前の URL
   * @returns 置換後の URL
   * @throws {Error} プレースホルダーが置換されていない場合
   * @throws {Error} トークンが未設定の場合
   */
  public replaceUrl(baseUrl: string): string {
    this.assertTokenIsSet(this.accessToken);

    const replacedUrl = baseUrl
      .replace('{MTS_USER}', this.user)
      .replace('{MTS_ID}', this.id)
      .replace('{MTS_TOKEN}', this.accessToken);

    // 全てのプレースホルダーが置換されているかチェック
    this.checkPlaceholdersReplaced(replacedUrl);

    return replacedUrl;
  }

  /**
   * @desc トークンが設定されているかチェックする
   * @param token トークン
   * @throws {Error} トークンが未設定の場合
   * @returns なし
   */
  private assertTokenIsSet(token: string | undefined): asserts token is string {
    if (token === undefined) {
      throw new Error('\n🚨🚨🚨 No token set 🚨🚨🚨\n');
    }
  }

  /**
   * @desc プレースホルダーが置換されているかチェックする
   * @param str 置換後の文字列
   * @throws {Error} プレースホルダーが置換されていない場合
   * @returns なし
   */
  private checkPlaceholdersReplaced(str: string): void {
    if (str.includes('{MTS')) {
      throw new Error('\n🚨🚨🚨 Not all placeholders replaced 🚨🚨🚨\n');
    }
  }
}

export { HelperMTS };
