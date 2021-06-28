/**
 * Maximum name size in bytes, may be redefined to reduce the size of the info struct. Limited to <=
 * 1022. Stored in superblock and must be respected by other littlefs drivers.
 */
export const LFS_NAME_MAX = 255;

/**
 * Maximum size of a file in bytes, may be redefined to limit to support other drivers. Limited on
 * disk to <= 4294967296. However, above 2147483647 the functions lfs_file_seek, lfs_file_size, and
 * lfs_file_tell will return incorrect values due to using signed integers. Stored in superblock and
 * must be respected by other littlefs drivers.
 */
export const LFS_FILE_MAX = 2147483647;

/**
 * Size of custom attributes in bytes, may be redefined, but there is no real benefit to using a
 * smaller LFS_ATTR_MAX. Limited to <= 1022.
 */
export const LFS_ATTR_MAX = 1022;

// Possible error codes, these are negative to allow
/** No error */
export const LFS_ERR_OK = 0;
/** Error during device operation */
export const LFS_ERR_IO = -5;
/** Corrupted */
export const LFS_ERR_CORRUPT = -84;
/** No directory entry */
export const LFS_ERR_NOENT = -2;
/** Entry already exists */
export const LFS_ERR_EXIST = -17;
/** Entry is not a dir */
export const LFS_ERR_NOTDIR = -20;
/** Entry is a dir */
export const LFS_ERR_ISDIR = -21;
/** Dir is not empty */
export const LFS_ERR_NOTEMPTY = -39;
/** Bad file number */
export const LFS_ERR_BADF = -9;
/** File too large */
export const LFS_ERR_FBIG = -27;
/** Invalid parameter */
export const LFS_ERR_INVAL = -22;
/** No space left on device */
export const LFS_ERR_NOSPC = -28;
/** No more memory available */
export const LFS_ERR_NOMEM = -12;
/** No data/attr available */
export const LFS_ERR_NOATTR = -61;
/** File name too long */
export const LFS_ERR_NAMETOOLONG = -36;

// File types
export const LFS_TYPE_REG = 0x001;
export const LFS_TYPE_DIR = 0x002;

// File open flags
/** Open a file as read only */
export const LFS_O_RDONLY = 1;
/** Open a file as write only */
export const LFS_O_WRONLY = 2;
/** Open a file as read and write */
export const LFS_O_RDWR = 3;
/** Create a file if it does not exist */
export const LFS_O_CREAT = 0x0100;
/** Fail if a file already exists */
export const LFS_O_EXCL = 0x0200;
/** Truncate the existing file to zero size */
export const LFS_O_TRUNC = 0x0400;
/** Move to end of file on every write */
export const LFS_O_APPEND = 0x0800;

// File seek flags
/** Seek relative to an absolute position */
export const LFS_SEEK_SET = 0;
/** Seek relative to the current file position */
export const LFS_SEEK_CUR = 1;
/** Seek relative to the end of the file */
export const LFS_SEEK_END = 2;

