<?php get_header(' '); ?>

<?php
    if (have_posts()) :
    while (have_posts()) :
    the_post();
?>
<?php get_template_part('m_kv'); ?>

<main class="l_main privacy_main">
    <div class="l_contents">
        <div class="l_container-sm">
            <div class="privacy_item-wrapper">
                <div class="privacy_item">
                    <p class="privacy_heading">はじめに</p>
                    <p class="privacy_txt">
                        株式会社〇〇（以下「当社」といいます）は、以下のとおり個人情報保護方針を定め、個人情報保護の仕組みを構築し、全従業員に個人情報保護の重要性の認識と取組みを徹底させることにより、個人情報の保護を推進致します。
                    </p>
                </div>
                <div class="privacy_item">
                    <p class="privacy_heading">個人情報の管理</p>
                    <p class="privacy_txt">
                        当社は、お客さまの個人情報を正確かつ最新の状態に保ち、個人情報への不正アクセス・紛失・破損・改ざん・漏洩などを防止するため、セキュリティシステムの維持・管理体制の整備・社員教育の徹底等の必要な措置を講じ、安全対策を実施し個人情報の厳重な管理を行ないます。
                    </p>
                </div>
                <div class="privacy_item">
                    <p class="privacy_heading">個人情報の利用目的</p>
                    <p class="privacy_txt">
                        お客さまからお預かりした個人情報は、当社からのご連絡や業務のご案内やご質問に対する回答として、電子メールや資料のご送付に利用いたします。個人情報の第三者への開示・提供の禁止当社は、お客さまよりお預かりした個人情報を適切に管理し、次のいずれかに該当する場合を除き、個人情報を第三者に開示いたしません。
                    </p>
                    <div class="privacy_desc-wrapper">
                        <p class="privacy_desc">(1) 本人確認のため</p>
                        <p class="privacy_desc">
                            (2) 講座等の申込、問い合わせ内容の確認及び本契約の遂行のため
                        </p>
                        <p class="privacy_desc">
                            (3)
                            申込者本人からの質問、講座、説明会、各種イベント及び関連事業等に関する案内等各種情報の提供、送付のため
                        </p>
                        <p class="privacy_desc">
                            (4)
                            本契約に関する案内、問い合わせ、アンケート等の依頼、送付のため
                        </p>
                        <p class="privacy_desc">
                            (5)
                            本契約及び業務に関連付随する市場調査、データ収集、分析のため
                        </p>
                        <p class="privacy_desc">
                            (6)
                            お客さまの同意がある場合お客さまが希望されるサービスを行なうために当社が業務を委託する業者に対して開示する場合
                            法令に基づき開示することが必要である場合
                        </p>
                        <p class="privacy_desc">
                            (7) その他前各号に関連付随する業務遂行のため
                        </p>
                    </div>
                </div>
                <div class="privacy_item">
                    <p class="privacy_heading">個人情報の安全対策</p>
                    <p class="privacy_txt">
                        当社は、個人情報の正確性及び安全性確保のために、セキュリティに万全の対策を講じています。
                    </p>
                </div>
                <div class="privacy_item">
                    <p class="privacy_heading">ご本人の照会</p>
                    <p class="privacy_txt">
                        お客さまがご本人の個人情報の照会・修正・削除などをご希望される場合には、ご本人であることを確認の上、対応させていただきます。
                    </p>
                </div>
                <div class="privacy_item">
                    <p class="privacy_heading">法令、規範の遵守と見直し</p>
                    <p class="privacy_txt">
                        当社は、保有する個人情報に関して適用される日本の法令、その他規範を遵守するとともに、本ポリシーの内容を適宜見直し、その改善に努めます。
                    </p>
                </div>
                <div class="privacy_item">
                    <p class="privacy_heading">お問い合わせ</p>
                    <p class="privacy_txt">
                        当社の個人情報の取扱に関するお問い合せは下記までご連絡ください。
                    </p>
                    <div class="privacy_desc-wrapper">
                        <p class="privacy_desc">株式会社〇〇</p>
                        <p class="privacy_desc">000-0000 東京都豊島区池袋0-00-0</p>
                        <p class="privacy_desc">TEL : 00-0000-0000 (定休日：月曜)</p>
                        <p class="privacy_desc">Mail : @info.sample.co</p>
                        <p class="privacy_desc">対応可能時間：10:00~18:00</p>
                    </div>
                </div>
            </div>
            <!-- /.privacy_item-wrapper -->
        </div>
        <!-- /.l_container-sm -->
    </div>
    <!-- /.l_contents -->
</main>

<?php 
        endwhile;
        endif;
        ?>

<?php get_footer(); ?>