import { BOLD, COLORS, ColorKeys, ColorValues } from './__color__.js';

/**
 * データ型によってログ出力を変更する static クラス
 */
class Logger {
  private static isPlainObject(obj: any): obj is Record<string, any> {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  private static formatPlainObject(
    obj: Record<string, any>,
    clr: ColorValues,
    indent = 2
  ) {
    const objArray = Object.entries(obj);

    let message: string = '';

    const maxKeyLength = Math.max(...objArray.map(([key]) => key.length));

    message += '{\n';
    objArray.forEach(([key, value]) => {
      const spaces = ' '.repeat(maxKeyLength - key.length + 1);
      if (this.isPlainObject(value)) {
        message += ' '.repeat(indent) + `${key}${spaces}: `;
        message += this.formatPlainObject(value, clr, indent + 2) + '\n';
      } else if (this.isArray(value)) {
        message += ' '.repeat(indent) + `${key}${spaces}: `;
        message += this.formatArray(value, clr, indent) + '\n';
      } else {
        message +=
          ' '.repeat(indent) +
          `${key}${spaces}: ${clr}${value}${COLORS.reset}\n`;
      }
    });
    message += ' '.repeat(indent - 2) + '}';

    return message;
  }

  private static isArray(arr: any): arr is any[] {
    return Array.isArray(arr);
  }

  private static formatArray(arr: any[], clr: ColorValues, indent = 0) {
    let message: string = '';

    message += '[\n';
    arr.forEach((value) => {
      message += ' '.repeat(indent);
      message += `  ${clr}${value}${COLORS.reset},\n`;
    });
    message += ' '.repeat(indent) + ']';

    return message;
  }

  private static createMessage(
    param: any,
    clr: ColorValues,
    emoji?: [string, number]
  ): string {
    let message = '';

    if (this.isPlainObject(param)) {
      message = this.formatPlainObject(param, clr);
    } else if (this.isArray(param)) {
      message = this.formatArray(param, clr);
    } else {
      const emojiStr = emoji ? `${emoji[0].repeat(emoji[1])} ` : '';
      message = `${emojiStr}${clr}${param}${COLORS.reset}`;
    }

    return message;
  }

  public static log(
    param: any,
    options?: {
      color?: ColorKeys;
      emoji?: [string, number];
      newLine?: boolean;
      error?: boolean;
    }
  ) {
    const { color, emoji, newLine, error } = options || {};

    const clr = error ? COLORS.red : color ? COLORS[color] : COLORS.white;

    const message = this.createMessage(param, clr, emoji);

    if (newLine) {
      console.log('');
    }

    if (error) {
      throw new Error(BOLD + message + COLORS.reset);
    } else {
      console.log(message);
    }
  }

  public static line(
    color: ColorKeys,
    position: 'start' | 'end',
    message = '',
    type?: '-' | '=' | '*' | '~' | '_'
  ) {
    const typeStr = type ? type : '-';
    const messageStr = message !== '' ? ` ${message} ` : '';
    const clr = color ? COLORS[color] : COLORS.white;

    if (position === 'start') {
      console.log(' ');
    }

    // 真ん中にメッセージを入れる
    const line = typeStr.repeat(20 - Math.floor(messageStr.length / 2));
    console.log(clr + line + messageStr + line + COLORS.reset);

    if (position === 'end') {
      console.log(' ');
    }
  }
}

export default Logger;
