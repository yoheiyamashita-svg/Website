# System Architecture

## 1. 基本方針

本システムは、

> Physics Model
> → Simulation State
> → Renderer
> → UI

の責務を明確に分離する。

物理計算と描画処理を混在させない。

---

# 2. 全体構成

```text
┌──────────────────────────────────┐
│           Application             │
│                                  │
│  ┌────────────┐  ┌─────────────┐ │
│  │ UI Layer   │  │ App Control │ │
│  └──────┬─────┘  └──────┬──────┘ │
│         │               │        │
│         └───────┬───────┘        │
│                 ↓                │
│         Simulation State         │
│                 ↓                │
│          Physics Engine          │
│                 ↓                │
│         Rendering Engine         │
│                 ↓                │
│              Canvas              │
└──────────────────────────────────┘

3. レイヤー
3.1 UI Layer

責務：

スライダー
ボタン
表示モード
学習モード
数値表示

UIは物理計算を直接実行してはならない。

3.2 Application Layer

責務：

アプリケーション状態管理
シミュレーション開始
停止
リセット
モード変更
UIとPhysics Engineの接続
3.3 Physics Layer

責務：

物理モデル
粒子状態計算
波動計算
定常波
気柱振動
物理量計算

Canvas APIを直接参照してはならない。

3.4 Simulation Layer

責務：

時刻
粒子状態
パラメータ
シミュレーション状態

を管理する。

3.5 Rendering Layer

責務：

Canvasへの描画
粒子
波形
矢印
軸
ラベル
ハイライト

物理法則を計算してはならない。

Physics Layerから受け取った状態を描画する。

4. 推奨ディレクトリ構造
physics-simulator/
│
├── index.html
│
├── css/
│   ├── style.css
│   ├── layout.css
│   └── components.css
│
├── js/
│   ├── main.js
│   │
│   ├── app/
│   │   ├── App.js
│   │   └── AppState.js
│   │
│   ├── physics/
│   │   ├── WaveModel.js
│   │   ├── LongitudinalWave.js
│   │   ├── StandingWave.js
│   │   └── AirColumn.js
│   │
│   ├── simulation/
│   │   ├── Simulation.js
│   │   ├── Particle.js
│   │   └── SimulationState.js
│   │
│   ├── renderer/
│   │   ├── CanvasRenderer.js
│   │   ├── ParticleRenderer.js
│   │   ├── WaveRenderer.js
│   │   └── ArrowRenderer.js
│   │
│   ├── ui/
│   │   ├── Controls.js
│   │   ├── Slider.js
│   │   ├── ModeSelector.js
│   │   └── LearningMode.js
│   │
│   └── utils/
│       ├── math.js
│       └── constants.js
│
├── tests/
│   ├── physics/
│   └── simulation/
│
├── docs/
│   ├── requirements.md
│   ├── physics.md
│   └── architecture.md
│
└── README.md
5. Simulation State

Simulation Stateはアプリケーションの唯一の物理状態を保持する。

例：

{
    time: 0,
    amplitude: 0.5,
    wavelength: 2.0,
    frequency: 1.0,
    phase: 0,
    particles: [...]
}

Rendererはこの状態を読み取り、描画する。

6. Particle Object

粒子は最低限以下を保持する。

{
    initialPosition,
    position,
    displacement,
    velocity
}

必要に応じて、

acceleration

を追加する。

7. Physics Engine

Physics Engineは、

parameters
     ↓
physics calculation
     ↓
particle state

を担当する。

例：

calculateDisplacement(x, t, parameters)
calculateParticleVelocity(x, t, parameters)

などを提供する。

8. Renderer

RendererはPhysics Engineの関数を直接呼び出して物理量を再計算しない。

Simulation Stateに格納された状態を描画する。

これにより、

Physics
   ↓
State
   ↓
Renderer

という一方向のデータフローを維持する。

9. 3表示モード

RendererはModeを受け取り、表示内容を切り替える。

MODE_PARTICLES

MODE_PARTICLES_AND_WAVE

MODE_FULL_EXPLANATION
MODE_PARTICLES

粒子のみ。

MODE_PARTICLES_AND_WAVE

粒子 + 波形。

MODE_FULL_EXPLANATION

粒子 + 粒子変位矢印 + 波形 + 波形上の上下矢印。

10. アニメーションループ

基本ループ：

requestAnimationFrame
        ↓
calculate delta time
        ↓
update simulation
        ↓
update physics state
        ↓
clear canvas
        ↓
render
        ↓
next frame
11. 時間管理

物理時間と描画フレームを分離する。

フレームレートが変化しても物理時間が不自然に変化しないようにする。

基本的には、

deltaTime = currentTime - previousTime

を利用する。

12. Canvas

初期バージョンではCanvas 2D APIを使用する。

Canvasを複数使用してもよい。

候補：

Canvas 1
粒子

Canvas 2
波形

Canvas 3
補助情報

ただし、レイヤー管理が複雑になる場合は単一Canvasにまとめる。

13. 座標系

物理座標と画面座標を分離する。

Physics Coordinate
        ↓
Coordinate Transform
        ↓
Canvas Coordinate

物理座標：

x[m]

画面座標：

X[px]
14. スケーリング

物理量をCanvas上のピクセルに変換する。

例えば、

1 m = 200 px

などのScaleをSimulationとは独立して保持する。

15. UIと物理パラメータ

UI Sliderが直接Physics Modelを変更してはならない。

Slider
 ↓
App State
 ↓
Simulation Parameters
 ↓
Physics Engine

という流れにする。

16. モード切替

表示モードを変更しても、

time
particle state
physical parameters

は変更しない。

つまり、

Mode変更
↓
表示だけ変更
↓
物理状態は維持

する。

17. 学習モード

LearningModeはPhysics Engineとは独立したモジュールとする。

Question
 ↓
User Answer
 ↓
Simulation
 ↓
Result
 ↓
Explanation

を管理する。

学習モードから物理モデルを直接変更しない。

18. 将来拡張

将来的に、

physics/
├── mechanics/
├── wave/
├── thermodynamics/
├── electromagnetism/
└── modern/

と分割できる構造を維持する。

19. 波動モジュール

波動は、

physics/wave/

として独立させる。

想定：

wave/
├── TravelingWave.js
├── LongitudinalWave.js
├── TransverseWave.js
├── Reflection.js
├── Superposition.js
├── Interference.js
├── StandingWave.js
├── AirColumn.js
├── DopplerEffect.js
└── Beats.js
20. テスト

物理モデルには単体テストを実装する。

テスト対象：

数式
パラメータ
粒子位置
変位
速度
波速
波長
周波数
境界条件
21. Rendererのテスト

Rendererについては、物理計算の正確性をテストしない。

Rendererは、

正しい状態を受け取る
正しい表示モードを選択する
Canvas描画処理を行う

ことを確認する。

物理的正確性はPhysics Layerのテストで保証する。

22. コーディング原則
原則1

物理計算と描画を混在させない。

原則2

UIから物理モデルを直接操作しない。

原則3

同じ物理量を複数箇所で再計算しない。

原則4

物理モデルを変更したらテストを更新する。

原則5

物理的な意味が不明な変数名を使用しない。

悪い例：

a
b
temp
value

良い例：

amplitude
wavelength
frequency
angularFrequency
displacement
particleVelocity
23. パフォーマンス

初期目標：

100〜500粒子
60 FPS

を一般的なPCで実現する。

大量粒子が必要になった場合は、

Canvas最適化
OffscreenCanvas
WebGL

を検討する。

ただし初期段階では最適化を目的とした複雑化を避ける。

24. 開発順序
Stage 1

Canvas基盤

Stage 2

Particle Model

Stage 3

Longitudinal Wave

Stage 4

Waveform Renderer

Stage 5

3表示モード

Stage 6

UI Controls

Stage 7

Learning Mode

Stage 8

Reflection

Stage 9

Superposition

Stage 10

Standing Wave

Stage 11

Air Column

Stage 12

Sound

Stage 13

Doppler Effect

25. 重要な設計思想

このプロジェクトでは、

「アニメーションを作る」

のではなく、

「物理状態を計算し、その状態を複数の表現方法で可視化する」

ことを基本設計とする。

例えば縦波では、

             Physical State
                   │
          ┌────────┼────────┐
          ↓        ↓        ↓
        粒子      変位      圧力
          │        │        │
          ↓        ↓        ↓
       Canvas    Graph    Density

という構造を維持する。

これにより、将来的に同じ物理状態から、

アニメーション
グラフ
数値
音
学習問題

を生成できる。

26. 完成条件

MVPの完成条件：

100個以上の粒子が縦波として運動する。
粒子の運動が滑らかである。
同じ物理モデルから変位波形を生成する。
粒子と波形が完全に同期する。
3つの表示モードを切り替えられる。
振幅・波長・周波数をスライダーで変更できる。
スライダー横に数値が表示される。
再生・停止・リセットができる。
物理モデルの単体テストが存在する。
学習モードの基本機能が動作する。
既存参考サイトの基本的な波動表示に対して下位互換にならない。
将来の定常波・気柱振動を追加可能な構造になっている。
