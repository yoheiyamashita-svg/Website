// 物理・シミュレーションのデフォルト値と定数をまとめるモジュール。
// 「magic number」をコードの各所に直接書かず、意味のある名前と単位コメントを付けて
// 一箇所で管理する（コーディング規約 §11「magic numberを理由なく書かない」）。

// 媒質を表す粒子の初期個数。
// 100〜500粒子程度で60FPSを維持することをarchitecture.md §23で目標としているため、
// その範囲の中間的な値をデフォルトとする。
export const DEFAULT_PARTICLE_COUNT = 150;

// 振幅 A の初期値 [m]。
export const DEFAULT_AMPLITUDE = 0.3;
// 波長 λ の初期値 [m]。
export const DEFAULT_WAVELENGTH = 2.0;
// 周波数 f の初期値 [Hz]（1秒間に何回振動するか）。
export const DEFAULT_FREQUENCY = 0.5;
// 初期位相 φ の初期値 [rad]。0はt=0, x=0で変位が0であることを意味する。
export const DEFAULT_PHASE = 0;

// 振幅スライダーの可動範囲 [m]。0を含めることで physics.md TEST-001（A=0でu=0）を
// UI上でも確認できるようにする。
export const AMPLITUDE_MIN = 0;
export const AMPLITUDE_MAX = 0.8;
export const AMPLITUDE_STEP = 0.01;

// 波長スライダーの可動範囲 [m]。
export const WAVELENGTH_MIN = 0.5;
export const WAVELENGTH_MAX = 5.0;
export const WAVELENGTH_STEP = 0.1;

// 周波数スライダーの可動範囲 [Hz]。
export const FREQUENCY_MIN = 0.1;
export const FREQUENCY_MAX = 2.0;
export const FREQUENCY_STEP = 0.1;

// 媒質（粒子群）の物理空間上の全長 [m]。
// 粒子はこの範囲(0〜MEDIUM_LENGTH)に等間隔で配置する。
export const MEDIUM_LENGTH = 6.0;

// 表示モード定数（architecture.md §9）。
// 文字列比較にすることで、Rendererがどのモードを描画すべきかを
// switch/if文の中で読みやすく判定できるようにする。
export const MODE_PARTICLES = "MODE_PARTICLES"; // Mode A: 粒子のみ
export const MODE_PARTICLES_AND_WAVE = "MODE_PARTICLES_AND_WAVE"; // Mode B: 粒子+波形
export const MODE_FULL_EXPLANATION = "MODE_FULL_EXPLANATION"; // Mode C: 粒子+波形+対応矢印
// Mode D: 波形のみ（粒子を表示しない）。気柱振動タブだけで使う表示モード
// （js/ui/ModeSelector.jsのmodeLabels引数経由で、気柱振動タブのモード選択にだけ追加する）。
export const MODE_WAVE_ONLY = "MODE_WAVE_ONLY";

// 再生速度の選択肢（等倍に対する倍率、単位なし）。
export const PLAYBACK_SPEEDS = [0.25, 0.5, 1, 2];
export const DEFAULT_PLAYBACK_SPEED = 1;

// 気柱振動（定常波）専用の再生速度の選択肢。
// 気柱の固有振動数f_nは典型的な設定でも数十〜数百Hzあり、1周期が数ミリ秒しかないため、
// 縦波用のPLAYBACK_SPEEDS（最遅0.25倍）程度の減速では振動がまったく目に見えない。
// 例：f=170Hzの場合、周期は約5.9ms。人の目で「ゆっくりした振動」として
// 追える周期（およそ1〜3秒程度）まで見せるには、1/100〜1/1000程度の
// 大幅な減速が必要になるため、この専用の選択肢を用意する。
export const AIR_COLUMN_PLAYBACK_SPEEDS = [0.001, 0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 1];
// 気柱振動タブを開いた直後から振動が目に見える速さになるよう、DEFAULT_PLAYBACK_SPEED(1倍)
// ではなくAIR_COLUMN_PLAYBACK_SPEEDSの中の十分遅い値をデフォルトにする（ユーザー要望）。
export const DEFAULT_AIR_COLUMN_PLAYBACK_SPEED = 0.005;

// コマ送り1回あたりに進める物理時間 [s]。
// 60FPSを目標フレームレートとしているため、1フレーム分(1/60秒)を1コマとする。
export const STEP_FRAME_DELTA_TIME = 1 / 60;

