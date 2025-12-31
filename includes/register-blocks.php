<?php
function flexblocks_register_blocks() {
    $blocks = [
        'section',
        'columns',
        'column'
    ];

    foreach ( $blocks as $block ) {
        $path = dirname( __DIR__ ) . '/build/' . $block;
        if ( file_exists( $path . '/block.json' ) ) {
            register_block_type( $path );
        }
    }
}
add_action( 'init', 'flexblocks_register_blocks' );
