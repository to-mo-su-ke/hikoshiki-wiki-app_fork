# hikosiki-wiki project

これは非公式wikiプロジェクトのフロントエンド: Expoアプリ(ExpoはreactNativeのフレームワークです．)のリポジトリです．

# アプリの利用者の皆様へ

利用者向けの案内は本リポジトリには含まれておりません．

# フロントエンド開発者へ

以下の案内は，未経験者にレベルを合わせて書いています．経験者は全文に目を通したり，記述に完全に従ったりする必要はありません．必要なところだけ見てもらえれば大丈夫です．

## clone

自分のPCにローカルリポジトリ (プロジェクトのための自分専用の作業スペース) を用意することをcloneといいます．
以下のコマンドでリポジトリをクローンしてください．

```: console
git clone git@github.com:HBenpitsu/hikoshiki-wiki-app.git
```

失敗する場合はアカウントにsshキーが紐付けられていません．
応急的に以下のコマンドでcloneすることもできますが，Push (あなたのPCでの作業の成果をリモートリポジトリ@github, 全員共有の作業スペース, に反映することです) できません．本格的に開発を始める前にGithubにssh-keyを登録するか，トークンを発行してください．

```: console
git clone https://github.com/HBenpitsu/hikoshiki-wiki-app.git
```

ssh-keyの登録は[この記事](https://qiita.com/shizuma/items/2b2f873a0034839e47ce)に説明されています．よくわからなければ確認してください．

登録後にもう一度cloneしてください．

## clone直後にすること

アプリを機能させるためには，`node_modules`というディレクトリ(Windowsではフォルダ)が必要ですが，node_modulesは容量が大きいため，gitおよびgithub上では管理されません．
そのため，以下のコマンドを実行して`node_modules`を生成する必要があります．

クローンしたリポジトリに入って

```: console
npm install
```

yarnでも構いませんが，よくわからないというひとはnpmを使ってください．

### npmが見つからないと言われるとき

インストールされていないかpathが通っていません．
node.jsおよびnpmのインストール方法は複数ありますので，各自で調べてインストール，pathの登録を行ってください．

## デバッグ

次のコマンドでデバッグを開始します．

```: console
npx expo start
```

QRコードが表示されるので，それを読み取れば良いです．
ただし，Expo Goなるスマホアプリをインストールする必要があるので注意してください．

もし，そのバージョンに対応していない云々みたいなことを言われたときはExpo Goに更新が来ていないか確認してください．

## push

自分専用の作業スペース = ローカルリポジトリ の成果を 全員共有の作業スペース = リモートリポジトリ に反映させることを
`push`といいます．pushは以下のコマンドで行います．

```: console
git push origin <branch name>
```

`<branch name>`には反映させるブランチの名前を指定します．例えば

```: console
git push origin feat-message-screen-ui
```

といった感じです．

`git push`と調べるとよくでてきますが，以下のコマンドは安易に実行しないでください．

```: console
git push origin main
```

# 記録

本プロジェクトは次のコマンドで初期化されました

```: console
npx create-expo-app@latest --template
```

app-name: hikoshikiWiki
template: blank
