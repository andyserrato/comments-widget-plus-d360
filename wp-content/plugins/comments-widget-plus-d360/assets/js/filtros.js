var filtrosDesplegados = false;
var botonSubmitFiltros = '<div width="100%" id="container_boton_submit"><button id="boton_submit" type="button">BUSCAR</button></div>';
//var consultaAnterior = "select distinct(co.comment_ID), po.ID as post_id, co.comment_author_email as email, co.comment_author as autor, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date from wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID WHERE co.comment_date > DATE_SUB(NOW(), INTERVAL 12 MONTH) AND cm.meta_key = 'wpdiscuz_votes' AND co.comment_approved = 1 ORDER BY co.comment_date DESC";
var consultaAnterior = "SELECT DISTINCT(co.comment_ID), po.ID AS post_id, co.comment_author_email AS email, co.comment_author AS autor, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date FROM wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID JOIN wp_term_relationships term_relationships ON po.ID = term_relationships.object_id JOIN wp_term_taxonomy term_taxonomy ON term_relationships.term_taxonomy_id = term_taxonomy.term_taxonomy_id WHERE co.comment_date > DATE_SUB(NOW(), INTERVAL 12 MONTH) AND cm.meta_key = 'wpdiscuz_votes' AND co.comment_approved = 1 ORDER BY co.comment_date DESC";
var numeroPagina = 1;
var estaPidiendo = false;
var existenComentarios = true;
numeroComentario = 20;

var plantillaComentario = '<div class="card-1">' +
    '<div style="width: 100%; display: inline-block">' +
    '<div class="titulo">TITULO</div>' +
    '<div class="categoria">CATEGORIA</div>' +
    '</div>' +
    '<div>' +
    //'<div style="height: 100%; vertical-align: top; display: inline-block" class="contenedor_avatar"><a href="HREFAUTOR"><div class="avatar2">AVATAR</div></a></div>' +
    'HREFAUTOR' +
        '<div id="contenido_NUMERO_COMENTARIO" onclick="desplegar(NUMERO_COMENTARIO4, this)" href="HREF_POST" class="contenido">CONTENIDO_COMENTARIO</div>' +
    '</div>' +

    '<div>' +
    '<div style="display:inline-block">' +
    '<div class="boton_social"><a target="_blank" href="ENLACE_FACEBOOK"><i class="fa fa-facebook-official" aria-hidden="true"></i></a></div>' +
    '<div class="boton_social"><a target="_blank" href="ENLACE_TWITTER"><i class="fa fa-twitter" aria-hidden="true"></i></a></div>' +
    '</div>' +
    '<div class="botonera">' +
    '<div class="boton" onclick="desplegarLeerMas(NUMERO_COMENTARIO2)"><a>Leer <i class="fa fa-plus" aria-hidden="true"></i></a></div>' +
    '<div class="boton"><a href="ENLACE">Continuarlo <i class="fa fa-commenting-o" aria-hidden="true"></i></a></div>' +
    '</div>' +
    '</div>' +
    '</div>' +

    '<div class="separator"></div>';

var noHayComentarios =  '<div class="consulta_error">' +
    '<div class="separator"></div>' +
    '<div class="mensaje_consulta_error">No existen comentarios con los criterios utilizados</div>' +
    '<div width="100%" class="container_boton_consulta"><button id="boton_consulta_error" type="button" onclick="recargarPagina()">Volver a Comentarios</button></div>' +
    '<div class="separator"></div>' +
    '</div>';

var errorConsultaAjax = '<div class="consulta_error" style="width: 100%; display: inline-block">' +
    '<div class="separator"></div>' +
    '<div class="mensaje_consulta_error">Oops! ha ocurrido un error en la consulta</div>' +
    '<div width="100%" class="container_boton_consulta"><button id="boton_consulta_error" type="button" onclick="recargarPagina()">Recargar Página</button></div>' +
    '<div class="separator"></div>' +
    '</div>';