/*
// Configuration provided during initialization of the littlefs
struct lfs_config {
    // Opaque user provided context that can be used to pass
    // information to the block device operations
    void *context;

    // Read a region in a block. Negative error codes are propogated
    // to the user.
    int (*read)(const struct lfs_config *c, lfs_block_t block,
            lfs_off_t off, void *buffer, lfs_size_t size);

    // Program a region in a block. The block must have previously
    // been erased. Negative error codes are propogated to the user.
    // May return LFS_ERR_CORRUPT if the block should be considered bad.
    int (*prog)(const struct lfs_config *c, lfs_block_t block,
            lfs_off_t off, const void *buffer, lfs_size_t size);

    // Erase a block. A block must be erased before being programmed.
    // The state of an erased block is undefined. Negative error codes
    // are propogated to the user.
    // May return LFS_ERR_CORRUPT if the block should be considered bad.
    int (*erase)(const struct lfs_config *c, lfs_block_t block);

    // Sync the state of the underlying block device. Negative error codes
    // are propogated to the user.
    int (*sync)(const struct lfs_config *c);

#ifdef LFS_THREADSAFE
    // Lock the underlying block device. Negative error codes
    // are propogated to the user.
    int (*lock)(const struct lfs_config *c);

    // Unlock the underlying block device. Negative error codes
    // are propogated to the user.
    int (*unlock)(const struct lfs_config *c);
#endif

    // Minimum size of a block read. All read operations will be a
    // multiple of this value.
    lfs_size_t read_size;

    // Minimum size of a block program. All program operations will be a
    // multiple of this value.
    lfs_size_t prog_size;

    // Size of an erasable block. This does not impact ram consumption and
    // may be larger than the physical erase size. However, non-inlined files
    // take up at minimum one block. Must be a multiple of the read
    // and program sizes.
    lfs_size_t block_size;

    // Number of erasable blocks on the device.
    lfs_size_t block_count;

    // Number of erase cycles before littlefs evicts metadata logs and moves
    // the metadata to another block. Suggested values are in the
    // range 100-1000, with large values having better performance at the cost
    // of less consistent wear distribution.
    //
    // Set to -1 to disable block-level wear-leveling.
    int32_t block_cycles;

    // Size of block caches. Each cache buffers a portion of a block in RAM.
    // The littlefs needs a read cache, a program cache, and one additional
    // cache per file. Larger caches can improve performance by storing more
    // data and reducing the number of disk accesses. Must be a multiple of
    // the read and program sizes, and a factor of the block size.
    lfs_size_t cache_size;

    // Size of the lookahead buffer in bytes. A larger lookahead buffer
    // increases the number of blocks found during an allocation pass. The
    // lookahead buffer is stored as a compact bitmap, so each byte of RAM
    // can track 8 blocks. Must be a multiple of 8.
    lfs_size_t lookahead_size;

    // Optional statically allocated read buffer. Must be cache_size.
    // By default lfs_malloc is used to allocate this buffer.
    void *read_buffer;

    // Optional statically allocated program buffer. Must be cache_size.
    // By default lfs_malloc is used to allocate this buffer.
    void *prog_buffer;

    // Optional statically allocated lookahead buffer. Must be lookahead_size
    // and aligned to a 32-bit boundary. By default lfs_malloc is used to
    // allocate this buffer.
    void *lookahead_buffer;

    // Optional upper limit on length of file names in bytes. No downside for
    // larger names except the size of the info struct which is controlled by
    // the LFS_NAME_MAX define. Defaults to LFS_NAME_MAX when zero. Stored in
    // superblock and must be respected by other littlefs drivers.
    lfs_size_t name_max;

    // Optional upper limit on files in bytes. No downside for larger files
    // but must be <= LFS_FILE_MAX. Defaults to LFS_FILE_MAX when zero. Stored
    // in superblock and must be respected by other littlefs drivers.
    lfs_size_t file_max;

    // Optional upper limit on custom attributes in bytes. No downside for
    // larger attributes size but must be <= LFS_ATTR_MAX. Defaults to
    // LFS_ATTR_MAX when zero.
    lfs_size_t attr_max;

    // Optional upper limit on total space given to metadata pairs in bytes. On
    // devices with large blocks (e.g. 128kB) setting this to a low size (2-8kB)
    // can help bound the metadata compaction time. Must be <= block_size.
    // Defaults to block_size when zero.
    lfs_size_t metadata_max;
};

// File info structure
struct lfs_info {
    // Type of the file, either LFS_TYPE_REG or LFS_TYPE_DIR
    uint8_t type;

    // Size of the file, only valid for REG files. Limited to 32-bits.
    lfs_size_t size;

    // Name of the file stored as a null-terminated string. Limited to
    // LFS_NAME_MAX+1, which can be changed by redefining LFS_NAME_MAX to
    // reduce RAM. LFS_NAME_MAX is stored in superblock and must be
    // respected by other littlefs drivers.
    char name[LFS_NAME_MAX+1];
};

// Custom attribute structure, used to describe custom attributes
// committed atomically during file writes.
struct lfs_attr {
    // 8-bit type of attribute, provided by user and used to
    // identify the attribute
    uint8_t type;

    // Pointer to buffer containing the attribute
    void *buffer;

    // Size of attribute in bytes, limited to LFS_ATTR_MAX
    lfs_size_t size;
};

// Optional configuration provided during lfs_file_opencfg
struct lfs_file_config {
    // Optional statically allocated file buffer. Must be cache_size.
    // By default lfs_malloc is used to allocate this buffer.
    void *buffer;

    // Optional list of custom attributes related to the file. If the file
    // is opened with read access, these attributes will be read from disk
    // during the open call. If the file is opened with write access, the
    // attributes will be written to disk every file sync or close. This
    // write occurs atomically with update to the file's contents.
    //
    // Custom attributes are uniquely identified by an 8-bit type and limited
    // to LFS_ATTR_MAX bytes. When read, if the stored attribute is smaller
    // than the buffer, it will be padded with zeros. If the stored attribute
    // is larger, then it will be silently truncated. If the attribute is not
    // found, it will be created implicitly.
    struct lfs_attr *attrs;

    // Number of custom attributes in the list
    lfs_size_t attr_count;
};


/// internal littlefs data structures ///
typedef struct lfs_cache {
    lfs_block_t block;
    lfs_off_t off;
    lfs_size_t size;
    uint8_t *buffer;
} lfs_cache_t;

typedef struct lfs_mdir {
    lfs_block_t pair[2];
    uint32_t rev;
    lfs_off_t off;
    uint32_t etag;
    uint16_t count;
    bool erased;
    bool split;
    lfs_block_t tail[2];
} lfs_mdir_t;

// littlefs directory type
typedef struct lfs_dir {
    struct lfs_dir *next;
    uint16_t id;
    uint8_t type;
    lfs_mdir_t m;

    lfs_off_t pos;
    lfs_block_t head[2];
} lfs_dir_t;

// littlefs file type
typedef struct lfs_file {
    struct lfs_file *next;
    uint16_t id;
    uint8_t type;
    lfs_mdir_t m;

    struct lfs_ctz {
        lfs_block_t head;
        lfs_size_t size;
    } ctz;

    uint32_t flags;
    lfs_off_t pos;
    lfs_block_t block;
    lfs_off_t off;
    lfs_cache_t cache;

    const struct lfs_file_config *cfg;
} lfs_file_t;

typedef struct lfs_superblock {
    uint32_t version;
    lfs_size_t block_size;
    lfs_size_t block_count;
    lfs_size_t name_max;
    lfs_size_t file_max;
    lfs_size_t attr_max;
} lfs_superblock_t;

typedef struct lfs_gstate {
    uint32_t tag;
    lfs_block_t pair[2];
} lfs_gstate_t;

// The littlefs filesystem type
typedef struct lfs {
    lfs_cache_t rcache;
    lfs_cache_t pcache;

    lfs_block_t root[2];
    struct lfs_mlist {
        struct lfs_mlist *next;
        uint16_t id;
        uint8_t type;
        lfs_mdir_t m;
    } *mlist;
    uint32_t seed;

    lfs_gstate_t gstate;
    lfs_gstate_t gdisk;
    lfs_gstate_t gdelta;

    struct lfs_free {
        lfs_block_t off;
        lfs_block_t size;
        lfs_block_t i;
        lfs_block_t ack;
        uint32_t *buffer;
    } free;

    const struct lfs_config *cfg;
    lfs_size_t name_max;
    lfs_size_t file_max;
    lfs_size_t attr_max;

#ifdef LFS_MIGRATE
    struct lfs1 *lfs1;
#endif
} lfs_t;
*/

