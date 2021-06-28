# Littlefs Web Assembly Makefile
# Make sure you have EMScripten SDK (emsdk) installed in your path:
# https://emscripten.org/docs/getting_started/downloads.html#installation-instructions-using-the-emsdk-recommended

CC=emcc
SOURCES=littlefs/lfs.c littlefs/lfs_util.c lfsapi.c
EXPORTS=_lfs_format,_lfs_mount,_lfs_unmount,_lfs_remove,_lfs_rename,_lfs_stat,_lfs_getattr,_lfs_setattr,_lfs_removeattr,_lfs_file_open,\
	_lfs_file_opencfg,_lfs_file_close,_lfs_file_sync,_lfs_file_read,_lfs_file_write,_lfs_file_seek,_lfs_file_truncate,_lfs_file_tell,\
	_lfs_file_rewind,_lfs_file_size,_lfs_mkdir,_lfs_dir_open,_lfs_dir_close,_lfs_dir_read,_lfs_dir_seek,_lfs_dir_tell,_lfs_dir_rewind,\
	_lfs_fs_size,_lfs_fs_traverse
CFLAGS = -s MODULARIZE=1 -s 'EXPORT_NAME="littlefs"' -s EXPORT_ES6=1 -I littlefs \
	-s 'EXPORTED_FUNCTIONS=$(EXPORTS)' \
	-s EXPORTED_RUNTIME_METHODS="['addFunction', 'cwrap']" -s ALLOW_TABLE_GROWTH=1 -s ASSERTIONS=0

all: dist/littlefs.js dist/littlefs-browser.js

dist/littlefs.js: $(SOURCES) | dist
	$(CC) -o $@ $(CFLAGS) $^

dist/littlefs-browser.js: $(SOURCES) | dist
	$(CC) -o $@ $(CFLAGS) -s ENVIRONMENT=web $^

dist:
	mkdir $@

clean:
	rm -rf dist