function recargarPagina() {
    jQuery('#boton_filtrar').hide();
	jQuery('#icono_filtrar').hide();
    jQuery('#spinner_comentarios').show();
    jQuery('.consulta_error').remove();

    filtrosDesplegados = false;
    //consultaAnterior = "select distinct(co.comment_ID), po.ID as post_id, co.comment_author_email as email, co.comment_author as autor, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date from wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID WHERE co.comment_date > DATE_SUB(NOW(), INTERVAL 6 MONTH) AND cm.meta_key = 'wpdiscuz_votes' AND co.comment_approved = 1 ORDER BY co.comment_date DESC";
    consultaAnterior = "SELECT DISTINCT(co.comment_ID), po.ID AS post_id, co.comment_author_email AS email, co.comment_author AS autor, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date FROM wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID JOIN wp_term_relationships term_relationships ON po.ID = term_relationships.object_id JOIN wp_term_taxonomy term_taxonomy ON term_relationships.term_taxonomy_id = term_taxonomy.term_taxonomy_id WHERE co.comment_date > DATE_SUB(NOW(), INTERVAL 12 MONTH) AND cm.meta_key = 'wpdiscuz_votes' AND co.comment_approved = 1 ORDER BY co.comment_date DESC";
    numeroPagina = 1;
    estaPidiendo = false;
    consulta = consultaAnterior + " LIMIT 20";
    //console.log("recargarPagina");
    //console.log(consulta);
    peticionAjaxComentarios(consulta, false);
    jQuery("html, body").animate({ scrollTop: 0 }, "slow");
}

jQuery('#siguiendo').click(function (){
    jQuery('#no_siguiendo').prop('checked', false);
});

jQuery('#no_siguiendo').click(function (){
    jQuery('#siguiendo').prop('checked', false);
});

jQuery('#mas_votados').click(function (){
    jQuery('#menos_votados').prop('checked', false);
});

jQuery('#menos_votados').click(function (){
    jQuery('#mas_votados').prop('checked', false);
});

jQuery('#boton_filtrar').click(function (){

    if (filtrosDesplegados) {
        jQuery('#contenedor_filtros').hide();
        jQuery('#boton_filtrar').css('background-color', "transparent");
        filtrosDesplegados = false;
    }else {
        jQuery('#contenedor_filtros').show();
        jQuery('#boton_filtrar').css('background-color', "#f2f2f2");
        filtrosDesplegados = true;
		jQuery("#fila_filtros").show();
		jQuery('#filtro_categorias_contenido').show();

		jQuery('#filtro_categorias').css('background-color', "#75447C");
		jQuery('#filtro_temporal').css('background-color', "#f6f6f6");
		jQuery('#filtro_votos').css('background-color', "#f6f6f6");
		jQuery('#filtro_followers').css('background-color', "#f6f6f6");
		
		jQuery('#filtro_temporalidad_contenido').hide();
		jQuery('#filtro_votos_contenido').hide();
		jQuery('#filtro_followers_contenido').hide();
    }
});
jQuery('#icono_filtrar').click(function (){

    if (filtrosDesplegados) {
        jQuery('#contenedor_filtros').hide();
        
        filtrosDesplegados = false;
    }else {
        jQuery('#contenedor_filtros').show();
		
        
        filtrosDesplegados = true;
		jQuery("#fila_filtros").show();
		jQuery('#filtro_categorias_contenido').show();
		
		jQuery('#filtro_categorias').css('background-color', "#75447C");
		jQuery('#filtro_temporal').css('background-color', "#f6f6f6");
		jQuery('#filtro_votos').css('background-color', "#f6f6f6");
		jQuery('#filtro_followers').css('background-color', "#f6f6f6");
		
		jQuery('#filtro_temporalidad_contenido').hide();
		jQuery('#filtro_votos_contenido').hide();
		jQuery('#filtro_followers_contenido').hide();
    }
});
jQuery('#boton_cerrar_filtros').click(function (){
    jQuery('#contenedor_filtros').hide();
});

