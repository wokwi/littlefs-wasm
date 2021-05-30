/** Quick test program for creating a littlefs filesystem with a main.py file */

const createLittleFS = require('./littlefs');

const BLOCK_COUNT = 352;
const BLOCK_SIZE = 4096;

const flash = new Uint8Array(BLOCK_COUNT * BLOCK_SIZE);

(async function () {
  const littlefs = await createLittleFS();
  function flashRead(cfg, block, off, buffer, size) {
    const start = block * BLOCK_SIZE + off;
    littlefs.HEAPU8.set(flash.subarray(start, start + size), buffer);
  }
  function flashProg(cfg, block, off, buffer, size) {
    const start = block * BLOCK_SIZE + off;
    console.log(
      'write',
      start,
      littlefs.HEAPU8.subarray(buffer, buffer + size)
    );
    flash.set(littlefs.HEAPU8.subarray(buffer, buffer + size), start);
  }
  const read = littlefs.addFunction(flashRead, 'iiiiii');
  const prog = littlefs.addFunction(flashProg, 'iiiiii');
  const erase = littlefs.addFunction(
    (cfg, block) => console.log('erase', block),
    'iii'
  );
  const sync = littlefs.addFunction(() => console.log('sync'), 'ii');

  const writeFile = littlefs.cwrap(
    'lfs_write_file',
    ['number'],
    ['number', 'string', 'string', 'number']
  );

  const config = littlefs._new_lfs_config(
    read,
    prog,
    erase,
    sync,
    BLOCK_COUNT,
    BLOCK_SIZE
  );
  const lfs = littlefs._new_lfs();
  littlefs._lfs_format(lfs, config);
  littlefs._lfs_mount(lfs, config);
  littlefs._lfs_unmount(lfs);
  const fileData = 'hello world\n';
  writeFile(lfs, 'main.py', fileData, fileData.length);
  littlefs._free(lfs);
  littlefs._free(config);
})();
