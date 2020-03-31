<?php

$af = function($p) {
	$sock = \acp\connect($p['address'], $p['port'], 3);
	$data = \acp\getText($sock, $p['packs']);
	\acp\suspend($sock);
	return $data;
};
