<?php

$path = $_SERVER['DOCUMENT_ROOT'];

include_once $path . '/wp-config.php';
include_once $path . '/wp-load.php';
include_once $path . '/wp-includes/wp-db.php';
include_once $path . '/wp-includes/pluggable.php';
    global $wpdb;
    $query = stripslashes(urldecode($_POST['consulta']));

    $comments = $wpdb->get_results($query);
    $comentarios = array();
    foreach ($comments as $comment) {
        $comentario = new Comentario();

        $comentario->contenido = $comment->comment_content;
        $comentario->enlace_post_href = get_post_permalink($comment->post_id);
        $comentario->avatar = get_avatar($comment->email, $args['avatar_size']);
        $comentario->enlace = esc_url(get_comment_link($comment->comment_ID));
        $comentario->enlace_autor = '<a href="'.get_site_url()."/user/".get_comment_author_link( $comment->comment_ID ).'"><div style="height: 100%; vertical-align: top; display: inline-block" class="contenedor_avatar"><div class="avatar2">'.get_avatar( $comment->email, $args['avatar_size'] ).'</div></div></a>';
        //$comentario->enlace_autor = '<a onclick="mostrarPerfil(this)" dir="'.get_site_url()."/user/".get_comment_author_link( $comment->comment_ID ).'"><div style="height: 100%; vertical-align: top; display: inline-block" class="contenedor_avatar"><div class="avatar2">'.get_avatar( $comment->email, $args['avatar_size'] ).'</div></div></a>';
        //$comentario->enlace_autor = "../user/" . get_comment_author_link($comment->comment_ID);
        $enlace_autor = "../user/" . get_comment_author_link($comment->comment_ID);
        $comentario->titulo = '<a href="' . $enlace_autor . '">' . $comment->autor . '</a> en <a href="' . get_post_permalink($comment->post_id) . '">' . get_the_title($comment->post_id) . '</a>';
        $comentario->enlace_facebook = getLinkFacebookShare($comment);
        $comentario->enlace_twitter = getLinkTwitterShare($comment);
        $category_detail = get_the_category($comment->post_id)[0];
        $comentario->categoria = '<a href="'.esc_url( get_category_link( $category_detail->term_id ) ).'">'.$category_detail->name."</a>";
        $comentario->categoria_sin_acentos = '<a href="'.remove_accents(strtolower($category_detail->name)).'">'.$category_detail->name."</a>";

        array_push($comentarios, $comentario);
    }

    wp_send_json($comentarios);
    wp_die();
?>
