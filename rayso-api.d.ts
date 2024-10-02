declare module 'rayso-api' {
  export class RaySo {
    constructor(options?: RaySoOptions);
    cook(code: string): Promise<Buffer>;
  }

  export interface RaySoOptions {
    title?: string;
    theme?: CardTheme;
    padding?: CardPadding;
    language?: CardProgrammingLanguage;
    background?: boolean;
    darkMode?: boolean;
    localPreview?: boolean;
    localPreviewPath?: string;
    debug?: boolean;
  }

  export enum CardTheme {
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

  export enum CardPadding {
    sm = 16,
    md = 32,
    lg = 64,
    xl = 128,
  }

  export enum CardProgrammingLanguage {
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
