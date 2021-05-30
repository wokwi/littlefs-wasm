emcc -o littlefs.js -s MODULARIZE=1 -s 'EXPORT_NAME="littlefs"' -I littlefs \
  -s 'EXPORTED_FUNCTIONS=_free,_new_lfs,_new_lfs_config,_lfs_write_file,_lfs_format,_lfs_mount,_lfs_unmount' \
  -s EXPORTED_RUNTIME_METHODS="['addFunction', 'cwrap']" -s ALLOW_TABLE_GROWTH=1 -s ASSERTIONS=0 -s ENVIRONMENT=web \
  littlefs/lfs.c littlefs/lfs_util.c lfsapi.c
