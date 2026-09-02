// TypeScript bindings for emscripten-generated code.  Automatically generated at compile time.
declare let RuntimeExports: {
  FS: {
    root: null;
    mounts: never[];
    devices: {};
    streams: never[];
    nextInode: number;
    nameTable: null;
    currentPath: string;
    initialized: boolean;
    ignorePermissions: boolean;
    filesystems: null;
    syncFSRequests: number;
    ErrnoError: {
      new (errno: any): {
        name: string;
        errno: any;
      };
    };
    FSStream: {
      new (): {
        shared: {};
        get object(): any;
        set object(val: any);
        node: any;
        get isRead(): boolean;
        get isWrite(): boolean;
        get isAppend(): number;
        flags: any;
        position: any;
      };
    };
    FSNode: {
      new (
        parent: any,
        name: any,
        mode: any,
        rdev: any
      ): {
        node_ops: {};
        stream_ops: {};
        readMode: number;
        writeMode: number;
        mounted: null;
        parent: any;
        mount: any;
        id: number;
        name: any;
        mode: any;
        rdev: any;
        atime: number;
        mtime: number;
        ctime: number;
        get read(): boolean;
        set read(val: boolean);
        get write(): boolean;
        set write(val: boolean);
        readonly isFolder: any;
        readonly isDevice: any;
        addListener(
          cb: any,
          exclusive?: boolean
        ): {
          listeners: any;
          entry: {
            cb: any;
            exclusive: boolean;
          };
        };
        notifyListeners(flags: any): void;
        exclTurn: any;
      };
    };
    lookupPath(
      path: any,
      opts?: {}
    ):
      | {
          path: string;
          node?: undefined;
        }
      | {
          path: string;
          node: any;
        };
    getPath(node: any): any;
    hashName(parentid: any, name: any): number;
    hashAddNode(node: any): void;
    hashRemoveNode(node: any): void;
    lookupNode(parent: any, name: any): any;
    createNode(parent: any, name: any, mode: any, rdev: any): any;
    destroyNode(node: any): void;
    isRoot(node: any): boolean;
    isMountpoint(node: any): boolean;
    isFile(mode: any): boolean;
    isDir(mode: any): boolean;
    isLink(mode: any): boolean;
    isChrdev(mode: any): boolean;
    isBlkdev(mode: any): boolean;
    isFIFO(mode: any): boolean;
    isSocket(mode: any): boolean;
    flagsToPermissionString(flag: any): string;
    nodePermissions(node: any, perms: any): 0 | 2;
    mayLookup(dir: any): any;
    mayCreate(dir: any, name: any): any;
    mayDelete(dir: any, name: any, isdir: any): any;
    mayOpen(node: any, flags: any): any;
    checkOpExists(op: any, err: any): any;
    MAX_OPEN_FDS: number;
    nextfd(): number;
    getStreamChecked(fd: any): any;
    getStream: (fd: any) => any;
    createStream(stream: any, fd?: number): any;
    closeStream(fd: any): void;
    dupStream(origStream: any, fd?: number): any;
    doSetAttr(stream: any, node: any, attr: any): void;
    chrdev_stream_ops: {
      open(stream: any): void;
      llseek(): never;
    };
    major: (dev: any) => number;
    minor: (dev: any) => number;
    makedev: (ma: any, mi: any) => number;
    registerDevice(dev: any, ops: any): void;
    getDevice: (dev: any) => any;
    getMounts(mount: any): any[];
    syncfs(populate: any, callback: any): void;
    mount(type: any, opts: any, mountpoint: any): any;
    unmount(mountpoint: any): void;
    lookup(parent: any, name: any): any;
    mknod(path: any, mode: any, dev: any): any;
    statfs(path: any): any;
    statfsStream(stream: any): any;
    statfsNode(node: any): {
      bsize: number;
      frsize: number;
      blocks: number;
      bfree: number;
      bavail: number;
      files: any;
      ffree: number;
      fsid: number;
      flags: number;
      namelen: number;
    };
    create(path: any, mode?: number): any;
    mkdir(path: any, mode?: number): any;
    mkdirTree(path: any, mode: any): void;
    mkdev(path: any, mode: any, dev: any): any;
    symlink(oldpath: any, newpath: any): any;
    link(oldpath: any, newpath: any, flags: any): any;
    rename(old_path: any, new_path: any): void;
    rmdir(path: any): void;
    readdir(path: any): any;
    unlink(path: any): void;
    readlink(path: any): any;
    stat(path: any, dontFollow: any): any;
    fstat(fd: any): any;
    lstat(path: any): any;
    doChmod(stream: any, node: any, mode: any, dontFollow: any): void;
    chmod(path: any, mode: any, dontFollow: any): void;
    lchmod(path: any, mode: any): void;
    fchmod(fd: any, mode: any): void;
    doChown(stream: any, node: any, dontFollow: any): void;
    chown(path: any, uid: any, gid: any, dontFollow: any): void;
    lchown(path: any, uid: any, gid: any): void;
    fchown(fd: any, uid: any, gid: any): void;
    doTruncate(stream: any, node: any, len: any): void;
    truncate(path: any, len: any): void;
    ftruncate(fd: any, len: any): void;
    utime(path: any, atime: any, mtime: any, dontFollow: any): void;
    open(path: any, flags: any, mode?: number): any;
    close(stream: any): void;
    isClosed(stream: any): boolean;
    llseek(stream: any, offset: any, whence: any): any;
    read(stream: any, buffer: any, offset: any, length: any, position: any): any;
    write(stream: any, buffer: any, offset: any, length: any, position: any, canOwn: any): any;
    mmap(stream: any, length: any, position: any, prot: any, flags: any): any;
    msync(stream: any, buffer: any, offset: any, length: any, mmapFlags: any): any;
    ioctl(stream: any, cmd: any, arg: any): any;
    readFile(path: any, opts?: {}): Uint8Array<any>;
    writeFile(path: any, data: any, opts?: {}): void;
    cwd: () => any;
    chdir(path: any): void;
    createDefaultDirectories(): void;
    createDefaultDevices(): void;
    createSpecialDirectories(): void;
    createStandardStreams(input: any, output: any, error: any): void;
    staticInit(): void;
    init(input: any, output: any, error: any): void;
    quit(): void;
    findObject(path: any, dontResolveLastLink: any): any;
    analyzePath(
      path: any,
      dontResolveLastLink: any
    ): {
      isRoot: boolean;
      exists: boolean;
      error: number;
      name: null;
      path: null;
      object: null;
      parentExists: boolean;
      parentPath: null;
      parentObject: null;
    };
    createPath(parent: any, path: any, canRead: any, canWrite: any): any;
    createFile(parent: any, name: any, properties: any, canRead: any, canWrite: any): any;
    createDataFile(
      parent: any,
      name: any,
      data: any,
      canRead: any,
      canWrite: any,
      canOwn: any
    ): void;
    createDevice(parent: any, name: any, input: any, output: any): any;
    forceLoadFile(obj: any): true | undefined;
    createLazyFile(parent: any, name: any, url: any, canRead: any, canWrite: any): any;
  };
  NODEFS: {
    isWindows: boolean;
    staticInit(): void;
    convertNodeCode(e: any): any;
    tryFSOperation(f: any): any;
    mount(mount: any): any;
    createNode(parent: any, name: any, mode: any, dev: any): any;
    getMode(path: any): any;
    realPath(node: any): any;
    flagsForNode(flags: any): number;
    getattr(
      func: any,
      node: any
    ): {
      dev: any;
      ino: any;
      mode: any;
      nlink: any;
      uid: any;
      gid: any;
      rdev: any;
      size: any;
      atime: any;
      mtime: any;
      ctime: any;
      blksize: any;
      blocks: any;
    };
    setattr(
      arg: any,
      node: any,
      attr: any,
      chmod: any,
      utimes: any,
      truncate: any,
      stat: any
    ): void;
    node_ops: {
      getattr(node: any): any;
      setattr(node: any, attr: any): void;
      lookup(parent: any, name: any): any;
      mknod(parent: any, name: any, mode: any, dev: any): any;
      rename(oldNode: any, newDir: any, newName: any): void;
      unlink(parent: any, name: any): void;
      rmdir(parent: any, name: any): void;
      readdir(node: any): any;
      symlink(parent: any, newName: any, oldPath: any): void;
      readlink(node: any): any;
      statfs(path: any): any;
    };
    stream_ops: {
      getattr(stream: any): any;
      setattr(stream: any, attr: any): void;
      open(stream: any): void;
      close(stream: any): void;
      dup(stream: any): void;
      read(stream: any, buffer: any, offset: any, length: any, position: any): any;
      write(stream: any, buffer: any, offset: any, length: any, position: any): any;
      llseek(stream: any, offset: any, whence: any): any;
      mmap(
        stream: any,
        length: any,
        position: any,
        prot: any,
        flags: any
      ): {
        ptr: any;
        allocated: boolean;
      };
      msync(stream: any, buffer: any, offset: any, length: any, mmapFlags: any): number;
    };
  };
  WORKERFS: {
    DIR_MODE: number;
    FILE_MODE: number;
    reader: null;
    mount(mount: any): any;
    createNode(parent: any, name: any, mode: any, dev: any, contents: any, mtime: any): any;
    node_ops: {
      getattr(node: any): {
        dev: number;
        ino: any;
        mode: any;
        nlink: number;
        uid: number;
        gid: number;
        rdev: number;
        size: any;
        atime: Date;
        mtime: Date;
        ctime: Date;
        blksize: number;
        blocks: number;
      };
      setattr(node: any, attr: any): void;
      lookup(parent: any, name: any): never;
      mknod(parent: any, name: any, mode: any, dev: any): never;
      rename(oldNode: any, newDir: any, newName: any): never;
      unlink(parent: any, name: any): never;
      rmdir(parent: any, name: any): never;
      readdir(node: any): string[];
      symlink(parent: any, newName: any, oldPath: any): never;
    };
    stream_ops: {
      read(stream: any, buffer: any, offset: any, length: any, position: any): any;
      write(stream: any, buffer: any, offset: any, length: any, position: any): never;
      llseek(stream: any, offset: any, whence: any): any;
    };
  };
};
interface WasmModule {
  callMain(args: Array<string>): number;
}

export type MainModule = WasmModule & typeof RuntimeExports;
export default function MainModuleFactory(options?: unknown): Promise<MainModule>;