// 1フレームで進めてよい物理時間の最大値 [s]（NFR-001対応）。
// 低性能端末でフレーム間隔が一時的に開いた場合、そのまま大きなdeltaTimeを
// シミュレーションに渡すと粒子が「瞬間移動」して見えてしまう。
// 1フレームあたりの進行を最大でも1/15秒に制限することで、
// 見た目の破綻を防ぎつつ物理時間の進行方向自体は正しく保つ。
export const MAX_DELTA_TIME = 1 / 15;

// 音速 v の初期値 [m/s]。空気中の音速のおおよその値（気温15℃前後）を初期値とする。
// ハードコードした数値をあちこちに直接書かず、この名前付き定数を経由することで、
// 将来「気温から音速を計算する」等の拡張をしても変更箇所がここ1つで済むようにする。
export const DEFAULT_SOUND_SPEED = 340;

// 音速スライダーの可動範囲 [m/s]。気温によって音速が変化する範囲（およそ0〜30℃相当）を
// 想定した目安の範囲。v = 331.5 + 0.6×気温[℃] という近似式から、
// 0℃で約331.5m/s、30℃で約349.5m/sとなることを参考にしている。
export const SOUND_SPEED_MIN = 300;
export const SOUND_SPEED_MAX = 360;
export const SOUND_SPEED_STEP = 1;

// 縦波・気柱振動 共通：粒子数（気柱振動では「長さ方向の列数」）スライダーの可動範囲。
// 上限はDEFAULT_PARTICLE_COUNTと一致させる。下限の10は、現在のCanvas幅・
// 媒質の全長(MEDIUM_LENGTH)・粒子半径(4px)の組み合わせでも、
// 粒子1つ1つの間隔と動きが目で追える最小限の個数として設定した
// （requirements.md 指示書§9-1：粒子数を減らすことで粗密・矢印・波形との対応が見やすくなる）。
export const PARTICLE_COUNT_MIN = 10;
export const PARTICLE_COUNT_MAX = 150;
export const PARTICLE_COUNT_STEP = 1;

// ==== 気柱振動（acoustic）専用の定数 ====

// 気柱の両端それぞれの種類。文字列比較で判定する。
// 以前は「音源側(x=0)は常に開口」という絶対条件があり、反対側だけを表す
// BOUNDARY_TYPE_OPEN_OPEN/OPEN_CLOSEDという1つの値で境界条件を表していたが、
// 音源側も選べるようにしたため、両端それぞれの種類（開口/閉口）を独立に持つ形に変更した。
// js/physics/acoustic/AirColumn.jsが、この2つの値の組み合わせから
// 固有値条件（kLの決まり方）と空間分布（cos/sin）を導出する。
export const AIR_COLUMN_END_OPEN = "open";
export const AIR_COLUMN_END_CLOSED = "closed";
// 初期状態は両端開口とする。両端が対称（両方とも腹）で、進行波の縦波モデルから
// 気柱振動へ話を広げるときに直感的に理解しやすいと考え、こちらを初期値にした
// （以前のDEFAULT_BOUNDARY_TYPE=両端開管と同じ初期挙動）。
export const DEFAULT_SOURCE_END_TYPE = AIR_COLUMN_END_OPEN;
export const DEFAULT_FAR_END_TYPE = AIR_COLUMN_END_OPEN;

// 気柱の長さ L の初期値 [m]。指示書§16の例（1.00 m）に合わせる。
export const DEFAULT_TUBE_LENGTH = 1.0;
// 気柱長スライダーの可動範囲 [m]。
// 上限3.0mは教室で提示する模式図として妥当な長さ、下限0.2mは
// DEFAULT_SOUND_SPEED(340m/s)のとき一端閉管の基本振動数が
// f1=v/4L=425Hzとなり、可聴域として違和感のない範囲であることを確認して決めた。
export const TUBE_LENGTH_MIN = 0.2;
export const TUBE_LENGTH_MAX = 3.0;
export const TUBE_LENGTH_STEP = 0.05;

// 開口端補正 Δx の初期値・可動範囲 [m]。
// 実際の気柱では、開口端の少し外側の空気も一緒に振動するため、変位の腹が
// 開口部よりΔxだけ外側にできる（js/physics/acoustic/OpenOpenTube.js等のコメント参照）。
// デフォルトは0（補正なし＝これまでと同じ挙動）。上限0.1mは、下限のTUBE_LENGTH_MIN(0.2m)の
// 半分程度までとし、補正量が気柱の長さそのものより大きくなるような非現実的な設定を避けている。
export const DEFAULT_END_CORRECTION = 0;
export const END_CORRECTION_MIN = 0;
export const END_CORRECTION_MAX = 0.1;
export const END_CORRECTION_STEP = 0.005;

