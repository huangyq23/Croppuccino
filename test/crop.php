<?php
$filename = '10.png';
$viewport_center_x=$_GET['x'];
$viewport_center_y=$_GET['y'];
$viewport_width=$_GET['width'];
$viewport_height=$_GET['height'];
$viewport_coord_x=$viewport_center_x-$viewport_width/2;
$viewport_coord_y=$viewport_center_y-$viewport_height/2;
// Content type
header('Content-Type: image/jpeg');
$width=100;
$height=100;
// Resample
$image_p = imagecreatetruecolor($width, $height);
$image = imagecreatefrompng($filename);
imagecopyresampled($image_p, $image, 0, 0, $viewport_coord_x, $viewport_coord_y, $width, $height, $viewport_width, $viewport_height);

// Output
imagejpeg($image_p, null, 100);
?>