<?php
/**
 * Plugin Name:  Comentarios Dynamics
 * Plugin URI:   http://dynamics-360.com/
 * Description:  Enables custom recent comments widget with extra features.
 * Version:      1.0
 * Author:       Dynamics-360
 * Author URI:   http://dynamics-360.com/
 * Author Email: info@6dynamics-360.com
 * Text Domain:  comments-widget-plus
 * Domain Path:  /languages
 * License:      GPL 2.0
 * License URI:  http://www.gnu.org/licenses/gpl-2.0.html
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) exit;

if ( ! class_exists( 'Comments_Widget_Plus_D360' ) ) {

	class Comments_Widget_Plus_D360 {

		/**
		 * PHP5 constructor method.
		 *
		 * @since  1.0.0
		 */
		public function __construct() {

			// Set the constants needed by the plugin.
			add_action( 'plugins_loaded', array( &$this, 'constants' ), 1 );

			// Internationalize the text strings used.
			//add_action( 'plugins_loaded', array( &$this, 'i18n' ), 2 );

			// Load the functions files.
			add_action( 'plugins_loaded', array( &$this, 'includes' ), 3 );

			// Register widget.
			add_action( 'widgets_init', array( &$this, 'register_widget' ) );

			// Loads admin style & script.
			add_action( 'admin_enqueue_scripts', array( &$this, 'admin_scripts' ) );
			add_action( 'customize_controls_enqueue_scripts', array( &$this, 'admin_scripts' ) );

		}

		/**
		 * Defines constants used by the plugin.
		 *
		 * @since  1.0.0
		 */
		public function constants() {

			// Set constant path to the plugin directory.
			define( 'CWP_360_DIR', trailingslashit( plugin_dir_path( __FILE__ ) ) );

			// Set the constant path to the plugin directory URI.
			define( 'CWP_360_URI', trailingslashit( plugin_dir_url( __FILE__ ) ) );

			// Set the constant path to the includes directory.
			define( 'CWP_360_INCLUDES', CWP_360_DIR . trailingslashit( 'includes' ) );

			// Set the constant path to the assets directory.
			define( 'CWP_360_ASSETS', CWP_360_URI . trailingslashit( 'assets' ) );

		}

		/**
		 * Loads the translation files.
		 *
		 * @since  1.0.0
		 */
		//public function i18n() {
		//	load_plugin_textdomain( 'comments-widget-plus', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
		//}

		/**
		 * Loads the initial files needed by the plugin.
		 *
		 * @since  1.0.0
		 */
		public function includes() {
			require_once( CWP_360_INCLUDES . 'functions.php' );
			require_once( CWP_360_INCLUDES . 'widget.php' );
            require_once( CWP_360_INCLUDES . 'Comentario.php' );
		}

		/**
		 * Register the widget.
		 *
		 * @since  1.0.0
		 */
		public function register_widget() {
			register_widget( 'Comments_Widget_Plus_Widget_D360' );
		}

		/**
		 * Loads custom style & script for the widget settings.
		 *
		 * @since  1.0.0
		 */
		public function admin_scripts() {
			wp_enqueue_style( 'cwp-admin-style', trailingslashit( CWP_360_ASSETS ) . 'css/cwp-360-admin.css' );
			wp_enqueue_script( 'cwp-admin-script', trailingslashit( CWP_360_ASSETS ) . 'js/cwp-admin.js', array( 'jquery-ui-tabs' ) );
		}

	}

}

new Comments_Widget_Plus_D360;
