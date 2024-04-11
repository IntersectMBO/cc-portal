export class QueryTransformer {
  //This method escapes special characters which interfere with RedisSearch
  static transform(query: string): string {
    const replacements = {
      ',': '\\,',
      '.': '\\.',
      '<': '\\<',
      '>': '\\>',
      '{': '\\{',
      '}': '\\}',
      '[': '\\[',
      ']': '\\]',
      '"': '\\"',
      "'": "\\'",
      ':': '\\:',
      ';': '\\;',
      '!': '\\!',
      '@': '\\@',
      '#': '\\#',
      $: '\\$',
      '%': '\\%',
      '^': '\\^',
      '&': '\\&',
      '*': '\\*',
      '(': '\\(',
      ')': '\\)',
      '-': '\\-',
      '+': '\\+',
      '=': '\\=',
      '~': '\\~',
      ' ': '\\ ',
    };

    const newValue = query.replace(
      /,|\.|<|>|\{|\}|\[|\]|"|'|:|;|!|@|#|\$|%|\^|&|\*|\(|\)|-|\+|=|~|\s/g,
      function (x) {
        return replacements[x];
      },
    );
    return newValue;
  }
}
