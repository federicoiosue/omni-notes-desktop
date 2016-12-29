# Omni Notes Desktop

[![Stories in Ready](https://badge.waffle.io/federicoiosue/omni-notes-desktop.png?label=ready&title=Ready)](http://waffle.io/federicoiosue/omni-notes-desktop)
[![Codacy grade](https://img.shields.io/codacy/grade/a8a70aae80314f78bae3042fcac432db.svg?style=plastic)](https://www.codacy.com/app/federico-iosue/omni-notes-desktop/dashboard)

<img src="https://github.com/federicoiosue/omni-notes-desktop/raw/develop/etc/img1.png" width="600" alt="Notes' list">
<img src="https://github.com/federicoiosue/omni-notes-desktop/raw/develop/etc/img2.png" width="600" alt="Note editing">

This is the official desktop counterpart of the Android open-source note-taking app [Omni Notes](https://github.com/federicoiosue/Omni-Notes).
It's built on top [Electron](http://electron.atom.io) and [AngularJS](https://angularjs.org) technologies.

## Compatibility

The application is cross-platform and runs on Linux, Windows and Mac.

It currently has no backend and just uses JSONs to store and read data. So, **no sync is supported**, if you want to keep data updated through different platforms you have to use third-party synchronization applications.

## Development

### Environment
To download all the needed dependencies for the application to run, listed into the _package.json_ file use the command: ```npm install angular```

### Build
[Electron Packager](https://github.com/electron-userland/electron-packager) is needed to build the project into executable binary.
```
sudo npm install electron-packager -g
```

After that simply run ```electron-packager .``` command from inside the project app to build for your platform.

Otherwise here the specific platform shortcuts for build commands (64bit architectures for Linux and MacOS, 32bit for Windows) that will prepare distributable folders into _dist_:

```package-linux```

```package-mac```

```package-win```

## Developed with love and passion by
* Federico Iosue - [Website](http://www.iosue.it/federico)

## License
The application is licensed under [GPL3](LICENSE.md) so, if you want to use it fully or any part of it you **have to** release the source code.
