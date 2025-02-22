module.exports = {
  '**/*.ts': (files) => {
    return [
      `pnpm prettier --write ${files.join(' ')}`,
      'pnpm lint'
    ]
  }
}