/// Filesystem functions ///

/**
 * Format a block device with the littlefs
 *
 * Requires a littlefs object and config struct. This clobbers the littlefs object, and does not
 * leave the filesystem mounted. The config struct must be zeroed for defaults and backwards compatibility.
 *
 * Returns a negative error code on failure.
 */
export const lfs_format = cwrap('lfs_format', 'number', ['number', 'number']);

/**
 * Mounts a littlefs
 *
 * Requires a littlefs object and config struct. Multiple filesystems may be mounted simultaneously
 * with multiple littlefs objects. Both lfs and config must be allocated while mounted. The config
 * struct must be zeroed for defaults and backwards compatibility.
 *
 * Returns a negative error code on failure.
 */
export const lfs_format = cwrap('lfs_mount', 'number', ['number', 'number']);

/**
 * Unmounts a littlefs
 *
 * Does nothing besides releasing any allocated resources. Returns a negative error code on failure.
 */
export const lfs_unmount = cwrap('lfs_mount', 'number', ['number']);

/// General operations ///

/**
 * Removes a file or directory
 *
 * If removing a directory, the directory must be empty. Returns a negative error code on failure.
 */
export const lfs_remove = cwrap('lfs_remove', 'number', ['number', 'string']);

/**
 * Rename or move a file or directory
 *
 * If the destination exists, it must match the source in type. If the destination is a directory,
 * the directory must be empty.
 *
 * Returns a negative error code on failure.
 */
