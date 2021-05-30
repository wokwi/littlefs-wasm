/**
 * A bunch of helper methods / glue code for using littlefs from JavaScript
 */

#include "lfs.h"

lfs_t *new_lfs() {
    return malloc(sizeof(lfs_t));
}

const struct lfs_config *new_lfs_config(void *read, void *prog, void *erase, void *sync, size_t block_count, size_t block_size) {
    const struct lfs_config cfg = {
        // block device operations
        .read = read,
        .prog = prog,
        .erase = erase,
        .sync = sync,

        // block device configuration
        .read_size = 256,
        .prog_size = 32,
        .block_size = block_size,
        .block_count = block_count,
        .cache_size = 256 * 4,
        .lookahead_size = 32,
        .block_cycles = 100,
    };
    struct lfs_config *result = malloc(sizeof(cfg));
    memcpy(result, &cfg, sizeof(cfg));
    return result;
}

void lfs_write_file(lfs_t *lfs, char *name, void *data, size_t size) {
    lfs_file_t file;
    lfs_file_open(lfs, &file, name, LFS_O_RDWR | LFS_O_CREAT);
    lfs_file_write(lfs, &file, data, size);
    lfs_file_close(lfs, &file);
}
