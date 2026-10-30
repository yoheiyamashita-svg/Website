<!-- アクセスしたURLにページが存在しなかった場合に表示されるページ -->
<?php get_header(); ?>

<main class="l_main notfound_main">
    <?php get_template_part('m_kv'); ?>

    <div class="l_contents">
        <div class="l_container-lg">
            <p class="notfound_txt">
                申し訳ございません。orz <br>
                指定されたファイルまたはディレクトリは存在いたしません。
            </p>
        </div>
        <!-- /.l_contents -->
    </div>
    <!-- /.l_contents -->
</main>

<?php get_footer(); ?>