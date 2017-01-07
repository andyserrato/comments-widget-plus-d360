<?php
/**
 * Various functions used by the plugin.
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Sets up the default arguments.
 */
function cwp_360_get_default_args() {

	$defaults = array(
		'title'         => esc_attr__( 'ÚLTIMOS MICRORRELATOS', 'comments-widget-plus-d360' ),
		'title_url'     => '',
		'post_type'     => 'post',
		'limit'         => 5,
		'offset'        => '',
		'order'         => 'DESC',
		'exclude_pings' => 0,
		'avatar'        => 0,
		'avatar_size'   => 55,
		'avatar_type'   => 'rounded',
		'excerpt'       => 0,
		'excerpt_limit' => 50,
		'css_class'     => '',
        'cat_ID'        => (isset($instance['cat_ID']) ? array_map('absint', $instance['cat_ID']) : array("0")),
        'trend_walls'   => 5,
	);

	// Allow plugins/themes developer to filter the default arguments.
	return apply_filters( 'cwp_360_default_args', $defaults );

}

/**
 * Generates the recent comments markup.
 */
function cwp_360_get_recent_comments( $args, $id ) {

	// Merge the input arguments and the defaults.
	$args = wp_parse_args( $args, cwp_360_get_default_args() );

	// Extract the array to allow easy use of variables.
	extract( $args );

	// Allow devs to hook in stuff before the recent comments.
	do_action( 'cwp_360_before_loop_' . $id );

    wp_enqueue_style( 'estilos', trailingslashit( CWP_360_ASSETS ) . 'css/estilos.css' );
    wp_enqueue_script( 'filtros-script', trailingslashit( CWP_360_ASSETS ) . 'js/filtros.js' , array ( 'jquery' ), 1.5, true);
    wp_localize_script( 'filtros-script', 'MyAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
    // declare the URL to the file that handles the AJAX request

    $categorias = get_categories();
    $categoriasFiltradas = array();

    array_push($categoriasFiltradas, "{id: 0,nombre:'Todas'}");

    foreach ($categorias as $categoria){
        //echo $categoria->term_id;
        if (in_array($categoria->term_id, $args["cat_ID"])){
            array_push($categoriasFiltradas, "{id: ".$categoria->term_id .",nombre:'".$categoria->name."'}");
        }
    }

    //Comentarios iniciales
    global $wpdb;
    //$consulta = "select distinct(co.comment_ID), po.ID as post_id, co.comment_author_email as email, co.comment_author as autor, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date from wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID WHERE co.comment_date > DATE_SUB(NOW(), INTERVAL 12 MONTH) AND cm.meta_key = 'wpdiscuz_votes' AND co.comment_approved = 1 ORDER BY co.comment_date DESC LIMIT 20";
    $consulta = "SELECT DISTINCT(co.comment_ID), po.ID AS post_id, co.comment_author_email AS email, co.comment_author AS autor, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date FROM wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID JOIN wp_term_relationships term_relationships ON po.ID = term_relationships.object_id JOIN wp_term_taxonomy term_taxonomy ON term_relationships.term_taxonomy_id = term_taxonomy.term_taxonomy_id WHERE co.comment_date > DATE_SUB(NOW(), INTERVAL 12 MONTH) AND cm.meta_key = 'wpdiscuz_votes' AND co.comment_approved = 1 ORDER BY co.comment_date DESC LIMIT 20";
    $comentarios = $wpdb->get_results($consulta);
    $html = '';

    $html .= getPostsMasRecientesSegunCantidadComentarios($args);

    //Seteamos el user de wordpress en una variable de Javascript
    $html .= "<script> idUsuario = ".get_current_user_id().";</script>";

    $html .= "<script> var comentarios = new Array();
    function desplegar(numero){ jQuery('#contenido_' + numero).html(comentarios[numero]);}
    </script>";

    foreach ($comentarios as $comentario){
        $html .= "<script>comentarios.push(".json_encode($comentario->comment_content).");</script>";
    }

    $html .= "<script>var categoriasJS = [] </script>";

    for ($i = 0; $i < count($categoriasFiltradas); $i++){
        $html .= "<script> categoriaJS = ".$categoriasFiltradas[$i]."; categoriasJS.push(categoriaJS);</script>";
    }


    $html .= '<div style="margin-top:10px;"><div id="cwp_sticky" style="text-align:center" ><div id="boton_filtrar">
                                        <i class="fa fa-filter" aria-hidden="true"> FILTRAR</i>
                                        </div></div>
                <div id="contenedor_filtros">';

        //Fonts Awesome
        $html .= "<script src=\"https://use.fontawesome.com/4b5c5cb404.js\"></script>";

        $html .= '<table>';
            $html .= '<tr>';
               $html .= '<td align="center" id="filtro_categorias"><i class="fa fa-tags" aria-hidden="true"></i></td>';
               $html .= '<td align="center" id="filtro_temporal"><i class="fa fa-calendar" aria-hidden="true"></i></td>';
               $html .= '<td align="center" id="filtro_votos"><i class="fa fa-thumbs-up" aria-hidden="true"></i></td>';
               $html .= '<td align="center" id="filtro_followers"><i class="fa fa-users" aria-hidden="true"></i></td>';
            $html .= '</tr>';

            $html .= '<tr id="fila_filtros" style="display: none;">';
                $html .= "<td id='filtros_contenido' colspan='4'></td>";
            $html .= '</tr>';

        $html .= '</table>';

        $html .= "</div>";


    $html .= '<div id="contenido">';

    $numeroComentario = 0;



    foreach ($comentarios as $comentario){
        $category_detail = get_the_category($comentario->post_id)[0];

        $html .= '<div class="card-1">';
        $html .= "<div style='width: 100%; display: inline-block'>";
        $html .= '<div class="titulo"><a href="'."../user/". get_comment_author_link( $comentario->comment_ID ).'">'.$comentario->autor.'</a> en <a href="'.get_post_permalink($comentario->post_id).'">'.get_the_title( $comentario->post_id ).'</a></div>';
        $html .= '<div class="categoria">'.'<a href="../'.remove_accents(strtolower($category_detail->name)).'">'.$category_detail->name.'</a></div>';
        $html .= "</div>";
        $html .= '<div><a href="'."../user/".get_comment_author_link( $comentario->comment_ID ).'"><div style="height: 100%; vertical-align: top; display: inline-block" class="contenedor_avatar"><div class="avatar2">'.get_avatar( $comentario->email, $args['avatar_size'] ).'</div></div></a>';
        $html .= '<div onclick="desplegar('.$numeroComentario.')" id="contenido_'.$numeroComentario.'" class="contenido">';

        if (strlen($comentario->comment_content) > 250)
            $html .= substr($comentario->comment_content, 0, 250)."...";
        else
            $html .= $comentario->comment_content;

        $html .= '</div>';

        $html .= '</div>';

        $html .= '<div>';
            $html .= '<div style="display:inline-block">';
                $html .= '<div class="boton_social"><a target="_blank" href="'.getLinkFacebookShare($comentario).'"><i class="fa fa-facebook-official" aria-hidden="true"></i></a></div>';
                $html .= '<div class="boton_social"><a target="_blank" href="'.getLinkTwitterShare($comentario).'"><i class="fa fa-twitter" aria-hidden="true"></i></a></div>';
            $html .= '</div>';

            $html .= '<div class="botonera">';

                $html .= '<div class="boton" onclick="desplegar('.$numeroComentario.')"><a>Leer <i class="fa fa-plus" aria-hidden="true"></i></a></div>';
                $html .= '<div class="boton"><a href="'.esc_url( get_comment_link( $comentario->comment_ID )).'">Continuarlo <i class="fa fa-commenting-o" aria-hidden="true"></i></a></div>';
            $html .= '</div>';
        $html .= "</div>";
        $html .= '</div>';
        $html .= '<div class="separator"></div>';
        $numeroComentario++;
    }

    $html .= '</div><div id="spinner_comentarios" style="width: 100%; text-align:center; display:none; margin-top: 30px"><i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i></div>';
    $html .= '<a href="#top" title="Desplazarse hacia arriba" id="cwp-scroll-top-link" aria-hidden="true" data-av_icon="" data-av_iconfont="entypo-fontello" class="cwp_avia_pop_class"><span class="avia_hidden_link_text">Desplazarse hacia arriba</span></a>';
	// Allow devs to hook in stuff after the recent comments.
	do_action( 'cwp_after_loop_' . $id );

	// Return the comments markup.
	return $html;

}

/**
 * The recent comments query.
 */
function cwp_360_get_comments( $args, $id ) {
	// Arguments
	$query = array(
		'number'      => $args['limit'],
		'offset'      => $args['offset'],
		'order'       => $args['order'],
		'post_status' => 'publish',
		'post_type'   => $args['post_type'],
		'status'      => 'approve'
	);

	if ( $args['exclude_pings'] == 1 ) {
		$query['type__not_in'] = 'pings';
	}

	// Allow plugins/themes developer to filter the default comment query.
	$query = apply_filters( 'cwp_360_comments_args_' . $id, $query );

	// Get the comments.
	$comments = get_comments( $query );

	return $comments;

}

function getLinkFacebookShare($comentario){
    $link = urlencode( get_comment_link( $comentario->comment_ID ));
    $title = urlencode($comentario->autor .' en ' . get_the_title( $comentario->post_id ) . ' - Walnov' );
    $excerpt = urlencode($comentario->comment_content);
    $share_link = 'http://www.facebook.com/sharer.php?s=100&amp;p[title]=' . $title . '&amp;p[url]=' . $link . '&amp;p[summary]=' . $excerpt;
    return $share_link ;

}

function getLinkTwitterShare($comentario){
    $link = urlencode( get_comment_link( $comentario->comment_ID ));
    $title = urlencode($comentario->autor .' en ' . get_the_title( $comentario->post_id ) . ' - @Walnov_' );
    $share_link = 'https://twitter.com/intent/tweet?text=' . $title . ' ' . $link;
    return $share_link ;

}

function getPostsMasRecientesSegunCantidadComentarios($args) {
    $argumentos = array(
        'post_type'      => 'post',
        'numberposts'	 => $args['trend_walls'],
        'post_status'    => 'publish',
        'orderby' 		 => 'comment_count',
        'order' 		 => 'DESC'
        );
    print_r($args['trend_walls']);
    $my_posts = get_posts( $argumentos );
    $html_comments = '';
    if ($my_posts) {
        $html_comments .= '<h3>Tendencias</h3>';
        $html_comments .= '<div id="trend-walls">';
        foreach ($my_posts as $my_post) {
            $html_comments .= '<div class="trend-wall">';
            $html_comments .= '<a class="trend-walls-enlace" href="' . get_post_permalink($my_post->post_id) . '">' . $my_post->post_title . '</a>';
            $html_comments .= '<div class="trend-walls-commentarios">' . $my_post->comment_count . ' comentarios</div>';
            $html_comments .= '</div>';
        }
        $html_comments .= '</div>';
    }

    return $html_comments;
}

add_action( 'wp_ajax_nopriv_cwp_360_get_comments_ajax', 'cwp_360_get_comments_ajax' );
add_action( 'wp_ajax_cwp_360_get_comments_ajax', 'cwp_360_get_comments_ajax' );
function cwp_360_get_comments_ajax()
{
    global $wpdb;
    $query = stripslashes(urldecode($_POST['consulta']));

    $comments = $wpdb->get_results($query);
    $comentarios = array();

    foreach ($comments as $comment) {
        $comentario = new Comentario();

        $comentario->contenido = $comment->comment_content;
        $comentario->avatar = get_avatar($comment->email, $args['avatar_size']);
        $comentario->enlace = esc_url(get_comment_link($comment->comment_ID));
        $comentario->enlace_autor = "../user/" . get_comment_author_link($comment->comment_ID);
        $comentario->titulo = '<a href="' . $comentario->enlace_autor . '">' . $comment->autor . '</a> en <a href="' . get_post_permalink($comment->post_id) . '">' . get_the_title($comment->post_id) . '</a>';
        $comentario->enlace_facebook = getLinkFacebookShare($comment);
        $comentario->enlace_twitter = getLinkTwitterShare($comment);
        $category_detail = get_the_category($comment->post_id)[0];
        $comentario->categoria = '<a href="'.esc_url( get_category_link( $category_detail->term_id ) ).'">'.$category_detail->name."</a>";
        $comentario->categoria_sin_acentos = '<a href="'.remove_accents(strtolower($category_detail->name)).'">'.$category_detail->name."</a>";

        array_push($comentarios, $comentario);
    }

    wp_send_json($comentarios);

    wp_die();
}