jQuery(document).ready( function (){

    jQuery('.avatar2 img').removeClass();
    jQuery('.avatar2 img').addClass("avatar");

    //Insertamos los filtros
        filtros = '<div id="filtro_categorias_contenido" style="display: none;"><div style="display: table;width:100%;clear: both;>"<div style="display: table-row;">';
    for (i = 0; i < categoriasJS.length; i++){
       if (i == 0){
			
            filtros += '<div class="categoriaTDTotal"><input class="checkbox_categoria" type="checkbox" checked value="' + categoriasJS[i].id + '"/><label></label>' + categoriasJS[i].nombre + '</div>';
			filtros += '<div class="opciones_tabla">';
		}else{
			if ( i == 3 || i == 6){
			filtros += '<div class="categoriaTD"><input class="checkbox_categoria" type="checkbox" value="' + categoriasJS[i].id + '"/><label></label>' + categoriasJS[i].nombre + '</div></div><div class="opciones_tabla">'
			}else{
            filtros += '<div class="categoriaTD"><input class="checkbox_categoria" type="checkbox" value="' + categoriasJS[i].id + '"/><label></label>' + categoriasJS[i].nombre + '</div>';
			}
			if (i == 10){
				filtros += '</div>';
			}
	   }
}


      filtros +=  '</div></div></div><div id="filtro_temporalidad_contenido" style="margin-top: 5px;display:none">' +
                                        '<select  id="temporalidad" name="temporalidad" style="margin-bottom: 0px">' +
                                            '<option value="1">Los más recientes</option>' +
                                            '<option value="2">De la última semana</option>' +
                                            '<option value="3">Del último mes</option>' +
                                            '<option value="4">De los últimos 6 meses</option>' +
                                            '<option value="5">Del último año</option>' +
                                            '<option selected="selected"  value="6">Todos</option>' +
                                        '</select>' +
                                    '</div>' +


                                    '<div id="filtro_votos_contenido" style="margin-top: 5px;display:none">' +
                                        '<input class="checkbox_general" id="mas_votados" type="checkbox"/><label></label>Más votados<span style="margin-right:20px;"></span>' +
                                        '<input class="checkbox_general" id="menos_votados" type="checkbox"/><label></label>Menos votados' +
                                    '</div>'+

                                    '<div id="filtro_followers_contenido" style="margin-top: 5px;display:none">' +
                                        '<input class="checkbox_general" id="siguiendo" type="checkbox"/><label></label>Siguiendo <span style="margin-right:20px;"></span>' +
                                        '<input class="checkbox_general" id="no_siguiendo" type="checkbox"/><label></label>No Siguiendo' +
                                    '</div>' + botonSubmitFiltros;


    jQuery('#filtros_contenido').html(filtros);

    setButtonListener();
    setCheckboxCategoriasListeners();


    jQuery(window).scroll(function() {
        if(jQuery(window).scrollTop() > 0) {
            scroll = jQuery(window).scrollTop();
            altoCuerpo = jQuery( '#contenido' ).height();
            //console.log("evento scroll" + (altoCuerpo - scroll));

            if (altoCuerpo - scroll < 320 && existenComentarios){
                //Aqui cargamos mas comentarios
                getMoreComments();
            }
        }
    });

});



function getMoreComments(){
    consulta = consultaAnterior + " LIMIT " + (numeroPagina * 20) + ", 20";
    console.log("Pagina:" + numeroPagina);

    if (!estaPidiendo) {
        estaPidiendo = true;
        //Mostramos el spinner
        //console.log(consulta);
        jQuery('#spinner_comentarios').show();
        peticionAjaxComentarios(consulta, true);
    }
}


jQuery("#boton_filtrar").hover(function(){
    jQuery('#boton_filtrar').css('background-color', "#f2f2f2");
});


jQuery("#boton_filtrar").mouseleave(function(){
    if (!filtrosDesplegados) {
        jQuery('#boton_filtrar').css('background-color', "transparent");
    }
});