export const lfs_rename = cwrap('lfs_rename', 'number', ['number', 'string', 'string']);

/**
* Find info about a file or directory
*
* Fills out the info structure, based on the specified file or directory.
* Returns a negative error code on failure.
*/
export const lfs_rename = cwrap('lfs_rename', 'number', ['number', 'string', 'number']);

/** Get a custom attribute
*
* Custom attributes are uniquely identified by an 8-bit type and limited
* to LFS_ATTR_MAX bytes. When read, if the stored attribute is smaller than
* the buffer, it will be padded with zeros. If the stored attribute is larger,
* then it will be silently truncated. If no attribute is found, the error
* LFS_ERR_NOATTR is returned and the buffer is filled with zeros.
*
* Returns the size of the attribute, or a negative error code on failure.
* Note, the returned size is the size of the attribute on disk, irrespective
* of the size of the buffer. This can be used to dynamically allocate a buffer
* or check for existance.
*/
export const lfs_getattr = cwrap('lfs_getattr', 'number', ['number', 'string', 'number', 'number', 'number']);

/** Set custom attributes
*
* Custom attributes are uniquely identified by an 8-bit type and limited
* to LFS_ATTR_MAX bytes. If an attribute is not found, it will be
* implicitly created.
*
* Returns a negative error code on failure.
*/
export const lfs_setattr = cwrap('lfs_setattr', 'number', ['number', 'string', 'number', 'number', 'number']);

/** Removes a custom attribute
*
* If an attribute is not found, nothing happens.
*
* Returns a negative error code on failure.
*/
export const lfs_removeattr = cwrap('lfs_removeattr', 'number', ['number', 'string', 'number']);

/// File operations ///

/** Open a file
*
* The mode that the file is opened in is determined by the flags, which
* are values from the enum lfs_open_flags that are bitwise-ored together.
*
* Returns a negative error code on failure.
*/
export const lfs_file_open = cwrap('lfs_file_open', 'number', ['number', 'number', 'string', 'number']);

/** Open a file with extra configuration
*
* The mode that the file is opened in is determined by the flags, which
* are values from the enum lfs_open_flags that are bitwise-ored together.
*
* The config struct provides additional config options per file as described
* above. The config struct must be allocated while the file is open, and the
* config struct must be zeroed for defaults and backwards compatibility.
*
* Returns a negative error code on failure.
*/
export const lfs_file_opencfg = cwrap('lfs_file_opencfg', 'number', ['number', 'number', 'string', 'number', 'number']);

/* Close a file
*
* Any pending writes are written out to storage as though
* sync had been called and releases any allocated resources.
*
* Returns a negative error code on failure.
*/
export const lfs_file_close = cwrap('lfs_file_close', 'number', ['number', 'number']);

/** Synchronize a file on storage
 *
 * Any pending writes are written out to storage.
 * Returns a negative error code on failure.
 */
 export const lfs_file_sync = cwrap('lfs_file_sync', 'number', ['number', 'number']);

/** Read data from file
*
* Takes a buffer and size indicating where to store the read data.
* Returns the number of bytes read, or a negative error code on failure.
*/
export const lfs_file_read = cwrap('lfs_file_read', 'number', ['number', 'number', 'number', 'number']);

