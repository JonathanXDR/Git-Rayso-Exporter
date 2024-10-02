declare module 'rayso-api' {
  export class RaySo {
    constructor(options?: Options);
    cook(code: Options['code']): Promise<Buffer>;
  }

  export interface Options {
    title?: string = 'Untitled-1';
    theme?: Theme = Theme.CANDY;
    padding?: Padding = Padding.LG;
    language?: Language = Language.JAVASCRIPT;
    darkMode?: boolean = true;
    width?: number | null = null;
    background?: boolean = true;
    code: string = 'bW9kdWxlLmV4cG9ydHMgPSBsZWZ0cGFkOwoKZnVuY3Rpb24gbGVmdHBhZChzdHIsIGxlbiwgY2gpIHsKICBzdHIgPSBTdHJpbmcoc3RyKTsKICB2YXIgaSA9IC0xOwoKICBpZiAoIWNoICYmIGNoICE9PSAwKSBjaCA9ICcgJzsKCiAgbGVuID0gbGVuIC0gc3RyLmxlbmd0aDsKCiAgd2hpbGUgKGkrKyA8IGxlbikgewogICAgc3RyID0gY2ggKyBzdHI7CiAgfQogIHJldHVybiBzdHI7Cn0';

    localPreview?: boolean;
    localPreviewPath?: string;
    debug?: boolean;
  }

  export enum Theme {
    VERCEL = 'vercel',
    SUPABASE = 'supabase',
    TAILWIND = 'tailwind',
    BITMAP = 'bitmap',
    NOIR = 'noir',
    ICE = 'ice',
    SAND = 'sand',
    FOREST = 'forest',
    MONO = 'mono',
    BREEZE = 'breeze',
    CANDY = 'candy',
    CRIMSON = 'crimson',
    FALCON = 'falcon',
    MEADOW = 'meadow',
    MIDNIGHT = 'midnight',
    RAINDROP = 'raindrop',
    SUNSET = 'sunset',
  }

  export enum Padding {
    SM = 16,
    MD = 32,
    LG = 64,
    XL = 128,
    CUSTOM,
  }

  export enum Language {
    AUTO_DETECT = 'auto-detect',
    BASH = 'bash',
    ASTRO = 'astro',
    CPP = 'cpp',
    C_SHARP = 'csharp',
    CLOJURE = 'clojure',
    CRYSTAL = 'crystal',
    CSS = 'css',
    DART = 'dart',
    DIFF = 'diff',
    DOCKER = 'docker',
    ELM = 'elm',
    ELIXIR = 'elixir',
    ERLANG = 'erlang',
    GLEAM = 'gleam',
    GRAPHQL = 'graphql',
    GO = 'go',
    HASKELL = 'haskell',
    HTML = 'html',
    JAVA = 'java',
    JAVASCRIPT = 'javascript',
    JULIA = 'julia',
    JSON = 'json',
    JSX = 'jsx',
    KOTLIN = 'kotlin',
    LATEX = 'latex',
    LISP = 'lisp',
    LUA = 'lua',
    MARKDOWN = 'markdown',
    MATLAB = 'matlab',
    PLAINTEXT = 'plaintext',
    POWERSHELL = 'powershell',
    OBJECTIVE_C = 'objective-c',
    OCAML = 'ocaml',
    PHP = 'php',
    PRISMA = 'prisma',
    PYTHON = 'python',
    R = 'r',
    RUBY = 'ruby',
    RUST = 'rust',
    SCALA = 'scala',
    SCSS = 'scss',
    SOLIDITY = 'solidity',
    SQL = 'sql',
    SWIFT = 'swift',
    SVELTE = 'svelte',
    TOML = 'toml',
    TYPESCRIPT = 'typescript',
    TSX = 'tsx',
    VUE = 'vue',
    XML = 'xml',
    YAML = 'yaml',
    ZIG = 'zig',
  }
}