jQuery("#filtro_categorias").click(function(){
    jQuery("#fila_filtros").show();

    jQuery('#filtro_categorias_contenido').show();
    jQuery('#circuloContenido').show(); 
	jQuery('#iconoContenido').show(); 
    jQuery('#filtro_temporalidad_contenido').hide();
    jQuery('#filtro_votos_contenido').hide();
    jQuery('#filtro_followers_contenido').hide();
		jQuery('#filtro_categorias').css('background-color', "#75447C");
		jQuery('#filtro_temporal').css('background-color', "#f6f6f6");
		jQuery('#filtro_votos').css('background-color', "#f6f6f6");
		jQuery('#filtro_followers').css('background-color', "#f6f6f6");

});

jQuery("#filtro_temporal").click(function(){
    jQuery("#fila_filtros").show();
jQuery('.icono').css('background-color', "#fff");

    jQuery('#filtro_categorias_contenido').hide();
    jQuery('#filtro_temporalidad_contenido').show();
    jQuery('#filtro_votos_contenido').hide();
    jQuery('#filtro_followers_contenido').hide();
	jQuery('#filtro_categorias').css('background-color', "#f6f6f6");
	jQuery('#filtro_temporal').css('background-color', "#75447C");
	jQuery('#filtro_votos').css('background-color', "#f6f6f6");
	jQuery('#filtro_followers').css('background-color', "#f6f6f6");

});

jQuery("#filtro_votos").click(function(){
    jQuery("#fila_filtros").show();

    jQuery('#filtro_categorias_contenido').hide();
    jQuery('#filtro_temporalidad_contenido').hide();
    jQuery('#filtro_votos_contenido').show();
    jQuery('#filtro_followers_contenido').hide();
	jQuery('#filtro_categorias').css('background-color', "#f6f6f6");
	jQuery('#filtro_temporal').css('background-color', "#f6f6f6");
	jQuery('#filtro_votos').css('background-color', "#75447C");
	jQuery('#filtro_followers').css('background-color', "#f6f6f6");

});

jQuery("#filtro_followers").click(function(){
    jQuery("#fila_filtros").show();

    jQuery('#filtro_categorias_contenido').hide();
    jQuery('#filtro_temporalidad_contenido').hide();
    jQuery('#filtro_votos_contenido').hide();
    jQuery('#filtro_followers_contenido').show();
	
	jQuery('#filtro_categorias').css('background-color', "#f6f6f6");
	jQuery('#filtro_temporal').css('background-color', "#f6f6f6");
	jQuery('#filtro_votos').css('background-color', "#f6f6f6");
	jQuery('#filtro_followers').css('background-color', "#75447C");

});