/** Write data to file
*
* Takes a buffer and size indicating the data to write. The file will not
* actually be updated on the storage until either sync or close is called.
*
* Returns the number of bytes written, or a negative error code on failure.
*/
export const lfs_file_write = cwrap('lfs_file_write', 'number', ['number', 'number', 'number', 'number']);

/** Change the position of the file
*
* The change in position is determined by the offset and whence flag.
* Returns the new position of the file, or a negative error code on failure.
*/
export const lfs_file_seek = cwrap('lfs_file_seek', 'number', ['number', 'number', 'number', 'number']);

/** Truncates the size of the file to the specified size
*
* Returns a negative error code on failure.
*/
export const lfs_file_truncate = cwrap('lfs_file_truncate', 'number', ['number', 'number', 'number']);

/** Return the position of the file
*
* Equivalent to lfs_file_seek(lfs, file, 0, LFS_SEEK_CUR)
* Returns the position of the file, or a negative error code on failure.
*/
export const lfs_file_tell = cwrap('lfs_file_tell', 'number', ['number', 'number']);

/** Change the position of the file to the beginning of the file
*
* Equivalent to lfs_file_seek(lfs, file, 0, LFS_SEEK_SET)
* Returns a negative error code on failure.
*/
export const lfs_file_rewind = cwrap('lfs_file_rewind', 'number', ['number', 'number']);

/** Return the size of the file
*
* Similar to lfs_file_seek(lfs, file, 0, LFS_SEEK_END)
* Returns the size of the file, or a negative error code on failure.
*/
export const lfs_file_size = cwrap('lfs_file_size', 'number', ['number', 'number']);

/// Directory operations ///

/** Create a directory
*
* Returns a negative error code on failure.
*/
export const lfs_mkdir = cwrap('lfs_mkdir', 'number', ['number', 'string']);

/** Open a directory
*
* Once open a directory can be used with read to iterate over files.
* Returns a negative error code on failure.
*/
export const lfs_dir_open = cwrap('lfs_dir_open', 'number', ['number', 'number', 'string']);

/** Close a directory
*
* Releases any allocated resources.
* Returns a negative error code on failure.
*/
export const lfs_dir_close = cwrap('lfs_dir_close', 'number', ['number', 'number']);

/** Read an entry in the directory
//
// Fills out the info structure, based on the specified file or directory.
// Returns a positive value on success, 0 at the end of directory,
// or a negative error code on failure.
*/
int lfs_dir_read(lfs_t *lfs, lfs_dir_t *dir, struct lfs_info *info);

/** Change the position of the directory
//
// The new off must be a value previous returned from tell and specifies
// an absolute offset in the directory seek.
//
// Returns a negative error code on failure.
*/
int lfs_dir_seek(lfs_t *lfs, lfs_dir_t *dir, lfs_off_t off);

/** Return the position of the directory
*
* The returned offset is only meant to be consumed by seek and may not make
* sense, but does indicate the current position in the directory iteration.
*
* Returns the position of the directory, or a negative error code on failure.
*/
lfs_soff_t lfs_dir_tell(lfs_t *lfs, lfs_dir_t *dir);

/** Change the position of the directory to the beginning of the directory
*
* Returns a negative error code on failure.
*/
int lfs_dir_rewind(lfs_t *lfs, lfs_dir_t *dir);


/// Filesystem-level filesystem operations

/** Finds the current size of the filesystem
*
* Note: Result is best effort. If files share COW structures, the returned
* size may be larger than the filesystem actually is.
*
* Returns the number of allocated blocks, or a negative error code on failure.
*/
lfs_ssize_t lfs_fs_size(lfs_t *lfs);

/** Traverse through all blocks in use by the filesystem
*
* The provided callback will be called with each block address that is
* currently in use by the filesystem. This can be used to determine which
* blocks are in use or how much of the storage is available.
*
* Returns a negative error code on failure.
*/
int lfs_fs_traverse(lfs_t *lfs, int (*cb)(void*, lfs_block_t), void *data);
