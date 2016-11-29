TweetDeck on Electron
=====================

Very short story for this one, I opened the old and obsolete (but until recently, mostly functional) TweetDeck desktop (basically, it loaded the webpage for TweetDeck in its own window), and discovered that it was kinda broken (the icons weren't loading). Knowing that the program I was using was old and not supported anymore, I quickly tweaked [electron-quick-start](https://github.com/atom/electron-quick-start) to load up the TweetDeck webapp into its own window.

It kinda works.

It's sorta buggy, so I'll fix things if and when I find out how to fix them and get the time to.

## node install (For Ubuntu)
```bash
curl -L git.io/nodebrew | perl - setup
```

`.bashrc`に以下の記述を追加．

```bash
# nodebrew
export PATH=$HOME/.nodebrew/current/bin:$PATH
```

```bash
nodebrew ls-remote #適当に最新バージョンを確認してインストール
nodebrew install-binary v7.2.0
nodebrew use v7.2.0
node -v
```

## electron install

```bash
git clone https://github.com/Ry0/Electron-TweetDeck.git
cd Electron-TweetDeck
npm install
npm start
```

```bash
cd ..
npm install -g asar
asar pack ./Electron-TweetDeck ./Electron-TweetDeck.asar
npm install -g electron-packager
# option --platform=<all|linux|win32|darwin> --arch=<all|ia32|x64> --icon==<path>
electron-packager ./Electron-TweetDeck Electron-TweetDeck --platform=all --arch=x64 --version=0.34.0
```

## Ubuntuでランチャー登録

```bash
cp Electron-TweetDeck-linux-x64/resources/app/icon/TweetDeck.desktop /usr/share/applications/
sudo mv Electron-TweetDeck-linux-x64 /usr/lib/
```

Unityに登録されているはず...