function setButtonListener(){
    jQuery('#boton_submit').click(function () {
        jQuery('#contenedor_filtros').hide();
        jQuery('#boton_filtrar').hide();
		jQuery('#icono_filtrar').hide();
        jQuery('#spinner_comentarios').show();
        jQuery('#contenido').hide();

        jQuery('#boton_filtrar').css('background-color', "transparent");

        filtrosDesplegados = false;
        //console.log("submit");
        //Vaciamos el array de comentarios
        //console.log(comentarios);

        comentarios = [];
        numeroComentario = 0;
        numeroPagina = 0;

        //QUITAR
        temporalidad = jQuery('#temporalidad').prop('selectedIndex');
        masVotado = false;
        menosVotado = false;
        siguiendo = "nada";

        if (jQuery('#siguiendo').prop('checked'))
            siguiendo = true;

        if (jQuery('#no_siguiendo').prop('checked'))
            siguiendo = false;

        if (jQuery('#menos_votados').prop('checked')) {
            menosVotado = true;
        }

        if (jQuery('#mas_votados').prop('checked')) {
            masVotado = true;
        }

        //console.log('Temporalidad:' + temporalidad);
        //console.log('Siguendo:' + siguiendo);
        //console.log('Mas votado:' + masVotado);


        //consulta = "select distinct(co.comment_ID), po.ID as post_id, co.comment_author_email as email, co.comment_author as autor, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date from wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID WHERE 1 = 1 ";
        consulta = "select distinct(co.comment_ID), po.ID as post_id, co.comment_author_email as email, co.comment_author as autor, co.comment_content, CONVERT(SUBSTRING_INDEX(cm.meta_value,\"-\",-1),UNSIGNED INTEGER) AS num_votos, co.comment_date from wp_comments co JOIN wp_posts po ON co.comment_post_ID = po.ID JOIN wp_postmeta pm ON po.ID = pm.post_id JOIN wp_commentmeta cm ON cm.comment_id = co.comment_ID JOIN wp_term_relationships term_relationships ON po.ID = term_relationships.object_id JOIN wp_term_taxonomy term_taxonomy ON term_relationships.term_taxonomy_id = term_taxonomy.term_taxonomy_id WHERE 1 = 1";
        switch (temporalidad) {
            case 0:
                //Ultimo día
                consulta += " AND co.comment_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)";
                break;
            case 1:
                consulta += " AND co.comment_date > DATE_SUB(NOW(), INTERVAL 7 DAY)";
                break;
            case 2:
                consulta += " AND co.comment_date > DATE_SUB(NOW(), INTERVAL 1 MONTH)";
                break;
            case 3:
                consulta += " AND co.comment_date > DATE_SUB(NOW(), INTERVAL 6 MONTH)";
                break;
            case 4:
                consulta += " AND co.comment_date > DATE_SUB(NOW(), INTERVAL 1 YEAR)";
                break;
        }

        if (siguiendo !== 'nada') {
            if (siguiendo) {
                consulta += " AND co.user_id IN (SELECT fo.user_id1 from wp_um_followers fo where fo.user_id2 = " + idUsuario + ") ";
            } else {
                consulta += " AND co.user_id NOT IN (SELECT fo.user_id1 from wp_um_followers fo where fo.user_id2 = " + idUsuario + ") ";
            }
        }

        //Obtenemos las categorias
        checksChecked = jQuery('input:checkbox[class=checkbox_categoria]:checked');
        strCategorias = "("

        if (checksChecked.length > 0) {
            if (checksChecked[0].value != 0) {
                for (i = 0; i < checksChecked.length; i++){
                    strCategorias += checksChecked[i].value + ",";
                }
            }
        }

        strCategorias = strCategorias.substr(0, strCategorias.length - 1);
        strCategorias += ")"

        if (strCategorias != ")") {
            //consulta += " AND pm.meta_value IN " + strCategorias;
            consulta += " AND term_taxonomy.term_id IN " + strCategorias;
        }


        consulta += " AND co.comment_approved = 1 AND cm.meta_key = 'wpdiscuz_votes' ORDER BY co.comment_date DESC ";

        if (masVotado){
            consulta += " ,num_votos DESC ";
        }else if (menosVotado){
            consulta += " ,num_votos ASC ";
        }


        consultaAnterior = consulta;
        //alert(consulta);
        consulta += " LIMIT 20;";

        //console.log(consulta);

        peticionAjaxComentarios(consulta, false);

    });
}


function setCheckboxCategoriasListeners(){
    checks = jQuery('.checkbox_categoria');

    for (i = 0; i < checks.length; i++){
        checks[i].addEventListener("change", function(){
            checksChecked = jQuery('input:checkbox[class=checkbox_categoria]:checked');

            //console.log(checksChecked);

            if (checksChecked.length == 0){
                checks[0].checked = true;
            }else{
                if (this.value != 0) {
                    checks[0].checked = false;
                }else{
                    if (checks[0].checked == true){
                        jQuery('input:checkbox[class=checkbox_categoria]:checked').removeAttr('checked');
                        checks[0].checked = true;
                    }
                }
            }
        });
    }
}