// 開口端補正Δxではみ出す部分の波形を描くための、延長区間のサンプル点数。
// 気柱本体の列(columns)とは別に、開口端の外側[-Δx, 0]（音源側は常に開口なので常に対象）と、
// 両端開管の場合は反対側の外側[L, L+Δx]にも変位を計算し、腹の理論位置まで
// 波形を滑らかにつなげて描画するために使う（Δx=0のときは区間の長さが0になり、
// 実質的に何も描かれない＝これまでと同じ見た目に自然に一致する）。
export const AIR_COLUMN_END_EXTENSION_POINT_COUNT = 12;

// 振動モード番号 n の初期値・可動範囲。
// n=1(基本振動)から始め、上限8は高次モードまで学習で扱える範囲として設定した
// （n=8でも典型的なL・vの組み合わせで固有振動数が可聴域を大きく外れない）。
export const DEFAULT_MODE_NUMBER = 1;
export const MODE_NUMBER_MIN = 1;
export const MODE_NUMBER_MAX = 8;

// 気柱振動の振幅 A の初期値・可動範囲 [m]。
// 気柱は縦波の媒質(MEDIUM_LENGTH=6m)よりずっと短い(TUBE_LENGTH〜1m)スケールで
// 表示するため、縦波用のAMPLITUDE_*とは別の範囲を用意する
// （指示書§25-26：振幅は気柱の枠からはみ出してよく、勝手にclampしないが、
// スライダーの初期可動範囲としては気柱の表示スケールに合わせて小さめにする）。
export const AIR_COLUMN_AMPLITUDE_DEFAULT = 0.15;
export const AIR_COLUMN_AMPLITUDE_MIN = 0;
export const AIR_COLUMN_AMPLITUDE_MAX = 0.6;
export const AIR_COLUMN_AMPLITUDE_STEP = 0.01;

// 気柱の長さ方向の列数（縦波の「粒子数」に相当）の初期値・可動範囲。
// 気柱はCanvas上で縦長に表示するため、横に長い縦波の媒質よりも
// 列数の上限を控えめ(80)にして、1列あたりの間隔が狭くなりすぎないようにしている。
export const AIR_COLUMN_COLUMN_COUNT_DEFAULT = 40;
export const AIR_COLUMN_COLUMN_COUNT_MIN = 10;
export const AIR_COLUMN_COLUMN_COUNT_MAX = 80;
export const AIR_COLUMN_COLUMN_COUNT_STEP = 1;

// 断面方向に表示する粒子の行数（縦波・気柱振動で共用）。指示書§37「縦方向粒子数は
// 内部で固定して構わない」に従い、ユーザーが変更できないUI非公開の表示用定数とする。
// 物理量ではなく、同じ列（縦波では同じx位置）の粒子が同じ変位を持つことを
// 「複数の粒子が束になって動く」行列として視覚的に表現するための値
// （気柱振動だけでなく、縦波の媒質も同じ考え方で行列表示するため共通定数にした）。
export const PARTICLE_ROW_COUNT = 5;

// ==== 横波（定常波）専用の定数 ====

// 両端（左端x=0・右端x=L）それぞれの境界の種類。文字列比較で判定する
// （気柱振動のAIR_COLUMN_END_*と同じ考え方）。以前は左端を「振動源」として
// 境界条件を持たない特別な点として扱っていたが、ユーザー要望により
// 両端とも対等に固定端/自由端を選べる設計に変更した
// （js/physics/wave/TransverseStandingWave.jsのコメント参照：
// 両端に本物の境界条件を置くと、λ・f・Lの組み合わせによっては
// 定常波が発生しない（共鳴しない）ことがあるが、これも仕様として意図的に許容する）。
export const END_TYPE_FIXED = "fixed"; // 固定端：変位が常に0（節）
export const END_TYPE_FREE = "free"; // 自由端：傾きが常に0（腹）
export const DEFAULT_END_TYPE = END_TYPE_FIXED;

// 共鳴からのズレに対する振幅の応答曲線（共振曲線・ローレンツ型）の鋭さを決める定数
// （js/physics/wave/TransverseStandingWave.jsのcalculateResonanceResponse参照）。
// detuning（共鳴からの正規化されたズレ、隣接固有振動どうしの間隔を1とする単位）が
// このRESONANCE_HALF_WIDTHに等しいとき、応答係数はちょうど半分(0.5)になる。
// 0.1という値は、スライダーを共鳴位置から少しズラしただけで振幅がはっきり
// 小さくなる（＝共鳴の鋭さを実感しやすい）程度になるよう選んだ
// （detuning=0.1で応答50%、detuning=0.5＝隣の固有振動との中間点で応答約3.8%と、
// 中間点ではほぼ振動が見えなくなる）。
export const RESONANCE_HALF_WIDTH = 0.1;

// 媒質（弦）の長さ L の初期値・可動範囲 [m]。
// 縦波の媒質(MEDIUM_LENGTH=6m)と同じスケール感にしつつ、右端での反射が
// 画面内でちょうど収まるよう、縦波よりわずかに短い範囲にした。
export const DEFAULT_TRANSVERSE_MEDIUM_LENGTH = 4.0;
export const TRANSVERSE_MEDIUM_LENGTH_MIN = 1.0;
export const TRANSVERSE_MEDIUM_LENGTH_MAX = 6.0;
export const TRANSVERSE_MEDIUM_LENGTH_STEP = 0.1;

// 波形を滑らかに描くためのサンプル点数。粒子を表示しないモードなので、
// 縦波の「粒子数」のようにユーザーが調整できる値ではなく、表示解像度として固定する。
export const TRANSVERSE_WAVE_POINT_COUNT = 200;

// 右向き波・左向き波・合成波、それぞれの透明度の初期値 [%]（0〜100）。
// 3つとも見える状態を初期値にしつつ、主役である合成波を最も目立たせる。
export const DEFAULT_INCIDENT_OPACITY = 60;
export const DEFAULT_REFLECTED_OPACITY = 60;
export const DEFAULT_COMBINED_OPACITY = 100;
export const OPACITY_MIN = 0;
export const OPACITY_MAX = 100;
export const OPACITY_STEP = 5;

// ==== 横波の反射（パルス）専用の定数 ====
//
// 「横波（定常波）」タブは無限に続く正弦波の重ね合わせで定常波を作るが、
// このタブは局所的なパルス（山1つ、またはS字型）が右端に向かって進み、
// 反射して戻ってくる様子そのものを見せることを目的とする独立タブ
// （ユーザー確認済み：既存タブのモード追加ではなく新規タブとする）。

// パルスの形状。文字列比較で判定する（他のEND_TYPE_*等と同じ考え方）。
export const PULSE_SHAPE_BUMP = "bump"; // 単一の山（滑らかな1つのこぶ）
export const PULSE_SHAPE_S = "s"; // S字型（山と谷が対になった、通常サイン波1周期分の形）
export const DEFAULT_PULSE_SHAPE = PULSE_SHAPE_BUMP;

// パルスの半値幅に相当する量 w [m]（js/physics/wave/PulseWave.jsのbumpProfile/sProfile参照）。
// 媒質の長さ(1〜6m)に対して、狭すぎず広すぎない見た目になるよう初期値0.3mとした。
export const DEFAULT_PULSE_WIDTH = 0.3;
export const PULSE_WIDTH_MIN = 0.1;
export const PULSE_WIDTH_MAX = 1.0;
export const PULSE_WIDTH_STEP = 0.05;

// 振動源から右端までの距離（媒質の長さ）L [m]の初期値。
// TRANSVERSE_MEDIUM_LENGTH_MIN〜MAXの可動範囲はそのまま使うが、初期値は
// 「横波（定常波）」タブのDEFAULT_TRANSVERSE_MEDIUM_LENGTH(4.0m)より短くする
// （ユーザー要望：往復距離を短くして、反射の様子を画面内でよりコンパクトに見せる）。
export const DEFAULT_PULSE_MEDIUM_LENGTH = 2.0;

// パルスの伝わる速さ v [m/s]。音速などの現実の値である必要はなく、
// 反射の様子がゆっくり目で追えることを優先した速さにした
// （デフォルト1.0m/s・媒質長2mなら、1往復に数秒かかる程度）。
export const DEFAULT_PULSE_WAVE_SPEED = 1.0;
export const PULSE_WAVE_SPEED_MIN = 0.2;
export const PULSE_WAVE_SPEED_MAX = 3.0;
export const PULSE_WAVE_SPEED_STEP = 0.1;