function peticionAjaxComentarios(consulta, paginacion){

    //console.log("pido");
    jQuery.ajax({
        // la URL para la petición
        url : "../wp-content/plugins/comments-widget-plus-d360/includes/get_comments.php",
        //url : MyAjax.ajaxurl,
        //ajaxurl+"?action=get_comments_ajax",

        // la información a enviars
        // (también es posible utilizar una cadena de datos)
        data : { consulta: encodeURI(consulta), action : 'cwp_360_get_comments_ajax' },

        // especifica si será una petición POST o GET
        type : 'POST',

        // el tipo de información que se espera de respuesta
        dataType : 'text',

        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success : function(result) {
            //alert(result);
            comments = JSON.parse(result);
            commentsHTML = "";
            //alert(result);
            //console.log(comments);
            // si tenemos resultados
            if (typeof comments !== 'undefined' && comments.length > 0) {
                existenComentarios = true;
                for (i = 0 ; i < comments.length ; i++ ) {
                    //alert(comment.comment_ID);
                    nuevoComentario = plantillaComentario;
                    //Sustituimos los valores de la plantilla por el contenido
                    contenido = "";

                    if (comments[i].contenido.length > 250){
                        contenido = comments[i].contenido.substr(0, 250) + "...";
                    }else{
                        contenido = comments[i].contenido;
                    }

                    nuevoComentario = nuevoComentario.replace("TITULO", comments[i].titulo);
                    nuevoComentario = nuevoComentario.replace("CONTENIDO_COMENTARIO", contenido);
                    nuevoComentario = nuevoComentario.replace("HREF_POST", comments[i].enlace_post_href);
                    nuevoComentario = nuevoComentario.replace("NUMERO_COMENTARIO", numeroComentario);
                    nuevoComentario = nuevoComentario.replace("NUMERO_COMENTARIO2", numeroComentario);
                    nuevoComentario = nuevoComentario.replace("NUMERO_COMENTARIO3", numeroComentario);
                    nuevoComentario = nuevoComentario.replace("NUMERO_COMENTARIO4", numeroComentario);

                    nuevoComentario = nuevoComentario.replace("AVATAR", comments[i].avatar);
                    nuevoComentario = nuevoComentario.replace("ENLACE", comments[i].enlace);
                    nuevoComentario = nuevoComentario.replace("ENLACE_FACEBOOK", comments[i].enlace_facebook);
                    nuevoComentario = nuevoComentario.replace("ENLACE_TWITTER", comments[i].enlace_twitter);
                    nuevoComentario = nuevoComentario.replace("HREFAUTOR", comments[i].enlace_autor);
                    nuevoComentario = nuevoComentario.replace("CATEGORIA", comments[i].categoria_sin_acentos);

                    commentsHTML += nuevoComentario;
                    //Anyadimos el comentario al array de comentarios
                    comentarios.push(comments[i].contenido);
                    //console.log("anyado");

                    numeroComentario++;
                    //console.log(comentarios);
                }


                if (paginacion) {
                    jQuery('#contenido').html(jQuery('#contenido').html() + commentsHTML);
                }else {
                    jQuery('#contenido').html(commentsHTML);
                }

                jQuery('.avatar2 img').removeClass();
                jQuery('.avatar2 img').addClass("avatar");

                estaPidiendo = false;
                jQuery('#spinner_comentarios').hide();
                jQuery('#boton_filtrar').show();
				jQuery('#icono_filtrar').show();
                jQuery('#contenido').show();

                numeroPagina++;
                //console.log(consulta);
            } else { // no hay resultados
                estaPidiendo = false;
                existenComentarios = false;

                if (paginacion) {
                    jQuery('#contenido').html(jQuery('#contenido').html() + noHayComentarios);
                }else {
                    jQuery('#contenido').html(noHayComentarios);
                }

                jQuery('#spinner_comentarios').hide();
                jQuery('#boton_filtrar').show();
				jQuery('#icono_filtrar').show();
                jQuery('#contenido').show();
            }


        },

        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error : function(xhr, status) {
            estaPidiendo = false;
            jQuery('#contenido').html(errorConsultaAjax);
            jQuery('#spinner_comentarios').hide();
            jQuery('#boton_filtrar').show();
			jQuery('#icono_filtrar').show();
            jQuery('#contenido').show();
        }
    });


}